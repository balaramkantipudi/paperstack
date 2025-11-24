-- Create a table to track user subscriptions
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- This will match the Clerk User ID
  stripe_customer_id text,
  stripe_subscription_id text,
  status text default 'inactive', -- active, past_due, canceled, etc.
  plan_type text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table subscriptions enable row level security;

-- Allow users to read their own subscription
create policy "Users can view own subscription"
  on subscriptions for select
  using ( user_id = auth.uid()::text );

-- Only service role (backend) can insert/update
-- (No policy needed for service role as it bypasses RLS, but we ensure no public write access)
