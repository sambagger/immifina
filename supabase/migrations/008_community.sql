-- 008_community.sql
-- Community Q&A feed + Rewards store

-- ─── Community Posts ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content      TEXT NOT NULL CHECK (char_length(content) BETWEEN 10 AND 1000),
  category     TEXT NOT NULL DEFAULT 'general',  -- credit | banking | taxes | remittance | general
  visa_tag     TEXT,                              -- optional: h1b | green_card | daca | other
  upvote_count INTEGER NOT NULL DEFAULT 0,
  answer_count INTEGER NOT NULL DEFAULT 0,
  is_flagged   BOOLEAN NOT NULL DEFAULT FALSE,
  is_removed   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS community_posts_category_idx ON community_posts(category);
CREATE INDEX IF NOT EXISTS community_posts_created_at_idx ON community_posts(created_at DESC);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "visible posts are public to authenticated users"
  ON community_posts FOR SELECT
  USING (auth.role() = 'authenticated' AND is_removed = FALSE);
CREATE POLICY "service role manages posts"
  ON community_posts FOR ALL USING (auth.role() = 'service_role');

-- ─── Community Votes ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_votes (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  UNIQUE(user_id, post_id)
);

ALTER TABLE community_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can manage own votes"
  ON community_votes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "service role manages votes"
  ON community_votes FOR ALL USING (auth.role() = 'service_role');

-- ─── Community Answers ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_answers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id      UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content      TEXT NOT NULL CHECK (char_length(content) BETWEEN 5 AND 1000),
  upvote_count INTEGER NOT NULL DEFAULT 0,
  is_accepted  BOOLEAN NOT NULL DEFAULT FALSE,
  is_removed   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS community_answers_post_id_idx ON community_answers(post_id);

ALTER TABLE community_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "visible answers are public to authenticated users"
  ON community_answers FOR SELECT
  USING (auth.role() = 'authenticated' AND is_removed = FALSE);
CREATE POLICY "service role manages answers"
  ON community_answers FOR ALL USING (auth.role() = 'service_role');

-- ─── User Rewards ─────────────────────────────────────────────
-- Rewards are threshold-based: unlocked when total_xp >= cost.
-- This table tracks explicit redemptions (PDF generation, etc.)
CREATE TABLE IF NOT EXISTS user_rewards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id   TEXT NOT NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, reward_id)
);

CREATE INDEX IF NOT EXISTS user_rewards_user_id_idx ON user_rewards(user_id);

ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own rewards"
  ON user_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "service role manages rewards"
  ON user_rewards FOR ALL USING (auth.role() = 'service_role');
