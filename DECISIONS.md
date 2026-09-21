# DECISIONS

Every real decision, dated, one line of reason. Newest at the bottom.
Product/architecture calls are made with Juan in claude.ai chat; Claude Code logs them.

## 2026-09-21 — Phase 0 reset (approved plan)

1. **Rebuild, not salvage.** Fresh repo at `C:\Users\juanv\vaddi`. — v3 foundations
   (client-side paid calls, JS-not-TS, email auth) are what v4 replaces; salvage-in-place
   costs more than a clean build. (AUDIT.md §7 verdict.)
2. **Old code archived then deleted; reference kept in `legacy/`.** — Keep the good v3
   patterns readable during Phase 1 without carrying the app; `legacy/` is gitignored and
   deleted when Phase 1 ends. (AUDIT.md §2 fit table.)
3. **New Supabase project `vaddi` (ref mryoyzqkvinykehrwmri, eu-west-3).** — Schema needed a
   full reset and anonymous auth enabled fresh; a new project avoids v3 orphan
   tables/buckets/policies. Old project `wnatkfpktymevbmdewyw` is dead. (AUDIT.md §4, §7.)
4. **Reuse EAS project b2b4d432… (owner juanvman) and bundle IDs `com.vaddi.app`.** App
   version 4.0.0; next store build buildNumber 11 / versionCode 10. — Preserve store
   identity; v3 shipped builds up to 10/9. (AUDIT.md §1.)
5. **`vaddi.app` stays the universal-link domain; shares carry `https://vaddi.app/join/{code}`
   only.** — The `vaddi://` scheme can't open for a friend without the app; HTTPS keeps the
   "value before install" promise. `vaddi://` is for auth redirects only. (AUDIT.md §5.)
6. **Google Places (New) stays the provider; cross-user cache of display fields dropped —
   only place IDs + coordinates stored.** — Google's terms forbid caching/sharing display
   fields; cost model re-derived at Phase 3 entry. VADDI_V4.md §7.5 replaced accordingly.
   (AUDIT.md §6.)
7. **No Gemini model ID in the repo until Phase 3.** — The v3 model IDs deprecate 2026-10-16;
   model IDs belong in one server config, chosen fresh at Phase 3. (AUDIT.md §6.)
8. **No provider key is ever `EXPO_PUBLIC_`.** Only the Supabase URL + publishable key are
   public; the publishable key is used (not the legacy anon JWT). Exposed Gemini/Places keys
   are to be deleted. — Keys must not ship in the bundle. (AUDIT.md §3.)
9. **App icon generated from the v3 logo as a placeholder.** — Unblocks builds now; a designed
   icon replaces it before Phase 5. (AUDIT.md §1 non-square-icon finding.)

## 2026-09-21 — defaults taken during execution (no prompt available)

- **VADDI_V4.md reconstructed from Juan's pasted chat text.** The on-disk file was absent
  everywhere under the old repo; the pasted version is the source of truth. §7.5 patch applied.
- **`eas.json` `appVersionSource: "local"`.** So the explicit buildNumber 11 / versionCode 10
  in `app.json` (decision 4) are authoritative rather than EAS remote values.
- **Brand logo left un-tinted in icons.** The logo carries its own coral/teal colours, so per
  the icon rule it is not tinted coral.
- **Icon geometry:** main `icon.png` = navy `#1E293B`, no alpha, logo ~60% width; `adaptive-icon`
  = transparent, logo in the 66% safe zone; `splash-icon` = transparent; `favicon` = 48×48.
- **`.gitignore` negates `.env.example`** (`!.env.example`) so the example commits while
  `.env` / `.env.*` stay ignored.
- **Kept template dev tooling** (`eslint`, `eslint-config-expo`) added by `expo lint` on first
  run — required by the template's own lint script, not a new runtime dependency.
- **Removed template cruft** (AGENTS.md, LICENSE, example screens/components/hooks/images,
  reset-project script) as part of stripping to one empty screen.
- **`production` build profile `autoIncrement: true`** as a reasonable store default.

## 2026-09-21 — Phase 1 (approved plan)

- **VADDI_V4.md §7 amended after the Places caching finding (AUDIT.md §6).** Three edits:
  §7 intro cost-lever sentence → "The number and size of calls per session is the main cost
  lever"; rule 5 → the "cache only what the provider lets you" text (place IDs + coords only);
  §7 budget "cache hit rate ≥60%" → "suggests per active trip, measured from Phase 3". No
  matching canonical `VADDI_V4*.md` was in Downloads (the one there predates §7.5), so the
  edits were applied to the repo copy; **a fully canonical replacement from Juan is still
  pending** (A2).
- **`legacy/` retained until Phase 3, not Phase 1.** The v3 reference (theme, brand kit, rec
  cache/ranking, loop logic) is still needed through the Phase 3 places/AI work; deletion moved
  to end of Phase 3 (B0). Updated in `legacy/README.md` and `CLAUDE.md`.
- **`.claude/settings.local.json` gitignored** (B0) — local Claude Code settings stay out of the repo.

### B1 — theme tokens
- **Dependency added: `@expo-google-fonts/inter`** (pre-approved) — Inter 400/500/600/700 per v4 §6.
  `expo-font` was already in the template.
