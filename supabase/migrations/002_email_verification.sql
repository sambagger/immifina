-- Migration 002: email verification + password reset tokens
-- Run this in Supabase → SQL Editor

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verified          BOOLEAN       DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verification_token      TEXT,
  ADD COLUMN IF NOT EXISTS verification_token_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS password_reset_token    TEXT,
  ADD COLUMN IF NOT EXISTS password_reset_expires_at     TIMESTAMPTZ;

-- Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_users_verification_token
  ON users (verification_token)
  WHERE verification_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_password_reset_token
  ON users (password_reset_token)
  WHERE password_reset_token IS NOT NULL;
