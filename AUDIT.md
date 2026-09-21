# Vaddi — Phase 0 Audit (salvage vs rebuild)

*Read-only audit. Audited copy: `c:\Users\juanv\coplannr\vaddi-project` (confirmed live root by Juan). `..\Vaddi` and `..\CoPlannr-MVP` are stale copies, out of scope. Date: 2026-09-21. Nothing was changed; only this file was written.*

---

## Summary

**Verdict: Rebuild. Fresh repo, new Supabase project, reference-port ~6 files.** Do not salvage in place.

The app is small (31 JS files, ~7,700 lines of screens) and, for a *v2/v3* app, competently built — clean theme tokens, a real card/loop, a working cache pattern. But it is wrong for v4 at the foundations, and the foundations are exactly what v4 fixes: **every paid call runs in the client with the API keys shipped in the bundle** (v4 §7.1 says never), **there are zero Edge Functions** (v4 wants one per paid call), it is **100% JavaScript** (v4 mandates TypeScript strict), and its **shared-places-cache — v4's core cost lever — is illegal under Google Places terms** and is scoped per-trip anyway. Rebuilding these is most of the app. What is genuinely good (theme, brand kit, the code-first ranking + cache *pattern*, the loop logic) ports faster as reference than it reworks in place, and the git history is unusable as a base.

**The five findings that matter most:**

