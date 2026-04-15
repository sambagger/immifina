/**
 * ImmiFina Knowledge Base Embedding Script
 *
 * Run from inside the frontend/ directory:
 *   npx tsx scripts/embed-knowledge.ts           # embed all articles
 *   npx tsx scripts/embed-knowledge.ts --dry-run  # preview only, no DB writes
 *   npx tsx scripts/embed-knowledge.ts itin secured-cards  # specific slugs
 *
 * Prerequisites:
 *   1. Run 005_rag.sql in Supabase SQL editor
 *   2. Add VOYAGE_API_KEY to .env.local
 *   3. npm install dotenv (if not already installed)
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { ARTICLES, type KnowledgeArticle } from "../lib/knowledge-base/articles";

// ── Load env ──────────────────────────────────────────────────
// Manually parse .env.local so we don't need the dotenv package
function loadEnv() {

  for (const filename of [".env.local", ".env"]) {
    const filepath = resolve(process.cwd(), filename);
    if (!existsSync(filepath)) continue;
    const lines = readFileSync(filepath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!(key in process.env)) process.env[key] = val;
    }
  }
}

// ── Args ──────────────────────────────────────────────────────
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const slugFilter = args.filter((a) => !a.startsWith("--"));

// ── Voyage AI embedding ───────────────────────────────────────
async function embed(texts: string[], apiKey: string): Promise<number[][]> {
  const response = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
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

  return data.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

// ── Chunking ──────────────────────────────────────────────────
const MAX_CHUNK_CHARS = 1800;

function chunkArticle(article: KnowledgeArticle): { text: string; index: number }[] {
  const paragraphs = article.body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: { text: string; index: number }[] = [];
  let current = "";
  let chunkIndex = 0;

  for (const para of paragraphs) {
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

// ── Main ──────────────────────────────────────────────────────
async function main() {
  loadEnv();

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY ?? "";

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }
  if (!VOYAGE_API_KEY) {
    console.error("❌ Missing VOYAGE_API_KEY in .env.local");
    console.error("   Get one free at https://dash.voyageai.com/");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const articles =
    slugFilter.length > 0
      ? ARTICLES.filter((a) => slugFilter.includes(a.slug))
      : ARTICLES;

  if (articles.length === 0) {
    console.error("❌ No articles matched:", slugFilter);
    process.exit(1);
  }

  console.log(`\n🔍 ImmiFina Knowledge Base Embedder`);
  console.log(`   Mode   : ${dryRun ? "DRY RUN (no DB writes)" : "LIVE"}`);
  console.log(`   Articles: ${articles.map((a) => a.slug).join(", ")}`);
  console.log(`   Model  : voyage-3-lite (512 dims)\n`);

  let totalChunks = 0;
  let totalUpserted = 0;

  for (const article of articles) {
    const rawChunks = chunkArticle(article);
    console.log(`📄 ${article.slug}  (${rawChunks.length} chunks)`);

    if (dryRun) {
      for (const c of rawChunks) {
        console.log(`   [${c.index}] ${c.text.slice(0, 80)}…`);
      }
      totalChunks += rawChunks.length;
      continue;
    }

    const BATCH = 50;
    let batchNum = 0;
    for (let i = 0; i < rawChunks.length; i += BATCH) {
      // Respect Voyage free tier rate limit (3 RPM) — 22s between requests
      if (batchNum > 0 || totalUpserted > 0) {
        process.stdout.write("   ⏳ Rate limit pause (22s)…");
        await new Promise((r) => setTimeout(r, 22000));
        process.stdout.write(" done\n");
      }
      batchNum++;
      const batch = rawChunks.slice(i, i + BATCH);
      const texts = batch.map((c) => `${article.title}\n\n${c.text}`);

      let embeddings: number[][];
      try {
        embeddings = await embed(texts, VOYAGE_API_KEY);
      } catch (err) {
        console.error(`   ❌ Embedding failed at chunk ${i}:`, err);
        process.exit(1);
      }

      const rows = batch.map((chunk, j) => ({
        article_slug: article.slug,
        chunk_index: chunk.index,
        title: article.title,
        content: chunk.text,
        category: article.category,
        tags: article.tags,
        embedding: `[${embeddings[j].join(",")}]`,
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
      console.log(`   ✅ Chunks ${i}–${i + batch.length - 1} upserted`);
    }

    totalChunks += rawChunks.length;
  }

  console.log(`\n✨ Done!`);
  console.log(`   Total chunks : ${totalChunks}`);
  if (!dryRun) {
    console.log(`   Upserted     : ${totalUpserted}`);
    console.log(`   Verify       : SELECT count(*) FROM knowledge_chunks;`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
