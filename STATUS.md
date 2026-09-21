# STATUS

*Updated 2026-09-22. Single source of truth for where the build is.*

## Phase 0 — Audit and reset — COMPLETE
See `AUDIT.md` and `DECISIONS.md` (2026-09-21 reset). Fresh repo, SDK 57 skeleton, new Supabase
project `vaddi` (`mryoyzqkvinykehrwmri`), state files, icons, EAS/bundle IDs reused.

## Phase 1 — Skeleton — COMPLETE (pending device verification)

| Item (v4 §11 / §12) | Status |
|---|---|
| 3 tabs `Discover · Trip · Profile` (expo-router) | ✅ |
| Theme tokens, light + dark, `useTheme()` only; no hex outside `src/theme` (ESLint-enforced) | ✅ |
| WCAG AA contrast gate (`scripts/check-contrast.ts`, 18 pairs) | ✅ |
| Inter font (expo-font), splash held until loaded | ✅ |
| Brand kit ported (mark, gradient*, loader, empty state) | ✅ (*solid fill until Phase 2 — see below) |
| One card `IdeaCard` — primary + compact variants, expo-image, 44pt reactions, haptics, optimistic | ✅ |
| Madrid fixtures (8 ideas: eat/drink/do) | ✅ |
| Four states on every screen + dev control to force any state | ✅ |
| Discover: Vaddi's pick + 3 compact, detail route, no search/filters/map | ✅ |
| Trip: "No trip yet" → Create-a-trip (Phase-2 placeholder) | ✅ |
| Profile: guest status, display-name field, dev control | ✅ |
| Anonymous auth on launch, persisted; `useSession()`; no account wall | ✅ |
| `profiles` table + RLS (owner-only; no insert/delete via API; signup trigger) | ✅ (migrations 0001, 0002) |
| RLS proven by query; saved `supabase/tests/0001_profiles_rls.sql` | ✅ |
| Security advisors run + fixable ones fixed | ✅ (1 accepted — see below) |
| `tsc`, `expo lint`, `expo-doctor` (21/21), contrast gate all green | ✅ |
| GitHub auth through gh's credential store, no token anywhere | ✅ |
| Android dev build | ✅ FINISHED — links below |
| iOS dev build | ⛔ needs Juan + the iPhone — task 1 |

**Build links**
- Android (development, EAS) — **FINISHED**
  - Build page: https://expo.dev/accounts/juanvman/projects/vaddi/builds/855afebe-1622-4159-bf9e-11bcc015fd9d
  - Direct APK: https://expo.dev/artifacts/eas/mnnRWrvG2YV6r4vjlsxEYO3hfdh7ytdL8m10oKq7RTM.apk
- iOS (development, EAS) — not built yet (task 1).

## Verify on device

### How to install
**Android.** Open the **build page** (or the direct APK link) on an Android phone, download the
`.apk`, tap it, allow "install from this source" if prompted, install. If Juan has no Android
phone, send that link to a friend who does — it is a normal download, nothing else is needed on
their side.

**iOS.** Not available until task 1 produces a build.

### How to run it
A development build does **not** contain the app's JavaScript — it loads it from this computer.
So the app shows a "no bundler" screen until a dev server is running.

1. In the VS Code terminal, in `C:\Users\juanv\vaddi`:
   ```
   npx expo start
   ```
2. Keep the phone on the **same Wi-Fi** as this computer.
3. Open the **Vaddi** dev build on the phone. It lists the running server — tap it. (Or scan the
   QR code the terminal prints.)
4. If the phone and computer can't see each other (guest Wi-Fi, client isolation, VPN, firewall):
   ```
   npx expo start --tunnel
   ```
   Slower, but it routes around the network entirely.

Stop the server with `Ctrl+C`. The app reloads on save while it's running.

### Checklist
- [ ] All three tabs render in **light and dark** (toggle system theme).
- [ ] In Profile, use **DEV · FORCE SCREEN STATE** to see each of **loading / empty / error / offline**
      on Discover, Trip and Profile — each offers a next step.
- [ ] Bump **system font size** up — text scales, nothing clips.
- [ ] Set a **display name**, force-quit, reopen — the name is still there (survives restart).
- [ ] Discover: tap the pick → detail opens with the same data + primary action; react yes/no (haptic).

## Juan's tasks
1. **Register the iPhone, then build for iOS** (needs the iPhone in hand; Apple login can't be
   automated). In the VS Code terminal, in order:
   1. `npx eas device:create` — sign in to Apple (ID, password, 2FA code on the iPhone), pick your
      team, choose method **Website**. Open the printed URL/QR on the iPhone **in Safari**, allow
      the profile download, then **Settings → Profile Downloaded → Install**.
   2. `npx eas build --profile development --platform ios --no-wait` — Apple login again;
      distribution certificate (reuse if offered, otherwise generate); provisioning profile
      (generate); device list — **space** to select the iPhone, **Enter**; push notifications **No**.
   Then paste the build URL here and it goes under Build links.
2. **claude.ai project instructions — the three §7 edits.** The repo `VADDI_V4.md` is canonical and
   correct; the chat Project copy is the only stale one. Exact replacement text is in the session
   notes / `DECISIONS.md` (2026-09-21 Phase 1 entry).
3. *(Optional, later)* Enable **leaked-password protection** in Supabase Auth — only matters once
   email/password sign-in exists (v4 defers passwords; v1 is anonymous). Safe to ignore for now.
4. *(Optional, housekeeping)* `C:\Users\juanv\vaddi-archive-2026-09-21.zip` is now the only copy of
   the v3 app. Keep it or delete it as you like — nothing depends on it.

## Accepted (not defects)
- **Anonymous-access advisor warning** on `profiles` is **intentional** — anonymous sign-in is v4's
  entry model (§5.1); those users must reach their own row.
- **`BrandGradient` is a solid coral fill** until the start of Phase 2. `expo-linear-gradient` is
  **approved**, but it is a native module: adding it now would make it missing from the dev builds
  above. It lands with the next pair of dev builds (DECISIONS.md 2026-09-22).

## Open questions
- **Places cost model** (Phase 3 entry): with no cross-user cache of display fields, is per-session
  Google Places cost acceptable, or do we evaluate Foursquare / OSM? Decide before the places layer.

## Phase 2 — The loop with fake data — NEXT (v4 §11)
**Does not start until Juan has seen Phase 1 running on a phone.**

Create a trip (destination + dates), invite by link, join with a name, a minimal web page for the
invite link (see trip, react, see plan), react, lock into a loose day plan — all on **hardcoded
ideas**. Prove the UX and the UX budgets (§5) before paying for a single API call. Tables likely
needed: `trips`, `trip_members` (+ reactions on ideas) — each gets a migration and RLS, proven by
query, like `profiles` did.

First change of the phase: add `expo-linear-gradient` and rebuild both dev clients, so the native
module and the builds stay in step.
