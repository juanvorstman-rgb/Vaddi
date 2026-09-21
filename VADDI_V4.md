# VADDI: Project Instructions (v4)

> Direction document. It holds what is durable: the problem, the principles, the budgets, the rules, the gates. It holds no current state. State lives in the repo (`STATUS.md`, `DECISIONS.md`). If this document and the repo disagree on state, the repo wins. If they disagree on direction, this document wins.
> Supersedes v3. Audience: Juan, Claude (chat) and Claude Code.

---

## 1. The problem

Planning anything with friends on a trip is slow and unfair. The group chat fills with links. Nobody decides. One person ends up carrying the whole group. Once there, "what do we do now?" costs an hour on the pavement.

**Vaddi is a travel caddie.** It hands the group a few good plans and gets them to a decision fast.

**Promise:** from "what do we do?" to "we are doing this" in under two minutes, without one person doing all the work.

**Who it is for:** groups of 3 to 8 friends on short trips. City breaks, long weekends, festivals, stag and hen trips.
- The **organizer** is the first user and the buyer.
- The **invited friend** is the hardest user. They did not choose Vaddi. Design for them first.

**The real competitor** is WhatsApp plus Google Maps plus one tired friend. Vaddi wins only if it is easier than that.

**What Vaddi is not:** an itinerary encyclopedia, a chat app, an expense splitter, a flight or document manager, a solo app, a chatbot with a travel skin.

---

## 2. The core loop

```
Suggest → React → Decide → Book
```

1. **Suggest.** Vaddi proposes a short set of concrete plans for this place, this time, this group.
2. **React.** Friends tap yes or no. No typing needed.
3. **Decide.** The best-rated ideas rise. Anyone can lock one into the plan.
4. **Book.** If it is bookable, one tap out to the partner.

Same loop, two moments:
- **Before the trip:** build a loose plan, day by day.
- **During the trip:** "What now?" Near us, open now, fits the group.

**The feature test:** every feature must make one step of the loop faster, easier or cheaper. If it does not, it does not ship.

---

## 3. Realistic objectives

**Constraints:** solo builder. Evenings and weekends. Near-zero budget. Built with Claude Code. Plan for that, not for a funded team.

Progress is measured in gates, not features. No work on a later gate before the earlier one passes.

| Gate | What it proves | Pass criteria |
|---|---|---|
| **1. One real trip** | The loop works for real people | One real group uses Vaddi on a real trip. At least 70% of invited friends join and react. The group locks at least 3 plans in the app. |
| **2. Ten groups that are not Juan's** | It works without Juan in the room | 10 groups complete the loop with no hand-holding. UX budgets met. Cost per trip inside budget. |
| **3. First euro** | Someone pays | One booking partner live. Trip Pass live. Revenue per active trip above variable cost per active trip. |
| **4. Public launch** | Ready for strangers | Only after Gate 3. |

**North star:** locked plans per trip.
**Guardrail:** variable cost per active trip.
**Stop rule:** if a gate fails twice, stop adding features. Go back to section 1 and question the problem.

---

## 4. Scope

**v1, in:**
- Create a trip: destination and dates. Nothing else required.
- Invite by link. Join with a name only.
- Ideas feed: eat, drink, do. List and map views.
- "What now?" live mode.
- "Ask Vaddi": one free-text request inside a trip.
- Reactions, shared shortlist, lock into a loose day plan.
- Share card that looks good in WhatsApp.
- Booking link out where a partner exists.

**Later, only when a gate calls for it:** Trip Pass and paywall (Gate 3), richer notifications, curated picks, stays, eSIM.

**Never, unless section 1 changes:** expenses, receipts, flight tracking, document storage, in-app chat, formal polls, itinerary versioning, custom checkout, handling payments for bookings.

---

## 5. UX principles

1. **Value before signup.** A plan on screen before any account wall.
2. **The invited friend first.** Link, name, in. A friend can see the trip and react from the link without installing anything. The install comes after the value.
3. **One decision per screen.** One primary action. Everything else is secondary.
4. **Recommend one, show three.** Never a list of twenty. A caddie hands you the club.
5. **Tap, do not type.** Typing is optional everywhere except the trip name and "Ask Vaddi".
6. **WhatsApp is the channel, not the enemy.** Great share cards and link previews. Never build chat.
7. **Fast on bad signal.** Cached trip, optimistic reactions, skeleton loaders. Travellers have poor connectivity.
8. **Four states on every screen:** loading, empty, error, offline. Designed, not default.
9. **A screen is the last resort.** Before adding one, ask if it can be a view or an action.
10. **No dead ends.** Every empty or error state offers the next step.

