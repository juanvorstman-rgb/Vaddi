-- supabase/tests/0001_profiles_rls.sql
-- Manual RLS proof for public.profiles (run in the SQL editor / via MCP execute_sql).
-- Every block sets a role + fake JWT sub, then checks visibility. Expected
-- results are noted inline. Verified 2026-09-21 against project mryoyzqkvinykehrwmri.
--
-- Uses one real auth user id as the "owner"; substitute a current id when re-running.
--   OWNER = 7bd1bf39-1e3f-4c7e-971f-74f6a5cfd903
--   OTHER = 11111111-1111-1111-1111-111111111111 (does not exist / not the owner)

-- 1) A DIFFERENT signed-in user cannot see the owner's row.  EXPECT: 0
set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
set local role authenticated;
select count(*) as rows_visible_to_other from public.profiles;      -- expect 0
reset role;

-- 2) The owner sees exactly their own row, and can update it.       EXPECT: 1, true
set local request.jwt.claims = '{"sub":"7bd1bf39-1e3f-4c7e-971f-74f6a5cfd903","role":"authenticated"}';
set local role authenticated;
update public.profiles set display_name = 'Owner OK'
  where id = '7bd1bf39-1e3f-4c7e-971f-74f6a5cfd903';
select count(*) as rows_visible_to_owner,
       bool_and(id = '7bd1bf39-1e3f-4c7e-971f-74f6a5cfd903') as only_own
from public.profiles;                                                -- expect 1, true
reset role;

-- 3) INSERT is denied (no INSERT policy).  EXPECT: ERROR 42501 RLS violation
-- set local request.jwt.claims = '{"sub":"7bd1bf39-1e3f-4c7e-971f-74f6a5cfd903","role":"authenticated"}';
-- set local role authenticated;
-- insert into public.profiles (id) values ('22222222-2222-2222-2222-222222222222');

-- 4) DELETE is denied (no DELETE policy => 0 rows, row survives).  EXPECT: 0 deleted, 1 remaining
set local request.jwt.claims = '{"sub":"7bd1bf39-1e3f-4c7e-971f-74f6a5cfd903","role":"authenticated"}';
set local role authenticated;
with del as (
  delete from public.profiles where id = '7bd1bf39-1e3f-4c7e-971f-74f6a5cfd903' returning 1
)
select (select count(*) from del) as rows_deleted,
       (select count(*) from public.profiles) as owner_rows_remaining;  -- expect 0, 1
reset role;
