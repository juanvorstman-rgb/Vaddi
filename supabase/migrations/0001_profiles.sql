-- 0001_profiles
-- One row per auth user. Created automatically on signup by a trigger.
-- Owner-only read/update; no insert or delete through the API (RLS denies by
-- default when no policy grants them). v4 §9: RLS on every table.

create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A user can read only their own row.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

-- A user can update only their own row (and can't move it to someone else).
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- No INSERT / DELETE policies on purpose: RLS denies both through the API.
-- Rows are created by the trigger below (SECURITY DEFINER), not by the client.

-- Create the profile row when a new auth user is inserted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at current on every update.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();