**UX budgets. These are tests, not wishes:**
- First idea visible within 60 seconds of first open.
- Friend joins and reacts within 30 seconds of tapping the link.
- Create a trip with 3 inputs or fewer.
- Any core action within 2 taps of home.
- Feed renders from cache in under 1 second.

---

## 6. UI principles

- **Navigation:** 3 tabs maximum. `Discover | Trip | Profile`. Discover gives plans. Trip organizes them with friends. "Ask Vaddi" and the map are features inside those, not tabs.
- **The card is the unit.** One card component, used everywhere: photo, name, one-line "why this", distance or time, price band, group reactions, one primary action.
- **Design tokens.** One theme file for color, type, spacing, radius. No hardcoded values in screens. Light and dark from day one.
- **Type and space:** Inter, 400 / 500 / 600 / 700. Five sizes at most. 4 / 8 spacing grid. Touch targets 44pt or larger.
- **Motion and haptics:** small and purposeful. Haptic on react and on lock. Nothing decorative that costs frames.
- **Accessibility:** AA contrast. Respects system font scaling.
- **Brand:** Logo J2 Compass V, coral left, teal right, navy background. Coral `#FF6B6B`, Teal `#2DD4BF`, Navy `#1E293B`, Orange `#E67A2D`, Blue `#3489C9`.
- **Voice:** confident caddie. Specific numbers. One recommendation. Two sentences at most. "I found a spot 5 min away. Reserve?"

---

## 7. AI and cost discipline

**Principle: code first, cache second, model last.**

Know where the money goes. A places search with ratings and opening hours costs far more than a cheap model call. Tokens matter. The places bill matters more. The cache is the main cost lever.

**Rules:**
1. **Every paid API call runs server-side.** Model and places calls go through backend functions. No provider key ever ships in the app.
2. **Ranking is code, not AI.** Distance, open now, rating, price and group preferences are filtered and sorted in code.
3. **The model does three jobs only:** turn free text into a structured query, write the one-line "why this", compose a day from a candidate set. Anything else needs a written reason.
4. **No paid call without a user action.** Never on app open, scroll, or a timer.
5. **Cache what the provider lets you cache, and nothing else.** With Google Places that is place IDs (indefinitely) and coordinates (30 days), keyed by area cell and category and shared across groups. Display fields (name, rating, hours, photos, price) are fetched fresh per session and never stored. The cost lever is fewer and smaller calls per session, not a shared cache of results: one search per "suggest", photos only for the cards shown, details only when a card is opened, and a cap on free suggests per trip.
6. **Strict field masks.** Request only the fields the card shows. One extra field can reprice the whole call. Place details load only when a user opens a card. Photos load lazily, one per card.
7. **Cheapest model that passes the quality bar.** Escalate to a bigger model only on failure. Model IDs and prices live in one server config. Check the provider's current model list and deprecations at the start of every phase.
8. **Small prompts, small outputs.** Send place IDs and five fields, not raw payloads. Structured JSON out. Default budget per call: 1,500 tokens in, 300 out. Thinking modes off unless a task proves it needs them.
9. **Log every paid call:** feature, trip, model or SKU, tokens, estimated cost, cache hit or miss.
10. **Quotas and a kill switch.** Per-user and per-trip daily limits, enforced server-side. A global daily spend cap that degrades to cached results instead of failing.

**Budgets. Starting targets, recalibrate with real data:**
- Variable cost per active trip: target under €0.30. Alarm at €0.50.
- Cache hit rate on ideas: above 60% once there is repeat traffic in a city.
- Total monthly spend before Gate 3: under €30, store fees aside. Stay inside free tiers as long as possible.

**Every proposal for a new AI or places call must state:** expected calls per trip, cost per call, cache strategy, and what happens when the quota is hit.

---

## 8. Business plan

**Who pays and why:** the organizer pays to make the group decide faster. One person pays. The whole group benefits.

**Revenue lines, in order:**
1. **Trip Pass.** One-time purchase per trip. Unlocks the whole group. Travel is episodic. A monthly subscription for something used three times a year churns. A per-trip pass matches how people actually travel.
2. **Booking links.** Affiliate link out with tracking parameters. No custom checkout. Partner order follows the loop: activities first, restaurants second, extras like eSIM and stays last. Rates and terms are verified when applying, never assumed in a plan.
3. **Annual pass.** For frequent travellers. Only if Trip Pass data shows repeat buyers.

**Pricing principles:**
- Never paywall the invite. A normal group of up to 8 fits in Free. The group is the moat and the distribution.
- Charge for what costs money and for scale: volume of AI requests, "What now?" usage, number of active trips, very large groups, curated picks.
- Free must stay cheap to serve. That is what section 7 is for.

