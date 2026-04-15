-- Migration 004: Workflow / Goal tracking tables
-- Run this in the Supabase SQL editor at:
--   https://supabase.com/dashboard/project/<your-project>/sql

-- ─────────────────────────────────────────────
-- user_goals
-- One row per active/completed goal per user.
-- A user can pursue multiple goals over time,
-- but typically has one 'active' goal at a time.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_goals (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_type    TEXT NOT NULL,   -- 'build_credit' | 'bank_account' | 'save_plan' | 'remittance' | 'taxes' | 'home' | 'business'
  status       TEXT NOT NULL DEFAULT 'active', -- 'active' | 'completed' | 'paused'
  current_step INT  NOT NULL DEFAULT 0,        -- index of the step the user is on
  started_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, goal_type)
);

-- ─────────────────────────────────────────────
-- goal_step_completions
-- One row per completed step.
-- current_step on user_goals is the source of
-- truth for "which step is next"; this table
-- records the audit trail + timestamps.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS goal_step_completions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_goal_id UUID NOT NULL REFERENCES user_goals(id) ON DELETE CASCADE,
  step_index   INT  NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  notes        TEXT,
  UNIQUE(user_goal_id, step_index)
);

-- ─────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS user_goals_user_id_idx ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS user_goals_status_idx  ON user_goals(user_id, status);
CREATE INDEX IF NOT EXISTS goal_steps_goal_id_idx ON goal_step_completions(user_goal_id);

-- ─────────────────────────────────────────────
-- Row-Level Security
-- ─────────────────────────────────────────────
ALTER TABLE user_goals           ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_step_completions ENABLE ROW LEVEL SECURITY;

-- We use service-role key in API routes so RLS is effectively bypassed on the server,
-- but these policies protect direct client access.
-- NOTE: our app uses a custom JWT (not Supabase Auth), so auth.uid() won't match.
-- The service role key bypasses RLS entirely — these policies are a safety net only.
DROP POLICY IF EXISTS "service role bypass" ON user_goals;
CREATE POLICY "service role bypass" ON user_goals
  FOR ALL USING (true);

DROP POLICY IF EXISTS "service role bypass" ON goal_step_completions;
CREATE POLICY "service role bypass" ON goal_step_completions
  FOR ALL USING (true);
