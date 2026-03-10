-- ============================================================
-- Barangay Blotter Management System — Supabase Schema
-- Run this in the Supabase SQL Editor to create all tables.
-- ============================================================

-- 1. Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'Desk Officer' check (role in ('Brgy. Captain', 'Secretary', 'Desk Officer')),
  email text not null,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  last_active timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Authenticated users can read profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Service role can manage all profiles"
  on public.profiles for all
  to service_role
  using (true);

-- 2. Incidents (blotter records)
create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  blotter_number text unique not null,
  complainant_name text not null,
  respondent_name text,
  category text not null check (category in ('Theft', 'Noise Disturbance', 'Vandalism', 'Assault', 'Trespassing', 'Dispute', 'Other')),
  description text,
  severity text not null default 'low' check (severity in ('high', 'medium', 'low')),
  status text not null default 'Pending' check (status in ('Pending', 'Under Investigation', 'Amicably Settled', 'Escalated to Police', 'Dismissed')),
  zone text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz default now(),
  resolved_at timestamptz,
  created_by uuid references public.profiles(id),
  updated_at timestamptz default now()
);

alter table public.incidents enable row level security;

create policy "Authenticated users can read incidents"
  on public.incidents for select
  to authenticated
  using (true);

create policy "Authenticated users can insert incidents"
  on public.incidents for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update incidents"
  on public.incidents for update
  to authenticated
  using (true);

create policy "Authenticated users can delete incidents"
  on public.incidents for delete
  to authenticated
  using (true);

-- 3. Audit Logs (immutable)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz default now(),
  user_id text,
  user_name text not null default 'Unknown',
  action text not null check (action in (
    'Login', 'Logout', 'Record Created', 'Record Edited',
    'Record Deleted', 'Data Exported', 'Failed Login',
    'Password Reset', 'User Created', 'Access Revoked'
  )),
  details text,
  ip_address text default '0.0.0.0',
  status text not null default 'Success' check (status in ('Success', 'Warning', 'Failed'))
);

alter table public.audit_logs enable row level security;

create policy "Authenticated users can read audit logs"
  on public.audit_logs for select
  to authenticated
  using (true);

create policy "Authenticated users can insert audit logs"
  on public.audit_logs for insert
  to authenticated
  with check (true);

-- Prevent updates and deletes on audit logs (immutable)
-- No update or delete policies = cannot modify once inserted

-- 4. Indexes for performance
create index if not exists idx_incidents_created_at on public.incidents(created_at);
create index if not exists idx_incidents_category on public.incidents(category);
create index if not exists idx_incidents_severity on public.incidents(severity);
create index if not exists idx_incidents_zone on public.incidents(zone);
create index if not exists idx_incidents_status on public.incidents(status);
create index if not exists idx_audit_logs_timestamp on public.audit_logs(timestamp desc);
create index if not exists idx_audit_logs_action on public.audit_logs(action);
create index if not exists idx_audit_logs_user_id on public.audit_logs(user_id);

-- 5. Function to auto-update last_active on profiles
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_incident_updated
  before update on public.incidents
  for each row execute procedure public.handle_updated_at();
