create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now(),
  ip_address text,
  confirmed boolean default false
);

alter table waitlist enable row level security;
