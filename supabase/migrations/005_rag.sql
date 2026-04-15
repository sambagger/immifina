-- Migration 005: RAG knowledge base with pgvector
-- IMPORTANT: Before running this, enable the vector extension in Supabase:
--   Dashboard → Database → Extensions → search "vector" → enable
-- OR run: CREATE EXTENSION IF NOT EXISTS vector;
--
-- Run this in the Supabase SQL editor at:
--   https://supabase.com/dashboard/project/<your-project>/sql

-- Enable pgvector (safe to run even if already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- ─────────────────────────────────────────────
-- knowledge_chunks
-- Each row is one paragraph-sized chunk of
-- ImmiFina's curated content with its embedding.
-- Dimension 512 = Voyage AI voyage-3-lite output.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug     TEXT NOT NULL,        -- identifies which source article (e.g. 'itin', 'secured-cards')
  chunk_index      INT  NOT NULL,        -- chunk order within article (for debugging)
  title            TEXT NOT NULL,        -- article title (used in retrieval context for Claude)
  content          TEXT NOT NULL,        -- the actual text chunk
  category         TEXT NOT NULL,        -- 'credit' | 'banking' | 'taxes' | 'remittance' | 'paycheck' | 'benefits' | 'immigration' | 'savings'
  tags             TEXT[] DEFAULT '{}',
  embedding        VECTOR(512),          -- Voyage AI voyage-3-lite (512 dims)
  source           TEXT DEFAULT 'ImmiFina Knowledge Base',
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_slug, chunk_index)
);

-- IVFFlat index for fast approximate nearest-neighbor search.
-- lists = 10 is fine for < 1000 chunks; bump to 100 when you have > 10k chunks.
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
  ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 10);

CREATE INDEX IF NOT EXISTS knowledge_chunks_category_idx
  ON knowledge_chunks(category);

CREATE INDEX IF NOT EXISTS knowledge_chunks_slug_idx
  ON knowledge_chunks(article_slug);

-- ─────────────────────────────────────────────
-- RPC: match_knowledge_chunks
-- Called by the chat route to retrieve the most
-- relevant chunks for a user query.
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
  query_embedding  VECTOR(512),
  match_threshold  FLOAT DEFAULT 0.70,
  match_count      INT   DEFAULT 5,
  filter_category  TEXT  DEFAULT NULL
)
RETURNS TABLE(
  id         UUID,
  title      TEXT,
  content    TEXT,
  category   TEXT,
  similarity FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT
    id,
    title,
    content,
    category,
    1 - (embedding <=> query_embedding) AS similarity
  FROM knowledge_chunks
  WHERE
    (filter_category IS NULL OR category = filter_category)
    AND embedding IS NOT NULL
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- ─────────────────────────────────────────────
-- Row-Level Security
-- Service role bypasses RLS; these are safety nets.
-- ─────────────────────────────────────────────
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role bypass" ON knowledge_chunks
  FOR ALL USING (true);
