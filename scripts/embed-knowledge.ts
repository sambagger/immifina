/**
 * ImmiFina Knowledge Base Embedding Script
 *
 * Chunks knowledge base articles by paragraph, generates embeddings
 * using Voyage AI (voyage-3-lite, 512 dims), and upserts into
 * the knowledge_chunks Supabase table.
 *
 * Usage:
 *   npx tsx scripts/embed-knowledge.ts           # embed all articles
 *   npx tsx scripts/embed-knowledge.ts --dry-run  # show what would happen
 *   npx tsx scripts/embed-knowledge.ts itin secured-cards  # specific slugs only
 *
 * Prerequisites:
 *   1. Run migration 005_rag.sql in Supabase SQL editor
 *   2. Add VOYAGE_API_KEY to .env.local (get from voyageai.com)
 *   3. npm install voyageai tsx dotenv
 *
 * Cost estimate: ~$0.0001 for the full v1 knowledge base (10 articles)
 */

import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { ARTICLES, type KnowledgeArticle } from "../frontend/lib/knowledge-base/articles";

// ── Load env ──────────────────────────────────────────────────
// Support both .env.local and process.env (for CI)
async function loadEnv() {
  try {
    const { config } = await import("dotenv");
    config({ path: new URL("../.env.local", import.meta.url).pathname });
    config({ path: new URL("../.env", import.meta.url).pathname });
  } catch {
    // dotenv not installed — rely on process.env
  }
}

// env vars resolved inside main() after loadEnv() runs
let SUPABASE_URL: string;
let SUPABASE_SERVICE_ROLE_KEY: string;
let VOYAGE_API_KEY: string;

// ── Args ──────────────────────────────────────────────────────
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const slugFilter = args.filter((a) => !a.startsWith("--"));

// ── Clients ───────────────────────────────────────────────────
// Initialized inside main() after env vars are loaded
let supabase: ReturnType<typeof createClient>;

// ── Voyage AI embedding ───────────────────────────────────────
async function embed(texts: string[]): Promise<number[][]> {
  const response = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "voyage-3-lite",
      input: texts,
      input_type: "document",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Voyage API error ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    data: { index: number; embedding: number[] }[];
  };

  // Sort by index (API guarantees order but let's be safe)
  return data.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

// ── Chunking ──────────────────────────────────────────────────
const MAX_CHUNK_CHARS = 1800; // ~450 tokens, safe for voyage-3-lite

function chunkArticle(article: KnowledgeArticle): { text: string; index: number }[] {
  const paragraphs = article.body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: { text: string; index: number }[] = [];
  let current = "";
  let chunkIndex = 0;

  for (const para of paragraphs) {
    // If adding this paragraph would exceed the limit, flush current
    if (current && current.length + para.length + 2 > MAX_CHUNK_CHARS) {
      chunks.push({ text: current.trim(), index: chunkIndex++ });
      current = para;
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }

  if (current.trim()) {
    chunks.push({ text: current.trim(), index: chunkIndex });
  }

  return chunks;
}

// ── Checksum ──────────────────────────────────────────────────
function checksum(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  // Load env first (no top-level await)
  await loadEnv();

  SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  VOYAGE_API_KEY = process.env.VOYAGE_API_KEY ?? "";

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }
  if (!VOYAGE_API_KEY) {
    console.error("❌ Missing VOYAGE_API_KEY in .env.local");
    console.error("   Get one at https://dash.voyageai.com/");
    process.exit(1);
  }

  // Initialize Supabase client now that env vars are loaded
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const articles = slugFilter.length > 0
    ? ARTICLES.filter((a) => slugFilter.includes(a.slug))
    : ARTICLES;

  if (articles.length === 0) {
    console.error("❌ No articles matched the provided slugs:", slugFilter);
    process.exit(1);
  }

  console.log(`\n🔍 ImmiFina Knowledge Base Embedder`);
  console.log(`   Mode: ${dryRun ? "DRY RUN (no DB writes)" : "LIVE"}`);
  console.log(`   Articles: ${articles.map((a) => a.slug).join(", ")}`);
  console.log(`   Model: voyage-3-lite (512 dims)\n`);

  let totalChunks = 0;
  let totalUpserted = 0;

  for (const article of articles) {
    const rawChunks = chunkArticle(article);
    console.log(`📄 ${article.slug} (${rawChunks.length} chunks)`);

    if (dryRun) {
      for (const c of rawChunks) {
        console.log(`   [${c.index}] ${c.text.slice(0, 80)}…`);
      }
      totalChunks += rawChunks.length;
      continue;
    }

    // Batch embed (Voyage supports up to 128 texts per request)
    const BATCH = 50;
    for (let i = 0; i < rawChunks.length; i += BATCH) {
      const batch = rawChunks.slice(i, i + BATCH);
      const texts = batch.map((c) => `${article.title}\n\n${c.text}`);

      let embeddings: number[][];
      try {
        embeddings = await embed(texts);
      } catch (err) {
        console.error(`   ❌ Embedding failed for batch starting at chunk ${i}:`, err);
        process.exit(1);
      }

      // Build upsert rows
      const rows = batch.map((chunk, j) => ({
        article_slug: article.slug,
        chunk_index: chunk.index,
        title: article.title,
        content: chunk.text,
        category: article.category,
        tags: article.tags,
        embedding: `[${embeddings[j].join(",")}]`, // pgvector string format
        source: "ImmiFina Knowledge Base",
        last_reviewed_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("knowledge_chunks")
        .upsert(rows, { onConflict: "article_slug,chunk_index" });

      if (error) {
        console.error(`   ❌ Upsert failed:`, error.message);
        process.exit(1);
      }

      totalUpserted += rows.length;
      console.log(`   ✅ Upserted chunks ${i}–${i + batch.length - 1}`);
    }

    totalChunks += rawChunks.length;
  }

  console.log(`\n✨ Done!`);
  console.log(`   Total chunks: ${totalChunks}`);
  if (!dryRun) {
    console.log(`   Upserted to Supabase: ${totalUpserted}`);
    console.log(`   Verify in Supabase: SELECT count(*) FROM knowledge_chunks;`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
