-- Run in Supabase SQL editor **only if** `financial_profiles` is missing these columns.
-- Safe to run multiple times (`IF NOT EXISTS` on each column).
-- Do **not** paste `schema.sql` here if your project already has tables and RLS policies —
-- that file creates policies and will error with "policy ... already exists" on a second run.

alter table financial_profiles
  add column if not exists onboarding_completed_at timestamptz,
  add column if not exists immigration_situation text,
  add column if not exists has_ssn boolean default false,
  add column if not exists has_itin boolean default false,
  add column if not exists years_in_us integer,
  add column if not exists country_of_origin text,
  add column if not exists primary_goal text,
  add column if not exists employment_status text,
  add column if not exists children_under_18 boolean default false,
  add column if not exists current_debt numeric(12, 2) default 0,
  add column if not exists expense_housing numeric(12, 2) default 0,
  add column if not exists expense_food numeric(12, 2) default 0,
  add column if not exists expense_transport numeric(12, 2) default 0,
  add column if not exists expense_utilities numeric(12, 2) default 0,
  add column if not exists expense_remittance numeric(12, 2) default 0,
  add column if not exists expense_other numeric(12, 2) default 0,
  add column if not exists monthly_can_save numeric(12, 2);
