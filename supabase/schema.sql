-- ImmiFina — run in Supabase SQL editor.
-- Custom app auth uses JWT cookie + service role from API routes (bypasses RLS).
-- RLS policies below align with Supabase Auth if you later sync auth.users.id with public.users.id.

create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  name text not null,
  preferred_language text default 'en' check (preferred_language in ('en', 'es', 'zh')),
  immigration_status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists financial_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  monthly_income numeric(12,2) default 0,
  monthly_expenses numeric(12,2) default 0,
  current_savings numeric(12,2) default 0,
  monthly_savings_goal numeric(12,2) default 0,
  household_size integer default 1,
  state_of_residence char(2),
  has_children boolean default false,
  updated_at timestamptz default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text,
  language text default 'en',
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  role text check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

create table if not exists forecast_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  input_data jsonb not null,
  result_data jsonb not null,
  created_at timestamptz default now()
);

alter table users enable row level security;
alter table financial_profiles enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table forecast_snapshots enable row level security;

-- Policies match PRD; effective when using Supabase Auth with matching user id.
create policy "users_own_data" on users for all using (id = auth.uid());
create policy "profiles_own_data" on financial_profiles for all using (user_id = auth.uid());
create policy "conversations_own_data" on conversations for all using (user_id = auth.uid());
create policy "messages_own_data" on messages for all
  using (conversation_id in (select id from conversations where user_id = auth.uid()));
create policy "forecasts_own_data" on forecast_snapshots for all using (user_id = auth.uid());
