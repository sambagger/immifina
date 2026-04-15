/**
 * ImmiFina Memory System
 * Extracts and persists personal facts users share across conversations.
 * Facts are injected into Claude's system prompt so it can reference them naturally.
 */

import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/db";

const EXTRACTION_MODEL = "claude-3-5-haiku-20241022";
const MAX_MEMORIES_TO_INJECT = 20;
const MAX_NEW_MEMORIES_PER_TURN = 5;

export type UserMemory = {
  id: string;
  memory: string;
  category: string | null;
  created_at: string;
};

/** Load the most recent memories for a user */
export async function getUserMemories(userId: string): Promise<UserMemory[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("user_memories")
    .select("id, memory, category, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(MAX_MEMORIES_TO_INJECT);

  return (data ?? []) as UserMemory[];
}

/** Format memories into a block for Claude's system prompt */
export function formatMemoriesBlock(memories: UserMemory[]): string {
  if (!memories.length) return "";

  const lines = memories.map((m) => {
    const age = getRelativeAge(m.created_at);
    return `- ${m.memory}${age ? ` (${age})` : ""}`;
  });

  return `WHAT YOU KNOW ABOUT THIS USER FROM PAST CONVERSATIONS:
${lines.join("\n")}

Reference these naturally when relevant — never recite the list verbatim or make the user feel surveilled. If a fact helps personalize advice, use it. If it's not relevant, ignore it.`;
}

/** Fire-and-forget: extract new memories from the latest user message + assistant reply */
export async function extractAndSaveMemories(params: {
  userId: string;
  conversationId: string;
  userMessage: string;
  assistantReply: string;
  existingMemories: UserMemory[];
  apiKey: string;
}): Promise<void> {
  const { userId, conversationId, userMessage, assistantReply, existingMemories, apiKey } = params;

  // Build a compact summary of what we already know to avoid duplicates
  const alreadyKnown =
    existingMemories.length > 0
      ? `Already recorded facts:\n${existingMemories.map((m) => `- ${m.memory}`).join("\n")}`
      : "No facts recorded yet.";

  const prompt = `You are a memory extractor for a personal finance assistant called ImmiFina.
Your job is to identify NEW personal facts the user has shared that would help personalize future conversations.

${alreadyKnown}

USER MESSAGE:
"${userMessage}"

ASSISTANT REPLY:
"${assistantReply}"

Extract up to ${MAX_NEW_MEMORIES_PER_TURN} NEW facts from the user's message only (not the assistant's reply).
Only extract facts that:
- Are personal to this user (job, family, situation, plans, timeline, amounts they mentioned)
- Are NOT already in the "Already recorded" list
- Would be useful to remember weeks or months from now
- The user stated directly (not implied or assumed)

Do NOT extract: general questions, things the assistant said, vague sentiments, or facts that are already recorded.

Respond with a JSON array. Each item has:
- "memory": a concise third-person fact (e.g. "Works in construction, paid in cash")
- "category": one of: work | family | financial | immigration | goal | general

If no new facts worth remembering, respond with an empty array: []

JSON only, no other text:`;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: EXTRACTION_MODEL,
      max_tokens: 512,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") return;

    let extracted: { memory: string; category: string }[];
    try {
      // Strip markdown code fences if present
      const raw = block.text.replace(/```(?:json)?\n?/g, "").trim();
      extracted = JSON.parse(raw);
      if (!Array.isArray(extracted)) return;
    } catch {
      return; // Malformed JSON — skip silently
    }

    if (extracted.length === 0) return;

    const supabase = createServiceClient();
    const rows = extracted
      .slice(0, MAX_NEW_MEMORIES_PER_TURN)
      .filter((e) => typeof e.memory === "string" && e.memory.trim().length > 0)
      .map((e) => ({
        user_id: userId,
        memory: e.memory.trim().slice(0, 500),
        category: typeof e.category === "string" ? e.category : "general",
        source_conversation_id: conversationId,
      }));

    if (rows.length > 0) {
      await supabase.from("user_memories").insert(rows);
    }
  } catch {
    // Memory extraction is best-effort — never block the main response
  }
}

/** Convert ISO timestamp to a human-readable relative age */
function getRelativeAge(isoDate: string): string {
  const ms = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(ms / 86400000);
  if (days === 0) return "";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
}