- **Five type sizes** (xs 11 / sm 13 / md 16 / lg 20 / xl 28) — v4 §6 "five sizes at most".
- **Functional colours** success/warning/error added alongside the v4 §6 brand palette; light values
  darkened (e.g. success `#0F7A4E`) so text-on-surface stays ≥4.5:1.
- **Contrast gate runs via `npx tsx scripts/check-contrast.ts`** (ephemeral tool, no project dep,
  same pattern as sharp in Phase 0). `scripts/` excluded from tsc + ESLint (uses Node globals).
- **ESLint bans hex-colour string literals outside `src/theme`** (`no-restricted-syntax`), verified
  it fires on a violation and is exempt inside the theme folder.

### B2 — brand kit + card
- **Dependencies added: `expo-image`, `expo-haptics`** (pre-approved). `expo install` also added the
  `expo-image` config plugin to `app.json` (expected).
- **`@expo/vector-icons` installed — DEVIATION from the pre-approved list.** The SDK 57 template no
  longer bundles it, but B3 explicitly calls for tab icons "from the vector-icons package"; treated
  as plan-directed. Flag for Juan if he'd rather a different icon source.
- **`BrandGradient` is a solid coral fill, not a real gradient.** A true coral→teal gradient needs
  `expo-linear-gradient`, which is NOT pre-approved — so it's skipped and recorded (Juan's tasks).
  Swapping in a `LinearGradient` later is a one-line change; nothing else depends on it.
- **Primary action button = coral background with navy text** (5.3:1, AA). White-on-coral (2.8:1)
  would fail, so the CTA uses the navy brand colour for its label.

### B3 — navigation, screens, four states
- **No new dependencies.** Tabs, detail route and states use expo-router + already-installed libs.
- **Four states via a `useScreenState` + `ScreenState` pattern.** A dev-only `DevStateProvider`
  lets the Profile control force any screen into loading/empty/error/offline (v4 §5.8). Off in prod.
- **Dev control pinned above Profile's state region** so it stays usable even when Profile itself is
  forced into a state (otherwise you couldn't reset it).
- **`/` redirects to `/discover`;** detail is `/idea/[id]`; `/create-trip` is a Phase-2 placeholder.
  Every empty/error/offline offers a next step (v4 §5.10). No search/filters/map on Discover (v4 §6).
- **Bundling validated** with `expo export` (Android bundle built clean) as the headless proxy for
  "the app boots".

### B4 — anonymous auth + profiles
- **Dependencies added: `@supabase/supabase-js`, `@react-native-async-storage/async-storage`,
  `react-native-url-polyfill`** (all pre-approved). One client in `src/lib/supabase.ts` from env.
- **Anonymous sign-in on first launch** (`SessionProvider`), persisted + auto-refreshed; no account
  wall (v4 §5.1). `useSession()` exposes it.
- **Migration `0001_profiles`** applied via MCP `apply_migration`: owner-only select/update, no
  insert/delete via API, trigger creates the row on signup. **`0002_profiles_harden`** followed to
  clear advisors: revoked EXECUTE on the SECURITY DEFINER trigger functions and scoped policies
  `to authenticated`.
- **RLS proven** with `execute_sql` (other user sees 0, owner sees 1 own row, update works, insert
  errors 42501, delete affects 0) — saved under `supabase/tests/0001_profiles_rls.sql`.
- **Two advisor warnings left, both accepted:** anonymous-access policies (intentional — v4's entry
  model) and leaked-password protection (dashboard toggle, irrelevant until email/password auth).
  Recorded as Juan's-choice, not defects.
- **Backfilled a profile row** for the one pre-existing anon user (created before the trigger).

### B5 — device builds
- **Dependency added: `expo-dev-client`** (pre-approved). EAS `development` profile gets Android
  `buildType: apk`.
- **Android dev build queued** (EAS auto-generated the keystore, no interaction):
  https://expo.dev/accounts/juanvman/projects/vaddi/builds/855afebe-1622-4159-bf9e-11bcc015fd9d
- **iOS dev build deferred to Juan** — non-interactive EAS can't do Apple login / device
  registration for internal distribution. Commands recorded in STATUS.md.
- **Added `ios.infoPlist.ITSAppUsesNonExemptEncryption = false`** (default taken) — EAS flagged it
  missing; setting it avoids the App Store encryption-compliance prompt.

### Part A outcomes (guided)
- Google Gemini + Places keys deleted (A3); Supabase anonymous sign-ins enabled + verified (A4);
  old Supabase project `wnatkfpktymevbmdewyw` deleted, only `vaddi` remains (A5); GitHub CLI
  installed and repo pushed to `juanvorstman-rgb/Vaddi` (A6); EAS already authed as `juanvman` (A7).
- **GitHub auth via classic PAT in `GH_TOKEN`** (persisted with `setx`; never echoed/committed). The
  fine-grained token couldn't create/push; a classic `repo`-scope token was used instead.
- **claude.ai project-instruction §7 edits deferred by Juan** (A8) — the repo `VADDI_V4.md` already
  has them; the chat Project copy is Juan's to update.
