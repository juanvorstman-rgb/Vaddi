-- 0002_profiles_harden
-- Clears the fixable security-advisor findings on 0001.
--   1) The trigger functions are SECURITY DEFINER and live in the public schema,
--      so PostgREST exposes them as callable RPCs. They must only run from their
--      triggers — revoke EXECUTE from every API role (triggers don't need it).
--   2) Scope the RLS policies to `authenticated` so true unauthenticated requests
--      (role `anon`, no JWT) get nothing. Anonymous *sign-ins* use the
--      `authenticated` role, so the entry flow (v4 §5.1) is unaffected.

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
