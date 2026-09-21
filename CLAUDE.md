# CLAUDE.md — how to work in this repo

Direction lives in `VADDI_V4.md`. This file is *how we work*, not *what we build*.
It does not restate v4 — read v4 for the product.

## Read first, every session, in this order
1. `VADDI_V4.md` — direction (durable: problem, loop, gates, budgets, rules).
2. `STATUS.md` — where we are: done, next, Juan's tasks, open questions.
3. `DECISIONS.md` — what was decided and why. Don't reopen settled calls.

`AUDIT.md` is the Phase 0 salvage report — background, read when useful.

## Working rules (short form of v4 §10)
- **Plan before code.** Anything beyond a small fix: write the plan, wait for approval.
- **One phase, one feature at a time.** Small commits. The app runs after every one.
- **Ask before adding** a dependency, a table, a screen, a paid service or a paid call.
- **Verdicts, not menus.** Recommend one option in plain language, say why.
- **Push back.** If a request breaks `VADDI_V4.md`, say so before building. Name scope creep.
- **No speculative abstractions.** Build for the current gate only.
- **Security basics always.** Secrets in env, never committed. RLS tested, not assumed.
- **Test what breaks silently:** ranking, quotas, cost guards, RLS. Skip test noise.

## Code conventions (v4 §10)
- `expo-clipboard`, never `Clipboard` from react-native.
- Top-level imports, never `require()` inside functions.
- Theme through one `useTheme()` hook; no hardcoded colors/spacing in screens.
- One Supabase client module.
- Navigation through expo-router. Safe areas through `useSafeAreaInsets()`.
- TypeScript strict. Bump `buildNumber` and `versionCode` before every store build.

## Hard rules carried from the audit (AUDIT.md §5 lessons)
These are mistakes the v3 app made. Do not repeat them.
1. **No provider key in the client.** Never `EXPO_PUBLIC_` a Gemini/Places/service_role
   key. Every paid call runs in a Supabase Edge Function; the app calls the function.
   Only the Supabase URL + publishable key are public.
2. **Share HTTPS universal links, never the `vaddi://` scheme.** A share message carries
   `https://vaddi.app/join/{code}` so a friend without the app still lands on the web
   join page. `vaddi://` is for auth redirects only.
3. **Cache only what Google lets you.** Place IDs (indefinite) and coordinates (≤30 days),
   keyed by area cell + category, shared across groups. Never store or share names,
   ratings, hours, photos or price — fetch those fresh per session. (v4 §7.5.)
4. **Model IDs + SKU prices live in one server config.** Re-check the provider's current
   model list and deprecations at the start of every phase. No model ID in the repo
   before Phase 3.
5. **Usage log + quotas + kill switch ship with the first paid call**, not after (v4 §7.9–10).
6. **One Supabase client module, config from env.** No hardcoded URL/keys in source.

## Repo layout
```
VADDI_V4.md  AUDIT.md  CLAUDE.md  STATUS.md  DECISIONS.md  README.md
app.json  eas.json  .env(.example)  eslint.config.js  tsconfig.json
src/app/        expo-router routes (screens)
src/            components / theme / lib as they are built (alias: @/* -> ./src/*)
assets/brand/   source brand logo (Vaddi_logo_NBG.png, vaddi-icon.png)
assets/images/  generated app icons (icon, adaptive-icon, splash-icon, favicon)
legacy/         READ-ONLY v3 reference — see below
```

## legacy/ — reference only
Real v3 files kept to re-read patterns (theme, brand kit, rec cache/ranking, loop logic).
- **Never import from `legacy/`.** Nothing in `src/` may reference it.
- It is gitignored, TS-excluded and ESLint-ignored.
- **Delete the whole folder when Phase 3 ends.**

## Before every commit
Run and keep green: `npx tsc --noEmit`, `npx expo lint`, `npx expo-doctor`.

## How decisions are made
- Product and architecture calls happen **with Juan in claude.ai chat** and land in
  `DECISIONS.md` (dated, one-line reason). Claude Code **proposes and executes; it does
  not decide beyond the current phase.** When a small unsettled choice comes up mid-task,
  take the safer default and log it in `DECISIONS.md`.

## End of every session
Update `STATUS.md`: what got done, what's next, Juan's tasks, open questions.
