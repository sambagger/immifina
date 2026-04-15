-- ============================================================
-- ImmiFina — Master Migration (safe to re-run)
-- Paste this entire file into Supabase SQL Editor and run.
-- Every destructive statement uses IF NOT EXISTS / IF EXISTS
-- so running it multiple times will not error.
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;

-- ── Core tables ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                         TEXT UNIQUE NOT NULL,
  password_hash                 TEXT NOT NULL,
  name                          TEXT NOT NULL,
  preferred_language            TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'es', 'zh')),
  immigration_status            TEXT,
  email_verified                BOOLEAN DEFAULT FALSE,
  verification_token            TEXT,
  verification_token_expires_at TIMESTAMPTZ,
  password_reset_token          TEXT,
  password_reset_expires_at     TIMESTAMPTZ,
  created_at                    TIMESTAMPTZ DEFAULT NOW(),
  updated_at                    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_profiles (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID REFERENCES users(id) ON DELETE CASCADE,
  monthly_income           NUMERIC(12,2) DEFAULT 0,
  monthly_expenses         NUMERIC(12,2) DEFAULT 0,
  current_savings          NUMERIC(12,2) DEFAULT 0,
  monthly_savings_goal     NUMERIC(12,2) DEFAULT 0,
  household_size           INTEGER DEFAULT 1,
  state_of_residence       CHAR(2),
  has_children             BOOLEAN DEFAULT FALSE,
  onboarding_completed_at  TIMESTAMPTZ,
  immigration_situation    TEXT,
  has_ssn                  BOOLEAN DEFAULT FALSE,
  has_itin                 BOOLEAN DEFAULT FALSE,
  years_in_us              INTEGER,
  country_of_origin        TEXT,
  primary_goal             TEXT,
  employment_status        TEXT,
  children_under_18        BOOLEAN DEFAULT FALSE,
  current_debt             NUMERIC(12,2) DEFAULT 0,
  expense_housing          NUMERIC(12,2) DEFAULT 0,
  expense_food             NUMERIC(12,2) DEFAULT 0,
  expense_transport        NUMERIC(12,2) DEFAULT 0,
  expense_utilities        NUMERIC(12,2) DEFAULT 0,
  expense_remittance       NUMERIC(12,2) DEFAULT 0,
  expense_other            NUMERIC(12,2) DEFAULT 0,
  monthly_can_save         NUMERIC(12,2),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT,
  language   TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role            TEXT CHECK (role IN ('user', 'assistant')),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forecast_snapshots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  input_data  JSONB NOT NULL,
  result_data JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS waitlist (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  confirmed  BOOLEAN DEFAULT FALSE
);

-- ── Workflow tables ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_goals (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_type    TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'active',
  current_step INT  NOT NULL DEFAULT 0,
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, goal_type)
);

CREATE TABLE IF NOT EXISTS goal_step_completions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_goal_id UUID NOT NULL REFERENCES user_goals(id) ON DELETE CASCADE,
  step_index   INT  NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  notes        TEXT,
  UNIQUE(user_goal_id, step_index)
);

-- ── RAG knowledge table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug     TEXT NOT NULL,
  chunk_index      INT  NOT NULL,
  title            TEXT NOT NULL,
  content          TEXT NOT NULL,
  category         TEXT NOT NULL,
  tags             TEXT[] DEFAULT '{}',
  embedding        VECTOR(512),
  source           TEXT DEFAULT 'ImmiFina Knowledge Base',
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_slug, chunk_index)
);

-- ── Memory table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_memories (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  memory                 TEXT NOT NULL,
  category               TEXT,
  source_conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_verification_token
  ON users(verification_token) WHERE verification_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_password_reset_token
  ON users(password_reset_token) WHERE password_reset_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS user_goals_user_id_idx ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS user_goals_status_idx  ON user_goals(user_id, status);
CREATE INDEX IF NOT EXISTS goal_steps_goal_id_idx ON goal_step_completions(user_goal_id);

CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
  ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 10);
CREATE INDEX IF NOT EXISTS knowledge_chunks_category_idx ON knowledge_chunks(category);
CREATE INDEX IF NOT EXISTS knowledge_chunks_slug_idx     ON knowledge_chunks(article_slug);

CREATE INDEX IF NOT EXISTS user_memories_user_id_idx    ON user_memories(user_id);
CREATE INDEX IF NOT EXISTS user_memories_created_at_idx ON user_memories(user_id, created_at DESC);

-- ── RLS: enable ───────────────────────────────────────────────
ALTER TABLE users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages               ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_snapshots     ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist               ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals             ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_step_completions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memories          ENABLE ROW LEVEL SECURITY;

-- ── RLS: policies (drop first so re-runs never error) ─────────
DROP POLICY IF EXISTS "users_own_data"          ON users;
DROP POLICY IF EXISTS "profiles_own_data"       ON financial_profiles;
DROP POLICY IF EXISTS "conversations_own_data"  ON conversations;
DROP POLICY IF EXISTS "messages_own_data"       ON messages;
DROP POLICY IF EXISTS "forecasts_own_data"      ON forecast_snapshots;
DROP POLICY IF EXISTS "service role bypass"     ON user_goals;
DROP POLICY IF EXISTS "service role bypass"     ON goal_step_completions;
DROP POLICY IF EXISTS "service role bypass"     ON knowledge_chunks;
DROP POLICY IF EXISTS "service role bypass"     ON user_memories;

CREATE POLICY "users_own_data"         ON users             FOR ALL USING (id = auth.uid());
CREATE POLICY "profiles_own_data"      ON financial_profiles FOR ALL USING (user_id = auth.uid());
CREATE POLICY "conversations_own_data" ON conversations      FOR ALL USING (user_id = auth.uid());
CREATE POLICY "messages_own_data"      ON messages           FOR ALL
  USING (conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid()));
CREATE POLICY "forecasts_own_data"     ON forecast_snapshots FOR ALL USING (user_id = auth.uid());

-- Workflow + RAG + Memory: service role key bypasses RLS from API routes.
-- These open policies are a safety net for direct DB access.
CREATE POLICY "service role bypass" ON user_goals            FOR ALL USING (true);
CREATE POLICY "service role bypass" ON goal_step_completions FOR ALL USING (true);
CREATE POLICY "service role bypass" ON knowledge_chunks      FOR ALL USING (true);
CREATE POLICY "service role bypass" ON user_memories         FOR ALL USING (true);

-- ── RAG match function ────────────────────────────────────────
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
