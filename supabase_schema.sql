-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Vendors Table
create table vendors (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null,
  name text not null,
  category text,
  contact_name text,
  email text,
  phone text,
  created_at timestamp with time zone default now()
);

-- 2. Projects Table
create table projects (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null,
  name text not null,
  client text,
  status text default 'active', -- active, completed, on_hold
  budget numeric(12, 2) default 0,
  start_date date,
  end_date date,
  created_at timestamp with time zone default now()
);

-- 3. Documents Table
create table documents (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null,
  project_id uuid references projects(id),
  vendor_id uuid references vendors(id),
  name text not null,
  type text, -- invoice, receipt, contract
  status text default 'processing', -- processing, needs_review, approved
  amount numeric(12, 2),
  date date,
  file_url text,
  confidence_score numeric(3, 2),
  created_at timestamp with time zone default now()
);

-- Indexes for performance
create index idx_vendors_user on vendors(clerk_user_id);
create index idx_projects_user on projects(clerk_user_id);
create index idx_documents_user on documents(clerk_user_id);

-- Row Level Security (RLS) Policies
-- Enable RLS
alter table vendors enable row level security;
alter table projects enable row level security;
alter table documents enable row level security;

-- Create policies
create policy "Users can view own vendors" on vendors for select using (clerk_user_id = auth.uid()::text);
create policy "Users can insert own vendors" on vendors for insert with check (clerk_user_id = auth.uid()::text);
create policy "Users can update own vendors" on vendors for update using (clerk_user_id = auth.uid()::text);
create policy "Users can delete own vendors" on vendors for delete using (clerk_user_id = auth.uid()::text);

create policy "Users can view own projects" on projects for select using (clerk_user_id = auth.uid()::text);
create policy "Users can insert own projects" on projects for insert with check (clerk_user_id = auth.uid()::text);
create policy "Users can update own projects" on projects for update using (clerk_user_id = auth.uid()::text);
create policy "Users can delete own projects" on projects for delete using (clerk_user_id = auth.uid()::text);

create policy "Users can view own documents" on documents for select using (clerk_user_id = auth.uid()::text);
create policy "Users can insert own documents" on documents for insert with check (clerk_user_id = auth.uid()::text);
create policy "Users can update own documents" on documents for update using (clerk_user_id = auth.uid()::text);
create policy "Users can delete own documents" on documents for delete using (clerk_user_id = auth.uid()::text);
