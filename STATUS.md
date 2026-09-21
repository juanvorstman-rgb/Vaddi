# STATUS

*Updated 2026-09-21. Single source of truth for where the build is.*

## Phase 0 — Audit and reset — COMPLETE
See `AUDIT.md` and `DECISIONS.md` (2026-09-21 reset). Fresh repo, SDK 57 skeleton, new Supabase
project `vaddi` (`mryoyzqkvinykehrwmri`), state files, icons, EAS/bundle IDs reused.

## Phase 1 — Skeleton — COMPLETE

| Item (v4 §11 / §12) | Status |
|---|---|
| 3 tabs `Discover · Trip · Profile` (expo-router) | ✅ |
| Theme tokens, light + dark, `useTheme()` only; no hex outside `src/theme` (ESLint-enforced) | ✅ |
| WCAG AA contrast gate (`scripts/check-contrast.ts`, 18 pairs) | ✅ |
| Inter font (expo-font), splash held until loaded | ✅ |
| Brand kit ported (mark, gradient*, loader, empty state) | ✅ (*solid fill — see tasks) |
| One card `IdeaCard` — primary + compact variants, expo-image, 44pt reactions, haptics, optimistic | ✅ |
| Madrid fixtures (8 ideas: eat/drink/do) | ✅ |
| Four states on every screen + dev control to force any state | ✅ |
| Discover: Vaddi's pick + 3 compact, detail route, no search/filters/map | ✅ |
| Trip: "No trip yet" → Create-a-trip (Phase-2 placeholder) | ✅ |
| Profile: guest status, display-name field, dev control | ✅ |
| Anonymous auth on launch, persisted; `useSession()`; no account wall | ✅ |
| `profiles` table + RLS (owner-only; no insert/delete via API; signup trigger) | ✅ (migrations 0001, 0002) |
| RLS proven by query; saved `supabase/tests/0001_profiles_rls.sql` | ✅ |
| Security advisors run + fixable ones fixed | ✅ (2 accepted — see tasks) |
| `tsc`, `expo lint`, `expo-doctor` (21/21), contrast gate all green | ✅ |
| Android dev build started | ✅ (link below) |
| iOS dev build | ⛔ needs Juan (Apple login) — see tasks |

**Build links**
- Android (development, EAS): https://expo.dev/accounts/juanvman/projects/vaddi/builds/855afebe-1622-4159-bf9e-11bcc015fd9d

## Verify on device (Juan — once the Android build installs)
- [ ] All three tabs render in **light and dark** (toggle system theme).
- [ ] In Profile, use **DEV · FORCE SCREEN STATE** to see each of **loading / empty / error / offline**
      on Discover, Trip and Profile — each offers a next step.
- [ ] Bump **system font size** up — text scales, nothing clips.
- [ ] Set a **display name**, force-quit, reopen — the name is still there (survives restart).
- [ ] Discover: tap the pick → detail opens with the same data + primary action; react yes/no (haptic).

## Juan's tasks
1. **iOS dev build (Apple login can't be automated).** In the VS Code terminal, in order:
   1. `npx eas device:create`  (register your iPhone — follow the URL/QR)
   2. `npx eas build --profile development --platform ios`  (interactive; signs in to Apple)
   Then tell me when both are done and paste the build URL.
2. **Delete the old folder** `C:\Users\juanv\coplannr` by hand — automated deletion still returns
   EBUSY (a shell is rooted inside it this session). Backup: `C:\Users\juanv\vaddi-archive-2026-09-21.zip`.
3. **claude.ai project instructions** — apply the three §7 edits (already in repo `VADDI_V4.md`).
4. **Canonical `VADDI_V4.md`** — a fully canonical replacement is still pending (A2); the repo copy
   has the §7 edits applied in the meantime.
5. *(Optional, later)* Enable **leaked-password protection** in Supabase Auth — only matters once
   email/password sign-in exists (v4 defers passwords; v1 is anonymous). Safe to ignore for now.
6. *(Optional)* The GitHub push uses a classic PAT stored in `GH_TOKEN` (via `setx`). Revoke/rotate
   it whenever you like; a fresh `gh auth login` would replace it.

## Accepted (not defects)
- **Anonymous-access advisor warning** on `profiles` is **intentional** — anonymous sign-in is v4's
  entry model (§5.1); those users must reach their own row.
- **`BrandGradient` is a solid coral fill**, not a real gradient — `expo-linear-gradient` isn't on the
  pre-approved dependency list. Approve it and it's a one-line swap.
- **`@expo/vector-icons`** was installed though not pre-approved — the SDK 57 template no longer bundles
  it and B3 needs tab icons. Flag if you'd prefer a different icon source.

## Open questions
- **Places cost model** (Phase 3 entry): with no cross-user cache of display fields, is per-session
  Google Places cost acceptable, or do we evaluate Foursquare / OSM? Decide before the places layer.

## Phase 2 — The loop with fake data — NEXT (v4 §11)
Create a trip (destination + dates), invite by link, join with a name, a minimal web page for the
invite link (see trip, react, see plan), react, lock into a loose day plan — all on **hardcoded
ideas**. Prove the UX and the UX budgets (§5) before paying for a single API call. Tables likely
needed: `trips`, `trip_members` (+ reactions on ideas) — each gets a migration and RLS, proven by
query, like `profiles` did.
