# STATUS

*Updated 2026-09-21. Single source of truth for where the build is.*

## Phase 0 — Audit and reset — COMPLETE

This run created the new repo and skeleton:
- Fresh Expo app scaffolded: **SDK 57**, React Native 0.86.3, expo-router, **TypeScript strict**.
- Template stripped to one empty screen (`src/app/index.tsx`, `src/app/_layout.tsx`).
- Checks green: `tsc --noEmit`, `expo lint`, `expo-doctor` (**21/21**).
- `VADDI_V4.md` (with the §7.5 replacement) and `AUDIT.md` at root.
- `CLAUDE.md`, `STATUS.md`, `DECISIONS.md`, `README.md` written.
- App config: `app.json` (name Vaddi, bundle `com.vaddi.app`, build 11 / versionCode 10,
  universal links for `vaddi.app/join`, navy splash/adaptive, internet-only permissions),
  `eas.json` (development / preview / production).
- `.env` (Supabase URL + publishable key) + `.env.example`; both `.env*` and `legacy/` gitignored.
- App icons generated from the v3 logo (placeholder): icon (no-alpha navy), adaptive, splash, favicon.
- Brand source art in `assets/brand/`.
- v3 reference in `legacy/` (gitignored, TS/ESLint-excluded) — **delete after Phase 1**.
- New Supabase project `vaddi` (ref `mryoyzqkvinykehrwmri`, eu-west-3) is the backend; its
  schema is untouched by design.
- Git initialized; first commit made. (Remote push pending — see Juan's tasks.)
- Old app archived to `C:\Users\juanv\vaddi-archive-2026-09-21.zip` (real zip, verified to
  contain `vaddi-project/AUDIT.md` and `vaddi-project/app/trip/[id].js`, no `.env`, no
  node_modules). **Old folder NOT auto-deleted** — `rm -rf` and `rimraf` both returned EBUSY
  because this session's shell is rooted inside `coplannr\vaddi-project`; per plan, not forced.
  Left for Juan (task 6). The archive is the backup.

## Phase 1 — Skeleton — NEXT

Scope (v4 §11 + AUDIT.md §7 entry checklist):
- Navigation: 3 tabs `Discover | Trip | Profile` (expo-router).
- Design tokens: port `legacy/utils/ThemeContext.js` → TypeScript `useTheme()`; light + dark.
- **One** reusable card component (photo, name, "why this", distance/price, reactions, one action).
- Anonymous auth (Supabase) that upgrades to a full account; one Supabase client module reading env.
- Brand kit ported from `legacy/components/Brand.js`.
- Dev builds running on a **real iPhone and a real Android**.
- Seed a stub `usage_log` table before any paid call arrives (Phase 3, but keep the habit).
- Keep `tsc` / `expo lint` / `expo-doctor` green on every commit.
- **Definition of done** for each feature: v4 §12.

## Juan's tasks (could not be automated this run)
1. **Supabase — enable Anonymous sign-ins** for project `vaddi` (`mryoyzqkvinykehrwmri`):
   Dashboard → Authentication → Providers → Anonymous → enable. (No CLI/MCP path.)
2. **Supabase — delete the dead old project** `wnatkfpktymevbmdewyw`: Dashboard → Project
   Settings → General → Delete project. (Frees the 2-project free-tier cap.)
3. **Rotate/delete the exposed provider keys** (`gcloud` not installed here, so not automated):
   - **Gemini key** — Google AI Studio → **API keys** (aistudio.google.com/apikey): delete the key.
   - **Google Places key** — Google Cloud Console → **APIs & Services → Credentials**: delete the
     key. (Both were shipped in v3 client builds; values were never printed.)
4. **Replace §7.5** in the **claude.ai Project instructions** with the new text (already applied to
   the repo `VADDI_V4.md`; the chat Project copy needs the same edit).
5. **GitHub remote** — `gh` is not installed here, so no repo was pushed. Create a **private** repo
   `vaddi` and push (e.g. install GitHub CLI then `gh repo create vaddi --private --source=. --push`,
   or add a remote manually).
6. **Delete the old folder** `C:\Users\juanv\coplannr` by hand — automated deletion failed
   with EBUSY (a shell was rooted inside it during this run). Close any tool/editor holding it,
   then delete. Backup: `C:\Users\juanv\vaddi-archive-2026-09-21.zip`.

## Open questions
- **Places cost model** (marked for **Phase 3 entry**): with no cross-user cache of display
  fields allowed, is per-session Google Places cost acceptable, or do we evaluate a
  friendlier-terms source (Foursquare / OSM)? Decide before writing the places layer.
