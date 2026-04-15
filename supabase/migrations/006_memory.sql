-- Migration 006: User Memory System
-- Stores persistent facts Claude learns about each user across conversations

CREATE TABLE IF NOT EXISTS user_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  memory TEXT NOT NULL,
  category TEXT,             -- 'work' | 'family' | 'financial' | 'immigration' | 'goal' | 'general'
  source_conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_memories_user_id_idx ON user_memories(user_id);
CREATE INDEX IF NOT EXISTS user_memories_created_at_idx ON user_memories(user_id, created_at DESC);

ALTER TABLE user_memories ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS (used by backend API routes)
DROP POLICY IF EXISTS "service role bypass" ON user_memories;
CREATE POLICY "service role bypass" ON user_memories
  FOR ALL
  USING (true);
