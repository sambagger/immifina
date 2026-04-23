-- 007_gamification.sql
-- XP, levels, badges, streaks, and lesson completions

-- ─── User XP & Level ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_xp (
  user_id    UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_xp   INTEGER NOT NULL DEFAULT 0,
  level      INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own xp"
  ON user_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "service role manages xp"
  ON user_xp FOR ALL USING (auth.role() = 'service_role');

-- ─── XP Event Audit Log ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS xp_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type   TEXT NOT NULL,  -- 'lesson_complete' | 'quiz_pass' | 'step_complete' | 'goal_complete' | 'streak_7'
  xp_earned    INTEGER NOT NULL,
  reference_id TEXT,           -- lesson slug, goal id, step index, etc.
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS xp_events_user_id_idx ON xp_events(user_id);
CREATE INDEX IF NOT EXISTS xp_events_created_at_idx ON xp_events(created_at);

ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own xp events"
  ON xp_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "service role manages xp events"
  ON xp_events FOR ALL USING (auth.role() = 'service_role');

-- ─── Badges ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_badges (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id   TEXT NOT NULL,
  earned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS user_badges_user_id_idx ON user_badges(user_id);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own badges"
  ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "service role manages badges"
  ON user_badges FOR ALL USING (auth.role() = 'service_role');

-- ─── Streaks ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id          UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak   INTEGER NOT NULL DEFAULT 0,
  longest_streak   INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own streak"
  ON user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "service role manages streaks"
  ON user_streaks FOR ALL USING (auth.role() = 'service_role');

-- ─── Lesson Completions ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS lesson_completions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_slug  TEXT NOT NULL,
  quiz_passed  BOOLEAN NOT NULL DEFAULT FALSE,
  quiz_score   INTEGER,         -- number of correct answers
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_slug)
);

CREATE INDEX IF NOT EXISTS lesson_completions_user_id_idx ON lesson_completions(user_id);

ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own lesson completions"
  ON lesson_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "service role manages lesson completions"
  ON lesson_completions FOR ALL USING (auth.role() = 'service_role');
