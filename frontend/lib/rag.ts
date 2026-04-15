/**
 * ImmiFina RAG — Retrieval-Augmented Generation
 *
 * Retrieves relevant knowledge chunks from Supabase using
 * Voyage AI embeddings, then formats them for injection
 * into the Claude system prompt.
 *
 * Requires: VOYAGE_API_KEY in environment (server-side only)
 */

import { createServiceClient } from "@/lib/db";

export type KnowledgeChunk = {
  id: string;
  title: string;
  content: string;
  category: string;
  similarity: number;
};

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
const VOYAGE_MODEL = "voyage-3-lite";


// Minimum message length to bother doing retrieval.
// Skip embeddings for very short messages like "hi", "thanks", "ok".
const MIN_QUERY_LENGTH = 20;

// ── Embedding ─────────────────────────────────────────────────
async function getQueryEmbedding(text: string): Promise<number[] | null> {
  if (!VOYAGE_API_KEY) {
    console.warn("[rag] VOYAGE_API_KEY not set — skipping RAG retrieval");
    return null;
  }

  try {
    const response = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VOYAGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: VOYAGE_MODEL,
        input: [text],
        input_type: "query", // "query" for retrieval, "document" for indexing
      }),
    });

    if (!response.ok) {
      console.warn("[rag] Voyage API error:", response.status);
      return null;
    }

    const data = (await response.json()) as {
      data: { embedding: number[] }[];
    };

    return data.data[0]?.embedding ?? null;
  } catch (err) {
    console.warn("[rag] Embedding request failed:", err);
    return null;
  }
}

// ── Retrieval ─────────────────────────────────────────────────
export async function retrieveRelevantChunks(
  query: string,
  options: {
    limit?: number;
    threshold?: number;
    category?: string;
  } = {}
): Promise<KnowledgeChunk[]> {
  const { limit = 4, threshold = 0.68, category } = options;

  // Skip very short messages
  if (query.trim().length < MIN_QUERY_LENGTH) {
    return [];
  }

  const embedding = await getQueryEmbedding(query);
  if (!embedding) return [];

  const supabase = createServiceClient();

  try {
    const { data, error } = await supabase.rpc("match_knowledge_chunks", {
      query_embedding: `[${embedding.join(",")}]`,
      match_threshold: threshold,
      match_count: limit,
      filter_category: category ?? null,
    });

    if (error) {
      console.warn("[rag] RPC error:", error.message);
      return [];
    }

    return (data ?? []) as KnowledgeChunk[];
  } catch (err) {
    console.warn("[rag] Retrieval failed:", err);
    return [];
  }
}

// ── Format for Claude system prompt ───────────────────────────
/**
 * Formats retrieved chunks into a block to prepend to the system prompt.
 * Claude is instructed to prefer this content over general knowledge.
 */
export function formatKnowledgeBlock(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) return "";

  const entries = chunks
    .map(
      (c) =>
        `[TITLE: ${c.title}]\n[CATEGORY: ${c.category}]\n${c.content}`
    )
    .join("\n\n---\n\n");

  return `IMMIFINA KNOWLEDGE BASE — Use this content to answer the user's question. Prefer information from the knowledge base over your general training. If the knowledge base doesn't cover the topic, use your general knowledge and note that it's general guidance.

<knowledge_base>
${entries}
</knowledge_base>`;
}

// ── Combined helper (retrieve + format) ───────────────────────
export async function getKnowledgeContext(
  userMessage: string,
  options?: {
    limit?: number;
    threshold?: number;
    category?: string;
  }
): Promise<string> {
  const chunks = await retrieveRelevantChunks(userMessage, options);
  return formatKnowledgeBlock(chunks);
}
