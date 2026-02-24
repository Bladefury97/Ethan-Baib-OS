-- ═══════════════════════════════════════════════════════════════
-- ETHAN BAIB ARTIST OS — Supabase Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- TASKS
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text,
  priority text default 'Medium',
  status text default 'To Do',
  due_date date,
  notes text,
  done boolean default false,
  created_at timestamptz default now()
);

-- GIGS
create table if not exists gigs (
  id uuid default gen_random_uuid() primary key,
  venue text not null,
  city text,
  date date,
  type text,
  pay numeric,
  status text default 'Pending',
  soundcheck text,
  set_length text,
  contact text,
  notes text,
  created_at timestamptz default now()
);

-- RELEASES
create table if not exists releases (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text,
  track_count integer,
  target_date date,
  distributor text,
  budget numeric,
  stage text default 'Concept',
  notes text,
  created_at timestamptz default now()
);

-- MUSIC CATALOG
create table if not exists catalog (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text,
  bpm integer,
  key text,
  isrc text,
  release_date date,
  stage text default 'Idea',
  streams integer default 0,
  distributor text,
  notes text,
  created_at timestamptz default now()
);

-- CONTACTS
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  company text,
  email text,
  phone text,
  instagram text,
  status text default 'Active',
  last_contact date,
  notes text,
  created_at timestamptz default now()
);

-- INCOME
create table if not exists income (
  id uuid default gen_random_uuid() primary key,
  date date,
  description text,
  category text,
  amount numeric,
  paid boolean default true,
  notes text,
  created_at timestamptz default now()
);

-- EXPENSES
create table if not exists expenses (
  id uuid default gen_random_uuid() primary key,
  date date,
  description text,
  category text,
  amount numeric,
  notes text,
  created_at timestamptz default now()
);

-- ANALYTICS (monthly stats log)
create table if not exists analytics (
  id uuid default gen_random_uuid() primary key,
  month date,
  spotify integer,
  apple integer,
  ig_followers integer,
  tiktok integer,
  youtube integer,
  gigs integer,
  revenue numeric,
  notes text,
  created_at timestamptz default now()
);

-- GOALS
create table if not exists goals (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  category text,
  target text,
  progress integer default 0,
  created_at timestamptz default now()
);

-- CONTENT POSTS
create table if not exists content_posts (
  id uuid default gen_random_uuid() primary key,
  title text,
  platform text,
  post_date date,
  type text,
  status text default 'Idea',
  caption text,
  link text,
  created_at timestamptz default now()
);

-- NOTES (key-value store for freeform text)
create table if not exists notes (
  key text primary key,
  content text,
  updated_at timestamptz default now()
);

-- ═══ DISABLE ROW LEVEL SECURITY (for personal solo use) ═══
-- If you want it private to you only, keep RLS off.
-- If you ever share this app, set up auth + RLS policies.
alter table tasks disable row level security;
alter table gigs disable row level security;
alter table releases disable row level security;
alter table catalog disable row level security;
alter table contacts disable row level security;
alter table income disable row level security;
alter table expenses disable row level security;
alter table analytics disable row level security;
alter table goals disable row level security;
alter table content_posts disable row level security;
alter table notes disable row level security;

-- Done! All tables created successfully.