**Unit economics, the only formula that matters:**
```
revenue per active trip = (pass conversion × net pass price) + (booking rate × average commission)
revenue per active trip  >  variable cost per active trip
```
Starting hypotheses, to be tested at Gate 3 and not treated as facts: pass price around €4.99, pass conversion around 5% of active trips, a booking on around 10% of active trips.

**Growth:** each trip invites 3 to 7 new people. The share card and the link join are the marketing. No paid acquisition before Gate 3.

**Not doing:** ads, selling data, B2B pivots, investor decks, revenue projections beyond the next gate.

---

## 9. Tech direction

- **One codebase:** React Native, Expo, Expo Router. TypeScript, strict.
- **Platforms:** iOS and Android together. A group is never all on one platform. Plus a minimal web page for the invite link: see the trip, react, see the plan. No map on web in v1.
- **Backend:** Supabase. Postgres, Auth with anonymous sign-in that upgrades to a full account, RLS on every table, Edge Functions for every paid call, Realtime for reactions.
- **AI:** Gemini API through one backend function. Provider stays swappable.
- **Places:** Google Places API (New) by default. Evaluate cheaper sources during the audit if field coverage allows.
- **Purchases:** RevenueCat.
- **Analytics:** one tool, free tier. Only the events that measure the loop, the UX budgets and the gates.
- **Data model:** small. Around 8 tables: profiles, trips, trip members, places cache, ideas, reactions, booking clicks, usage log. Every new table needs a reason.
- **Identifiers and environment** (Supabase, EAS, bundle IDs, keys) live in repo config, never in this document.

---

## 10. Working rules for Claude Code

1. **Read first.** This document, then `STATUS.md`, then `DECISIONS.md`. Before any work.
2. **Plan before code.** For anything beyond a small fix, write the plan and wait for approval.
3. **One phase, one feature at a time.** Small commits. The app runs after every one.
4. **Ask before adding** a dependency, a table, a screen, a paid service or a paid call.
5. **Verdicts, not menus.** Juan is an operator who ships, not a full-time engineer. Explain trade-offs in plain language, recommend one option, say why.
6. **Push back.** If a request breaks this document, say so before building. If scope creeps, name it.
7. **Keep the state files current.** End every session by updating `STATUS.md`: done, next, open questions. Log every real decision in `DECISIONS.md` with date and reason.
8. **No speculative abstractions.** Build for the current gate.
9. **Security basics always:** secrets in environment, never committed. RLS tested, not assumed.
10. **Test what breaks silently:** ranking, quotas, cost guards, RLS. Skip test noise.

**Code conventions:**
- `expo-clipboard`, never `Clipboard` from react-native
- Top-level imports, never `require()` inside functions
- Theme through one `useTheme()` hook
- One Supabase client module
- Navigation through expo-router
- Safe areas through `useSafeAreaInsets()`
- Bump `buildNumber` and `versionCode` before every store build

---

## 11. Build sequence

- **Phase 0. Audit and reset.** Inventory the existing repo, backend and accounts. Write a salvage versus rebuild report. Choose fresh repo or clean branch. Create `CLAUDE.md`, `STATUS.md`, `DECISIONS.md`. Confirm library versions, current model list and current provider pricing.
- **Phase 1. Skeleton.** Navigation, theme tokens, the card component, anonymous auth, builds running on a real iPhone and a real Android.
- **Phase 2. The loop with fake data.** Create trip, invite link, join with name, web page for the link, react, lock. Hardcoded ideas. Prove the UX before paying for a single API call.
- **Phase 3. Real ideas.** Places, ranking in code, cache, the model's three jobs. Usage log, quotas and kill switch ship in this phase, not after.
- **Phase 4. Live and polish.** "What now?", map view, share cards, offline behaviour. **Then Gate 1.**
- **Phase 5. Beta.** Analytics for the gates, onboarding, TestFlight and Play internal testing. **Then Gate 2.**
- **Phase 6. Money.** One booking partner. Trip Pass through RevenueCat. **Then Gate 3.**
- **Phase 7. Launch.**

---

## 12. Definition of done

A feature is done when:
- It serves a named step of the loop.
- It runs on a real iPhone and a real Android.
- All four states exist.
- It meets the UX budgets it touches.
- No key in the client. RLS covers its data.
- Its paid calls are logged, cached and inside budget.
- `STATUS.md` is updated.

---

*One loop. One gate at a time. If it is not easier than the group chat, it is not done.*