1. **Keys ship in the client.** Gemini and Google Places are called with `fetch` straight from the app using `EXPO_PUBLIC_*` keys ([utils/gemini.js:8,63](utils/gemini.js#L63), [utils/places.js:5,51](utils/places.js#L51)); the Supabase URL + anon key are hardcoded in source ([utils/supabase.js:5-6](utils/supabase.js#L5-L6)). `expo-doctor` confirms both keys inline into every build. **Rotate the Gemini key and the Google Places key.**

2. **v4's shared places cache is not allowed by Google.** Places (New) terms let you store `place_id` indefinitely and lat/lng ≤30 days, but **not** names, ratings, hours, photos, or price — and not shared across users. The current `recommendations` table caches exactly those forbidden fields ([migration](supabase/migrations/20260528_recommendations.sql), [utils/recommendations.js:20-37](utils/recommendations.js#L20-L37)). v4 §7.5 assumes the opposite. This changes the cost model — decide it before Phase 3.

3. **The AI models in the code die on 16 Oct 2026.** `gemini-2.5-flash` and `gemini-2.5-flash-lite` ([utils/gemini.js:14-18](utils/gemini.js#L14-L18)) are both scheduled for retirement in ~3 weeks. Any build after that date breaks. Move to Gemini 3.1 Flash-Lite / 3 Flash.

4. **The v4 "Never" features are still in the code.** `chat-import.js` (WhatsApp/AI-plan import via `expo-document-picker`), the `crew` address book, tier/subscription screens, currency/language/export settings, contacts + microphone permissions. None of this is in v4 scope. It is history to reference, not code to carry.

5. **The backend is paused and its schema was hand-built, not migrated.** The Supabase project is `INACTIVE` (7+ days idle). Only 1 migration file exists for a ~7-table schema, so the DB and the repo already disagree. Anonymous auth (v4's entry model) is **not** implemented — auth is email/password ([app/auth.js](app/auth.js)).

**Two things only Juan can do now:** rotate the two Google keys; decide new-project vs reset on Supabase (I recommend new). Everything else waits for Phase 1.

---

## 1. Repo and build health

**Git state — this is itself a finding.**
- The git repo root is the **parent** `C:\Users\juanv\coplannr`, not `vaddi-project`. Branch `main` (also `origin/main`, a stray `origin/master`).
- History is six commits of **zip uploads** (`Add files via upload`, `Delete *.zip`, `Initial commit`) — a GitHub-web workflow, not real version control.
- **`vaddi-project/` is not tracked by git at all** — `git ls-files vaddi-project` returns 0 files. The live app is entirely uncommitted, sitting inside a repo whose history is about something else.
- Last real activity on the live files: **2026-05-28** (four months of local edits after the last commit).
- **Implication:** there is no branch to protect and no history worth keeping for the live code. This argues for a fresh repo (see §7). *I did not run git init/add/commit or change anything, per instructions.*

**Secret scan of git history: clean.** No `AIza…` key, no Supabase anon JWT, and no `.env` was ever committed (`git log --all -S` for each pattern → nothing). The secret exposure is at **build time** (client bundle), not in git.

**Versions vs current stable (Sep 2026):**

| Thing | In repo | Current stable | Distance |
|---|---|---|---|
| Expo SDK | **54**.0.34 | **57** (30 Jun 2026) | 3 SDK majors behind |
| React Native | 0.81.5 | 0.86.3 | ~5 minors |
| React | 19.1.0 | 19.3.0 | patch |
| @supabase/supabase-js | 2.91 | 2.109 | minor |
| expo-router | 6.0.23 | 6.0.24 (SDK54) / 57 | in-SDK patch |
| react-native-worklets | 0.7.2 | expects **0.5.1** | **mismatch (see below)** |

The app is internally *consistent within SDK 54* — only patch drift on `expo`, `expo-constants`, `expo-font`, `expo-router`, `expo-updates`, plus one **minor mismatch**: `react-native-worklets@0.7.2` where SDK 54 expects `0.5.1` (worklets underpins Reanimated 4 — a plausible source of release-only animation crashes).

**`expo-doctor`: 16/18 passed. 2 failed:**
- **App config schema** — icon `Vaddi_logo_NBG.png` is **549×465, not square**; used for both `icon` and Android `adaptiveIcon.foregroundImage`. Will produce a bad adaptive icon and can fail store review.
- **Package versions** — the drift above.

**`expo install --check`:** flags the same 6 packages as needing update for SDK-54 compatibility.

**`npm audit`:** 39 vulnerabilities (2 critical, 19 high) — but essentially all in **transitive dev tooling** (`ws`, `yaml` via metro/react-native/babel), not shipped runtime code. Low real risk; a rebuild on SDK 57 clears most.

**Language split:** **31 JS files, 0 TypeScript** (0 `.ts`/`.tsx`). No `tsconfig.json`, so `tsc --noEmit` is not meaningful. No ESLint config present. v4 §9 mandates **TypeScript, strict** — so type/lint coverage today is **zero**, and the whole tree would need typing in a rebuild.

**`app.json` / `eas.json`:**

| Item | Value | v4 note |
|---|---|---|
| name / slug | Vaddi / vaddi | ok |
| version | 2.0.2 | v2 branding |
| iOS bundleId / Android package | `com.vaddi.app` | reusable |
| iOS buildNumber / Android versionCode | 10 / 9 | real builds shipped → keys were distributed |
| EAS projectId | `b2b4d432-…-014d21a284d9`, owner `juanvman` | reusable if repo kept |
| Universal links | `applinks:vaddi.app`, Android intentFilter `https://vaddi.app/join` | good; but in-app share uses `vaddi://` (bug, §5) |
| updates | `u.expo.dev/b2b4d432…`, runtimeVersion `appVersion` | ok |

**Permissions requested — flagging what v4 does not need:**

| Permission | Declared in | v4 needs it? |
|---|---|---|
| Location (when-in-use) | app.json plugin + iOS/Android | **Yes** ("What now?") |
| INTERNET | Android | Yes |
| **RECORD_AUDIO ×2 + MODIFY_AUDIO_SETTINGS** | Android | **No** — leftover from v2 voice companion |
| **NSMicrophoneUsageDescription** ("talk to your AI travel companion") | iOS | **No** — v2 voice; Never-list |
| **Contacts** (`expo-contacts` plugin) | app.json | **No** — v4 invites by link, not contacts |

---

## 2. What exists, mapped to the v4 loop

Every route/util, one line, loop step, works-from-code. Loop = **Suggest → React → Decide → Book**.

| File | Lines | What it does | Loop step | Functional? |
|---|---|---|---|---|
| `app/_layout.js` | 297 | Root: fonts, theme, auth gate, onboarding gate, deep-link routing | infra | Yes |
| `app/index.js` | 5 | Redirect → /auth | infra | Yes |
| `app/auth.js` | 513 | Email/password sign in/up + forgot-password | infra (auth) | Yes |
| `app/onboarding.js` | 118 | 3-slide intro | infra | Yes |
| `app/(tabs)/_layout.js` | 99 | Bottom tabs: **Crew · Trips · Profile** | infra | Yes |
| `app/(tabs)/trip.js` | 546 | List trips + create-trip modal (dates, type, budget) | **Suggest** | Yes |
| `app/(tabs)/crew.js` | 380 | Personal address book; import from contacts | none | Yes |
| `app/(tabs)/profile.js` | 311 | Prefs (dietary/accessibility), tier badge, theme, settings menu | none | Yes |
| `app/trip/[id].js` | **1039** | Trip hub: day-by-day plan, RSVP reactions, budget bar, context, crew, share, Ask-Vaddi | **React · Decide · Book** | Yes |
| `app/join/[code].js` | 226 | Deep-link join: preview trip by code, confirm | infra (join) | Yes* |
| `app/join-trip.js` | 234 | Manual join: paste code, preview, join | infra (join) | Yes |
| `app/invite-crew.js` | 164 | Pick crew, invite by SMS or share sheet | Book (invite) | Yes |
| `app/nearby.js` | 420 | Live "What now?" recs from GPS; save to plan | **Suggest** | Unverified† |
| `app/discover-destinations.js` | 290 | "Where should I go?" → Gemini destinations | Suggest (pre-trip) | Yes (Gemini) |
| `app/chat-import.js` | 353 | Import trip from WhatsApp export / AI plan via **document-picker** | Suggest (import) | Unverified† |
| `app/subscription.js` | 503 | Tier UI (Free/Traveler/Explorer); payment stubbed | none | UI only |
| `app/currency-settings.js` | 228 | Pick currency, persist to profile | none | Yes |
| `app/language-settings.js` | 264 | Pick AI language; UI translation "coming soon" | none | Partial |
| `app/edit-profile.js` | 224 | Edit name/phone/bio; photo picker stubbed | none | Partial |
| `app/export-data.js` | 197 | Export trips/expenses/docs — all "Coming Soon" | none | Stub |
| `app/faq.js` | 198 | FAQ + mailto support | none | Yes |
| `components/Brand.js` | 133 | Brand kit: gradient, compass loader, screen loader, empty state, mark | infra (UI) | Yes |
| `utils/ThemeContext.js` | 182 | Design tokens (light/dark, Inter scale, radii/spacing) + `useTheme()` | infra | Yes |
| `utils/gemini.js` | 363 | Gemini calls: chat extract, plan suggest, live-rec ranking, destinations | Suggest engine | Yes (client) |
| `utils/places.js` | 101 | Places (New) Text Search + photo URLs | Suggest engine | Yes (client) |
| `utils/recommendations.js` | 128 | Cache orchestration + save-rec-to-plan | Suggest engine | Yes |
| `utils/plan.js` | 41 | One shared plan_items insert | Decide | Yes |
| `utils/tripMeta.js` | 40 | Trip types, categories, statuses, currency symbols | infra | Yes |
| `utils/supabase.js` | 15 | Supabase client (hardcoded keys) | infra | Yes |

\* `join/[code].js` uses RPCs that must be `SECURITY DEFINER` for anon lookup — not verifiable while DB paused (§4).
† `nearby.js` (discovery feed) and `chat-import.js` (import round-trip) are the two flows Juan flagged as never device-verified. Code looks complete; **not verified** — DB paused and no device run in a read-only audit.

**Fit table — one verdict per module:**

| Module | Verdict | Reason (tied to v4) |
|---|---|---|
| `utils/ThemeContext.js` | **Keep with rework** | Tokens already match v4 palette (§6). Port to TS; strip nothing. Best asset in the repo. |
| `components/Brand.js` | **Keep with rework** | Gradient/loader/empty-state kit fits v4's card system; retype, drop nothing essential. |
| `utils/tripMeta.js` | **Keep with rework** | Category/status vocab (eat/drink/do…) matches v4 ideas; trim trip-type list. |
| `utils/recommendations.js` (pattern) | **Reference only** | The *cache-first, generate-on-miss* pattern is exactly v4 §7. But logic must move **server-side**, cache scope must become **shared area-cell** not per-trip, and stored fields must obey Places terms. Rewrite, don't lift. |
| `utils/places.js` (field mask) | **Reference only** | Tight field mask + time-bucket queries are the right instinct (§7.6). Reuse the *shape*; the call moves to an Edge Function. |
| `utils/gemini.js` (3 jobs) | **Reference only** | Does roughly v4's 3 model jobs, but client-side, wrong model IDs, no field/token discipline enforced. Rebuild server-side. |
| `app/trip/[id].js` (loop logic) | **Reference only** | The React/Decide loop, reactions upsert, day grouping are real product logic worth re-reading. Too entangled (1,039 lines, budget/expense bits) to lift. |
| `utils/plan.js` | Reference only | Small; the shape informs the new `ideas` table. |
| Card rendering (in nearby/trip) | **Reference only** | v4 wants **one** card component; today card markup is duplicated across screens. Rebuild as single component. |
| Theme-consuming screens (trip list, profile) | Reference only | Good patterns, wrong scope; re-read, rebuild. |
| Auth (email/password) | **Delete** | v4 = anonymous sign-in that upgrades. Different model. |
| `crew.js` + `invite-crew.js` + `crew` table | **Delete** | Personal address book + contacts import; not in v4 (invite is by link). |
| `chat-import.js` | **Delete** | Uses `expo-document-picker`; WhatsApp/AI-plan import is a Never-list feature. |
| `subscription.js` | **Delete** | 3-tier subscription; v4 = per-trip Trip Pass via RevenueCat, Gate 3 only. |
| `currency/language/export/edit-profile/faq` | **Delete** | Settings sprawl; none serves the loop for v1. |
| `discover-destinations.js` | Reference only | Nice "where to go" idea; not v1 core loop. Keep the concept, not the code. |
| `app.zip` (root) | **Delete** | Stale Dec-2025 v2 snapshot (`docs.js`, `wallet.js`, `plan.js` tabs). |
| `CLAUDE.md.txt`, `dist/` (empty) | **Delete** | History / empty. |

**v4 "Never"-list items still in code:** in-app import of chat/plans (`chat-import.js`), document-picker dependency, expense/budget splitting (`trip/[id].js` budget bar + `export-data.js` expenses), voice/microphone (perms + `expo-av`), image-picker (receipts/avatars), `react-native-calendars` (itinerary-ish). All confirm this is a v2/v3 codebase, not a v4 one.

**Not found (v4 will need to build):** a single reusable **card component** (markup is duplicated), a **map view** (no `react-native-maps`/MapView anywhere), **share-card image generation** (shares are plain text with a `vaddi://` link), **notifications** (no push wiring), **RevenueCat** (no `react-native-purchases` dependency — subscription screen is a stub).

---

## 3. Paid calls, secrets, security (v4 §7, §9)

**Every paid call site (all client-side — v4 §7.1 violated across the board):**

| # | API | File:line | Client/Server | Key | Trigger | Fields | Cache | Log |
|---|---|---|---|---|---|---|---|---|
| 1 | Gemini `generateContent` | [gemini.js:63](utils/gemini.js#L63) | **Client** | `EXPO_PUBLIC_GEMINI_API_KEY` (in URL query string) | user action (import / suggest / discover / recs) | prompt text | none | `console` only |
| 2 | Google Places **Text Search (New)** | [places.js:62-71](utils/places.js#L62-L71) | **Client** | `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` (`X-Goog-Api-Key` header) | on cache miss inside a rec generation | tight mask incl. `rating`, `priceLevel`, `photos`, `currentOpeningHours` | via `recommendations` table | none |
| 3 | Places **Photo media** | [places.js:51](utils/places.js#L51) | **Client** | same Places key **embedded in the photo URL** | when a card photo renders | photo | photo_url stored in cache | none |

- **Model fallback order is wrong for cost** ([gemini.js:14-18](utils/gemini.js#L14-L18)): `flash → flash-lite → pro`. Flash-lite is cheaper than flash, so this escalates *up* in price on the first retry. v4 §7.7 wants cheapest-first.
- **Chat import sends up to 200 KB of text** to the model ([gemini.js:22](utils/gemini.js#L22)) — far over v4's 1,500-token input budget (§7.8).
- **Places field mask requests `rating`** ([places.js:67-70](utils/places.js#L67-L70)), which pushes the call from Pro to the **Enterprise SKU** (see §6). The mask is otherwise disciplined and correct in spirit.
- **No usage log, no quota, no kill switch** anywhere. v4 §7.9/§7.10 require all three; they do not exist.
- **Trigger discipline is mostly OK:** no paid call fires on app open or scroll — recs generate on a cache miss behind a user entering "Nearby", and Gemini fires on explicit buttons. That instinct survives to v4.

**Secrets — where they are (values never printed):**

| Secret | Location | Provider | Verdict |
|---|---|---|---|
| Gemini API key | `.env` (`EXPO_PUBLIC_GEMINI_API_KEY`), on disk, 140-byte file | Google AI (Gemini) | **Rotate.** `EXPO_PUBLIC_` ⇒ inlined into every build (`expo-doctor` confirms export); builds 9/10 shipped it. |
| Google Places key | `.env` (`EXPO_PUBLIC_GOOGLE_PLACES_API_KEY`) | Google Cloud (Places) | **Rotate.** Same reason; also embedded in photo URLs. |
| Supabase URL + anon key | **Hardcoded** in [utils/supabase.js:5-6](utils/supabase.js#L5-L6) | Supabase | Anon key is *public by design* (safe **iff** RLS is correct). No rotation needed for its own sake; it dies with the project if you start fresh. Project ref `wnatkfpktymevbmdewyw`. |

`.env.example` ships a placeholder `EXPO_PUBLIC_GEMINI_API_KEY=turkey` (harmless). `.gitignore` correctly excludes `.env`, and git history is clean — but `.gitignore` does **not** stop `EXPO_PUBLIC_` inlining at build. The architectural fix (v4): keys live only in Edge Function env, never `EXPO_PUBLIC_`.

**Keys that must be rotated:** (1) **Gemini API key**, (2) **Google Places / Google Cloud API key**. That's it — the Supabase anon key is public by design.

**Supabase security (RLS, policies, definer functions, buckets, advisors):** **Not verified — project is `INACTIVE` (paused).** `list_tables`, `list_migrations`, and both advisor calls time out (DB asleep); `list_edge_functions` works (management API) and returns **none**. What I can state from code + the one migration:
- The `recommendations` table has correct trip-scoped RLS in its migration (select/insert/delete gated by `trip_members`). Good template.
- Two RPCs — `get_trip_by_code`, `join_trip_with_code` ([join/[code].js:50,71](app/join/[code].js#L50)) — must be reachable by an unauthenticated/anon user to preview-and-join from a link, which strongly implies `SECURITY DEFINER`. That is legitimate for a join-by-code flow **only if** they validate the code, rate-limit, and don't leak trip contents broadly. **Needs review once unpaused** (matches Juan's belief).
- The believed "3 public storage buckets from document-scanning" **could not be verified** while paused. To be checked (query below).

*To finish §3/§4 I need the DB awake. I did not restore it (that changes state — your call). Either restore it and I'll run read-only advisor/RLS/bucket/row-count checks, or run the SQL in §4 and paste results.*

---

## 4. Backend inventory

**Project:** `Vaddi` / ref `wnatkfpktymevbmdewyw`, org `ofbnpakcpnpijbzwcjry`, region **eu-west-1**, Postgres **17.6**, created 2025-12-16, **status INACTIVE (paused)**. Free tier pauses after 7 days idle → confirms 7+ days no traffic.

**Edge Functions:** **none deployed** (verified). ⇒ all paid calls are client-side; v4's server layer does not exist yet.

**Tables the code references** (from `.from()` / `.rpc()` across the tree):

| Table | Referenced in code | Maps to v4 target model? |
|---|---|---|
| `profiles` | 11× | **Yes** → `profiles` |
| `trips` | 9× | **Yes** → `trips` |
| `plan_items` | 8× | **Partial** → v4 `ideas` (durable saved list). Carries budget/cost/assign/status fields v4 doesn't need. |
| `crew` | 6× | **No** — personal address book; not in v4 model. Surplus. |
| `trip_members` | 5× | **Yes** → `trip members` |
| `recommendations` | 3× | **Partial** → v4 `places cache` + ephemeral feed. **But stores Places-forbidden fields and is keyed per-trip, not shared** (see §6). |
| `reactions` | 2× | **Yes** → `reactions` |
| RPC `get_trip_by_code` / `join_trip_with_code` | 2× each | join flow; keep concept |

**v4 target model vs what exists:**

| v4 table | Status today |
|---|---|
| profiles | ✅ exists |
| trips | ✅ exists |
| trip members | ✅ exists (`trip_members`) |
| places cache | ⚠️ partial (`recommendations`) — **wrong scope + illegal stored fields** |
| ideas | ⚠️ partial (`plan_items`) — overloaded with budget/assignment |
| reactions | ✅ exists |
| booking clicks | ❌ missing |
| usage log | ❌ missing (blocks v4 §7.9 cost logging) |
| **Surplus to delete** | `crew`; believed-orphan v2/v3 tables `bookings`, `notifications` (not referenced by any code — **orphaned if present**); any v2 leftovers (docs/wallet/expenses) |

**Migration history vs schema:** only **one** migration file exists (`20260528_recommendations.sql`) for a ~7-table schema ⇒ the rest was created by hand in the SQL editor. The repo and DB already diverge. v4 wants schema-from-migrations.

**Auth:** email/password + reset ([auth.js](app/auth.js)). **Anonymous sign-in is not implemented in the app** and its server enablement can't be checked while paused. v4's entry model (anon → upgrade) is absent.

**Outside services referenced:**

| Service | State |
|---|---|
| Supabase | **Wired** (client hardcoded), paused |
| EAS / Expo Updates | **Wired** (projectId, updates URL, buildNumbers 9/10) |
| Google Gemini | **Wired**, client-side |
| Google Cloud (Places) | **Wired**, client-side |
| RevenueCat | **Absent** — no SDK; subscription screen is a stub |
| Analytics | **Absent** — no analytics SDK found |
| Affiliates / booking partners | **Absent** — booking is `websiteUri`/Maps link only |
| Firebase | **Absent** |

**Exact read-only SQL to run when the DB is restored** (paste results and I'll finish §3/§4):
```sql
-- 1. Full table list + row counts
select relname as table, n_live_tup as est_rows
from pg_stat_user_tables order by n_live_tup desc;
-- 2. RLS on/off per table
select relname, relrowsecurity from pg_class
where relnamespace='public'::regnamespace and relkind='r';
-- 3. Every policy
select schemaname,tablename,policyname,cmd,roles,qual,with_check
from pg_policies where schemaname='public';
-- 4. SECURITY DEFINER functions + who can execute (anon?)
select p.proname, p.prosecdef,
       has_function_privilege('anon', p.oid, 'execute') as anon_can_exec
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public';
-- 5. Storage buckets + public flag
select id, name, public from storage.buckets;
-- 6. Anonymous auth providers (check dashboard: Auth > Providers > Anonymous)
```
Or say the word and I'll restore the project (read-only) and pull `get_advisors(security)` + `get_advisors(performance)` myself.

---

## 5. Bugs

**Known bugs — verified against the live copy:**

| Believed bug | Verdict in `vaddi-project` | Evidence |
|---|---|---|
| `Clipboard` from `react-native` | **Not present / correct** | uses `expo-clipboard` ([trip/[id].js:13,344](app/trip/[id].js#L13)) |
| `require()` inside functions | **Not present** | all `require()` are top-level static **asset** imports (idiomatic) — profile/auth/join/nearby/onboarding/Brand |
| AsyncStorage dynamic import in join flow | **Not present** | no dynamic `import(` anywhere; join uses top-level `import AsyncStorage` |
| `vaddi://` vs HTTPS universal links | **CONFIRMED bug** | shares send `vaddi://join/{code}` ([invite-crew.js:30](app/invite-crew.js#L30), [trip/[id].js:351](app/trip/[id].js#L351)); also `vaddi://reset-password` ([auth.js:84](app/auth.js#L84)) |
| Native version mismatch (release-only crash) | **Confirmed risk** | `react-native-worklets 0.7.2` vs SDK-54-expected `0.5.1` (§1) |

The first three "known bugs" are real elsewhere but **already clean in the live copy** — a sign the believed-bug list is stale relative to `vaddi-project`, likely describing `..\Vaddi` / `..\CoPlannr-MVP`.

**Bugs/risks found, classified — (a) dies with rebuild · (b) fix if code kept · (c) lesson → future CLAUDE.md rule:**

| Bug | File | Class | Note |
|---|---|---|---|
| `vaddi://join/{code}` share links can't open for a friend without the app; breaks "value before install" | invite-crew:30, trip:351 | **(c)** | v4 §5.2. Rule: **share HTTPS universal links, never the custom scheme.** Infra (applinks + intentFilter for `https://vaddi.app/join`) already exists — just wrong string. |
| All paid keys in client bundle | gemini.js, places.js | (a)+(c) | Rule: **no `EXPO_PUBLIC_` provider keys; every paid call via Edge Function.** |
| Places cache stores/share ToS-forbidden fields | recommendations.js, migration | (a)+(c) | Rule: **cache only `place_id` (indefinite) + coords (≤30d); refetch details live.** |
| Deprecated Gemini model IDs (die 16 Oct 2026) | gemini.js:14-18 | (a)+(c) | Rule: **model IDs in one server config; check deprecations each phase (§7.7).** |
| Model fallback escalates *up* in cost | gemini.js:14-18 | (a) | cheapest-first when rebuilt. |
| 200 KB text to model | gemini.js:22 | (a) | over token budget; feature is Never-list anyway. |
| No usage log / quota / kill switch | (absent) | (a)+(c) | Rule: **usage log + quotas ship in the same phase as the first paid call (§7.9-10).** |
| Non-square icon 549×465 | app.json + asset | **(b/c)** | store-blocking; needs a square icon asset regardless of repo choice. |
| `worklets` version mismatch | package.json | (a) | resolved by clean SDK-57 install. |
| Hardcoded Supabase creds + `// PASTE YOUR KEYS HERE` | supabase.js:4-6 | (a)+(c) | Rule: **one Supabase client module, config from env.** |
| `plan_items` insert reads `auth.getSession()` but relies on client RLS only | plan.js, recommendations.js | (b) | verify RLS actually enforces `created_by`/membership server-side (can't check while paused). |

---

## 6. Outside reality check

*(URLs + date checked: 2026-09-21)*

**Expo SDK — current stable: 57** (released 30 Jun 2026). App is on **54** → 3 majors behind. SDK 56 had a Hermes memory regression fixed in 57; start a rebuild directly on **57**. — [expo.dev/changelog/sdk-57](https://expo.dev/changelog/sdk-57), [docs.expo.dev/versions/latest](https://docs.expo.dev/versions/latest/)

**Gemini — the models in the code are being retired 16 Oct 2026 (~3 weeks):**

| Model | In code? | Input / Output ($/M tok) | Status |
|---|---|---|---|
| gemini-2.5-flash | ✅ | $0.30 / $2.50 | **Deprecated 16 Oct 2026** |
| gemini-2.5-flash-lite | ✅ | $0.05 / $0.20 | **Deprecated 16 Oct 2026** |
| gemini-2.5-pro | ✅ | (higher) | superseded |
| **Gemini 3.1 Flash-Lite** | — | **$0.25 / $1.50** | cheapest that does v4's 3 jobs |
| Gemini 3 Flash | — | $0.50 / $3.00 | escalation tier |

v4's 3 model jobs (structure a query, one-line "why", compose a day) are easily within **3.1 Flash-Lite**. At v4's 1,500-in/300-out budget that's ≈ **$0.0008/call** — trivially inside €0.30/trip; the **Places bill dominates**, exactly as v4 §7 warns. — [ai.google.dev/gemini-api/docs/pricing](https://ai.google.dev/gemini-api/docs/pricing), [pricepertoken.com …gemini-2.5-flash-lite](https://pricepertoken.com/pricing-page/model/google-gemini-2.5-flash-lite), [cloudzero.com/blog/gemini-pricing](https://www.cloudzero.com/blog/gemini-pricing/)

**Google Places API (New) — Text Search, the v4 card fields:**
- **Price:** Text Search is the Pro-band SKU at **$32 / 1,000** for the first 100k/mo — **but requesting `rating` (which the code and the v4 card both need) bumps the call to the Enterprise SKU ≈ $35 / 1,000** (~**$0.035/search**). Photos billed separately on render.
- **Free allowance (since 1 Mar 2025):** per-SKU monthly caps that **don't pool** — ~10k Essentials, **5k Pro, 1k Enterprise**. A rating-bearing search draws on the **1,000 Enterprise** free calls/month.
- **Caching terms — the important part for v4:** you **may not** cache or store Places content except: **`place_id` indefinitely**, and **lat/lng for ≤30 days**. Names, ratings, opening hours, photos, price levels **may not be stored or shared across users**.
- **Verdict on v4's assumption:** v4 §7.5 ("cache by area cell … **shared across users and groups** … one search, not two") is **not permitted** for the display fields under Google's terms, and the current `recommendations` table violates them. **This contradicts v4's core cost lever.** Options to raise before Phase 3: (a) cache only `place_id`+coords and refetch display fields live per session (legal, but you pay per view); (b) evaluate a source with friendlier caching — **Foursquare** or **OpenStreetMap/Overpass** (v4 §9 explicitly invites this: "evaluate cheaper sources during the audit"); (c) accept per-request Places within the 1k Enterprise free cap + quotas. — [safegraph.com/guides/google-places-api-pricing](https://www.safegraph.com/guides/google-places-api-pricing/), [mapsleads.co/blog/google-places-api-free-tier-limits-2026](https://www.mapsleads.co/blog/google-places-api-free-tier-limits-2026), [woosmap.com/blog/google-maps-api-pricing-breakdown](https://www.woosmap.com/blog/google-maps-api-pricing-breakdown)

**Supabase free tier:** 500 MB DB, 1 GB storage, 5 GB bandwidth, **50k MAU**, **2 active projects**, 7-day log retention. **Projects pause after 7 days idle** (this one **is paused** → restore before use; add a keep-alive or expect pauses in beta). **Anonymous sign-in is supported on free** and counts toward MAU once it authenticates — v4's entry model works here. — [dev.to/…supabase-pricing-2026](https://dev.to/nayankyada/supabase-pricing-2026-free-tier-limits-compute-costs-when-to-upgrade-52af), [supabase pause guide](https://shadhujan.medium.com/how-to-keep-supabase-free-tier-projects-active-d60fd4a17263)

**v4 assumptions that current pricing/terms contradict:**
1. **Shared places cache across groups** — not allowed for display fields (headline).
2. **Gemini model IDs in code** — retired in ~3 weeks.
3. Places "cheapest model call" framing is right, but the **rating field silently triggers the Enterprise SKU** — budget with $0.035/search, not the Pro floor.

---

## 7. Verdict

**1) Salvage or rebuild → Rebuild.**
The parts that fit v4 (theme, brand kit, the cache/ranking *pattern*, loop logic) are ~15% of the code and port faster as **reference**. The parts that define the app today — client-side paid calls, email auth, crew/tier/import features, JS-not-TS, a places cache that's both illegally-scoped and per-trip — are the foundation, and v4 replaces the foundation. Reworking in place means gutting a 1,000-line trip hub and a client data layer while dragging Never-list features behind you. A clean build on SDK 57 + TS + Edge Functions is less work and gives you §12's "done" bar from day one.

**2) Fresh repo or clean branch → Fresh repo.**
The current git root is the parent folder, the history is zip uploads, and the live app is **untracked**. There is nothing to branch from. Start a new repo at `vaddi-project`-equivalent root (or a new folder), `git init`, first commit = the v4 skeleton. Keep the EAS project (reuse `projectId`/bundle IDs) so store identity carries over. *(I changed nothing in git, per instructions.)*

**3) Keep Supabase project or start new → Start a new project (delete the old).**
Close call, but new wins: the schema needs a full reset anyway, anonymous auth must be enabled fresh, and a new project guarantees no orphan buckets/policies/tables and no stale MAU. The only cost is re-entering identifiers. Watch the **2-project free-tier cap** — delete the paused `Vaddi` project when the new one is up. (If you'd rather not lose the 6-month-old project, the fallback is: restore it, drop every table, rebuild from migrations, enable anonymous auth — same end state, more cruft risk.)

**Salvage list — files to carry over and the rework each needs:**

| Carry over | As | Rework |
|---|---|---|
| `utils/ThemeContext.js` | Keep | → TypeScript; confirm tokens vs v4 palette; wire `useTheme()` unchanged. |
| `components/Brand.js` | Keep | → TS; feed the single card component. |
| `utils/tripMeta.js` | Keep | → TS; trim trip-type list to v4 needs. |
| `utils/recommendations.js` | Reference | Rewrite server-side: shared **area-cell** cache key, store only `place_id`+coords, TTL, usage log. |
| `utils/places.js` | Reference | Move to Edge Function; keep field-mask discipline; drop `rating` if avoiding Enterprise SKU. |
| `utils/gemini.js` | Reference | Move to Edge Function; new model IDs; enforce token budget; the 3 jobs only. |
| `app/trip/[id].js` | Reference | Re-read for loop/reactions/day-grouping logic; rebuild lean, no budget/expense. |
| `app.json` (ids) | Keep values | New square icon; strip audio/contacts permissions; keep bundle IDs + universal links. |

**Things only Juan can do:**
- **Rotate** the Gemini API key and the Google Cloud/Places key (both shipped in builds).
- On Google Cloud: restrict the new Places key (referrer/app + API restrictions), set a budget alert.
- Decide new Supabase project vs reset; enable **anonymous sign-in**; delete the stale project to respect the 2-project cap.
- Delete stale copies `..\Vaddi` and `..\CoPlannr-MVP`, root `app.zip`, `CLAUDE.md.txt`.
- Provide a **square** app icon.

**Risks to the v4 plan discovered:**
- **Cost model:** the shared-places-cache saving is not legally available for display fields → €0.30/trip target must be re-derived around per-view Places cost or an alternative provider. This is the biggest risk to §7/§8 economics.
- **Timeline:** Gemini 2.5 models retire 16 Oct 2026 — build on Gemini 3.x from the start.
- **Places free tier** is only 1,000 Enterprise (rating-bearing) calls/month — quotas + kill switch are not optional; they gate Gate-2 cost.
- **Universal-link plumbing** must be real for the "friend joins from a link without installing" promise (§5.2) — needs a hosted `vaddi.app/join` web page (v4 wants this web view anyway).

**Open questions (only ones that change the verdict):**
1. **Places vs alternative source?** If a shared cache is central to your unit economics, do we evaluate Foursquare/OSM in Phase 3, or accept per-view Google Places cost + quotas? (Changes the cost model and the `places cache` table design.)
2. **New Supabase project or reset existing?** (Both fine; affects whether I write a fresh-schema plan or a reset+migrate plan.)
3. Restore the paused DB now so I can pull advisors/RLS/buckets/row counts, or is a code-inferred backend map enough for the rebuild? (Only affects completeness of §3/§4, not the verdict.)
4. Reuse the existing EAS project + bundle IDs (`com.vaddi.app`), or start those clean too?
5. Keep the `vaddi.app` domain + universal-link setup as-is for the invite web page?

**Proposed entry checklist for Phase 1 (v4 §11 skeleton):**
- [ ] New repo initialized; first commit = skeleton. Expo **SDK 57**, TypeScript strict, ESLint/Prettier.
- [ ] New Supabase project; **anonymous auth on**; one `supabase` client module reading env (no hardcoded keys).
- [ ] Keys rotated; **zero `EXPO_PUBLIC_` provider keys**; Gemini + Places keys live only in Edge Function env.
- [ ] `CLAUDE.md`, `STATUS.md`, `DECISIONS.md` created (the next prompt); seed CLAUDE.md with the §5 "(c)" lessons.
- [ ] Design tokens ported (`ThemeContext` → TS); **one** card component built; brand kit ported.
- [ ] 3 tabs `Discover · Trip · Profile`; square icon; audio/contacts permissions removed.
- [ ] Dev builds running on a real iPhone **and** a real Android.
- [ ] Model IDs + Places SKU/pricing re-confirmed live at phase start (§7.7); a stub `usage_log` table exists before the first paid call.

---
*Audit complete. Read-only: only `AUDIT.md` was created. No fixes, installs, migrations, or git changes were made. Stopping here — Phase 1 and the state files are the next prompt.*
