# VADDI: Project Instructions (v5)

> Direction document. It holds what is durable: the problem, the principles, the budgets, the rules, the gates. It holds no current state. State lives in the repo (`STATUS.md`, `DECISIONS.md`). If this document and the repo disagree on state, the repo wins. If they disagree on direction, this document wins.
> v5, 12 October 2026. Supersedes v4. Based on the market analysis in `STRATEGY_2026-10-12.md` (Project docs). Audience: Juan, Claude (chat) and Claude Code.

---

## 1. The problem

When a group of friends does something together, one person ends up organizing it: a despedida, a weekend away, a birthday trip. That person collects fourteen suggestions and zero consensus, chases money over Bizum, absorbs the cost when someone drops out, and reads forty unread messages to find the one that mattered. The alternative is paying an agency a 20 to 30 percent margin to do the same work.

**Vaddi is the organizer's caddie.** It proposes a few good plans, gets the group to a decision fast, keeps the record of who is in, who has paid and what is booked, and sends the group to the provider to book. The guests only tap.

**Promise:** the organizer does a tenth of the work, the group decides in two minutes, and nobody pays an agency margin for it.

**Who it is for:**
- The **organizer** is the first user and the buyer. Thirty-something, organizing for friends, with social pressure to get it right.
- The **invited friend** is the hardest user. They did not choose Vaddi. They get a link, a name field and three cards. Design for them first.

**Launch market: despedidas de soltero y soltera in Spain.** About 270,000 a year, 42% of them trips, 8 to 15 people, 130 € per person in activities alone, organized two to five months ahead for a March to September season. No app serves them; agencies are fragmented and already pay for leads. The guests of this despedida are the organizers of the next one. After despedidas, the same engine serves any group trip or celebration with an organizer.

**The real competitor** is the WhatsApp group plus Google Maps plus an Excel plus Bizum plus one tired friend, and for despedidas the local agency's markup. Vaddi wins only if it is easier than the first and cheaper than the second.

**What Vaddi is not:** a travel agency (it never takes the group's money and never books on anyone's behalf), an itinerary encyclopedia, a chat app, an expense splitter, a flight or document manager, a solo app, a chatbot with a travel skin.

---

## 2. The core loop and the record

```
Suggest → React → Decide → Book
```

1. **Suggest.** Vaddi proposes a short set of concrete plans for this place, this time, this group.
2. **React.** Friends tap yes or no. No typing needed.
3. **Decide.** The best-rated ideas rise. The organizer, or anyone, locks one into the plan.
4. **Book.** If it is bookable, one tap out to the provider. Each person pays the provider directly.

The loop produces **the record**: what we decided, who is in, who has paid their share, what is booked. The record is persistent, visible from a link, and is the thing no chat and no big platform keeps. The loop is the engine; the record is the product.

Same loop, two moments:
- **Before:** build a loose plan, day by day.
- **During:** "What now?" Near us, open now, fits the group.

**The feature test:** every feature must make one step of the loop faster, easier or cheaper, or make the record more complete. If it does not, it does not ship.

---

## 3. Realistic objectives

**Constraints:** solo builder. Evenings and weekends. Near-zero budget. Built with Claude Code. One season a year that matters (March to September; organizers search from January). Plan for that, not for a funded team.

Progress is measured in gates, not features. No work on a later gate before the earlier one passes.

| Gate | What it proves | Pass criteria |
|---|---|---|
| **1. One real event** | The loop and the record work for real people | One real despedida or group trip organized through Vaddi. At least 70% of invitees open the link and react. At least 3 plans locked. At least 1 booking through a partner link. The organizer says it saved them work. |
| **2. Ten events that are not Juan's** | It works without Juan in the room | 10 events complete the loop with no hand-holding, at least 5 of them despedidas. UX budgets met. Cost per event inside budget. At least 30% of events with a booking through a link. |
| **3. First euro** | Someone pays | First tracked commission. First organizer pass sold. Revenue per active event above variable cost per active event. |
| **4. Public launch** | Ready for strangers | Only after Gate 3. |

**North star:** locked plans per event.
**Business metric:** tracked bookings per event.
**Guardrail:** variable cost per active event.
**Stop rule:** if a gate fails twice, stop adding features. Go back to section 1 and question the problem.

---

## 4. Scope

**v1, in:**
- Create an event: type (despedida, trip, celebration), destination, dates. Nothing else required.
- Invite by link. Join with a name only, from the link, without installing anything.
- Ideas feed: eat, drink, do. Stays as organizer-added items with a link and a price, not as suggestions.
- Reactions, shared shortlist, lock into a loose day plan.
- The record: who is in, out or undecided; who has paid their share; what is booked. Status only. The organizer marks paid and adds the pay link (Bizum or whatever they use). Dropouts recompute the share per person. Vaddi never holds money.
- Booking link out where a partner exists, with tracking parameters.
- Share card and link preview that look good in WhatsApp. The caddie writes the messages the organizer pastes into the group: the invite, the reminder, the "we are going here".
- "Ask Vaddi": one free-text request inside an event.
- "What now?" live mode.

**Later, only when a gate calls for it:** organizer pass features (Gate 3), the memory page after the event with "use this plan for my group", curated picks per city, stays as suggestions, richer notifications, annual pass, templates for other event types, eSIM.

**Never, unless section 1 changes:** taking the group's money, booking on anyone's behalf, custom checkout, expense splitting between members (who owes whom), receipts, flight tracking, document storage, in-app chat, formal polls, itinerary versioning.

---

## 5. UX principles

1. **Value before signup.** A plan on screen before any account wall.
2. **The invited friend first.** Link, name, in. A friend sees the event, reacts and sees the plan from the link without installing anything. The install is offered after the value, never before.
3. **The organizer's glance.** One screen answers who is in, what is decided and what is unpaid, in that order, without scrolling.
4. **One decision per screen.** One primary action. Everything else is secondary.
5. **Recommend one, show three.** Never a list of twenty. A caddie hands you the club.
6. **Tap, do not type.** Typing is optional everywhere except the event name, the guest's name and "Ask Vaddi".
7. **WhatsApp is the channel, not the enemy.** Vaddi writes, the organizer pastes. Never build chat, never build a bot.
8. **Fast on bad signal.** Cached event, optimistic reactions, skeleton loaders.
9. **Four states on every screen:** loading, empty, error, offline. Designed, not default.
10. **A screen is the last resort.** Before adding one, ask if it can be a view or an action.
11. **No dead ends.** Every empty or error state offers the next step.

**UX budgets. These are tests, not wishes:**
- First idea visible within 60 seconds of first open.
- Friend joins and reacts within 30 seconds of tapping the link, with no install.
- Create an event with 3 inputs or fewer.
- Organizer sees who has not paid within 1 tap of home.
- Any core action within 2 taps of home.
- Feed renders from cache in under 1 second.

---

## 6. UI principles

- **Navigation:** 3 tabs maximum. `Discover | Event | Profile`. Discover gives plans. Event holds the record and the group. "Ask Vaddi", the map and the money view are features inside those, not tabs. Spanish labels are decided in the build, not here.
- **The card is the unit.** One card component, used everywhere: photo, name, one-line "why this", distance or time, price band, group reactions, one primary action.
- **Design tokens.** One theme file for color, type, spacing, radius. No hardcoded values in screens. Light and dark from day one.
- **Type and space:** Inter, 400 / 500 / 600 / 700. Five sizes at most. 4 / 8 spacing grid. Touch targets 44pt or larger.
- **Motion and haptics:** small and purposeful. Haptic on react and on lock. Nothing decorative that costs frames.
- **Accessibility:** AA contrast. Respects system font scaling.
- **Brand:** Logo J2 Compass V, coral left, teal right, navy background. Coral `#FF6B6B`, Teal `#2DD4BF`, Navy `#1E293B`, Orange `#E67A2D`, Blue `#3489C9`.
- **Voice:** confident caddie. Specific numbers. One recommendation. Two sentences at most. "I found a spot 5 min away. Reserve?" "3 still owe their share. Send the reminder?"

---

## 7. AI and cost discipline

**Principle: code first, cache second, model last.**

Know where the money goes. A places search with ratings and opening hours costs far more than a cheap model call. Tokens matter. The places bill matters more. The number and size of calls per session is the main cost lever.

**Rules:**
1. **Every paid API call runs server-side.** Model and places calls go through backend functions. No provider key ever ships in the app or the web page.
2. **Ranking is code, not AI.** Distance, open now, rating, price and group preferences are filtered and sorted in code.
3. **The model does three jobs only:** turn free text into a structured query, write the one-line "why this", compose a day from a candidate set. Writing the WhatsApp messages is templates first; the model only if a test shows templates read badly.
4. **No paid call without a user action.** Never on app open, scroll, or a timer.
5. **Cache what the provider lets you cache, and nothing else.** With Google Places that is place IDs (indefinitely) and coordinates (30 days), keyed by area cell and category and shared across groups. Display fields (name, rating, hours, photos, price) are fetched fresh per session and never stored. The cost lever is fewer and smaller calls per session, not a shared cache of results: one search per "suggest", photos only for the cards shown, details only when a card is opened, and a cap on free suggests per event.
6. **Strict field masks.** Request only the fields the card shows. One extra field can reprice the whole call. Place details load only when a user opens a card. Photos load lazily, one per card.
7. **Cheapest model that passes the quality bar.** Escalate to a bigger model only on failure. Model IDs and prices live in one server config. Check the provider's current model list and deprecations at the start of every phase.
8. **Small prompts, small outputs.** Send place IDs and five fields, not raw payloads. Structured JSON out. Default budget per call: 1,500 tokens in, 300 out. Thinking modes off unless a task proves it needs them.
9. **Log every paid call and every booking click:** feature, event, model or SKU, tokens, estimated cost, cache hit or miss; partner, idea, user, timestamp.
10. **Quotas and a kill switch.** Per-user and per-event daily limits, enforced server-side. A global daily spend cap that degrades to cached results instead of failing.

**Budgets. Starting targets, recalibrate with real data:**
- Variable cost per active event: target under €0.30. Alarm at €0.50.
- Suggests per active event: measured from Phase 3; the free cap per event is set from this number, not guessed.
- Total monthly spend before Gate 3: under €30, store fees aside. Stay inside free tiers as long as possible.

**Every proposal for a new AI or places call must state:** expected calls per event, cost per call, cache strategy, and what happens when the quota is hit.

---

## 8. Business plan

**Who pays and why.** The providers pay first: Vaddi brings them a group that has already decided. The organizer pays second: for the part of the work that is theirs alone, the money and the chasing. The guests never pay.

**Revenue lines, in order:**
1. **Booking commissions.** Affiliate link out with tracking. Activities first (Yumping, Civitatis, GetYourGuide, Fever, local agencies as suppliers), stays second (Booking affiliate), extras last. Each person pays the provider. Rates and terms are verified when applying, never assumed in a plan.
2. **Organizer pass, per event.** 5.99 €; test between 4.99 and 7.99; ceiling 9.99. Unlocks who-has-paid tracking, dropout recomputation, pay links, the group briefing and the reminder messages. Bought when the event gets real, not at signup.
3. **Annual organizer pass.** Only if pass data shows repeat buyers.

The Trip Pass for deciding faster is retired as a hypothesis: no product has ever made people pay for the group decision itself.

**Pricing principles:**
- Never paywall the invite, the join or the decision. The group is the moat and the distribution.
- Charge the organizer for what removes their work and their risk. Charge the provider for the group Vaddi brings.
- Free must stay cheap to serve. That is what section 7 is for.

**Unit economics, the only formula that matters:**
```
revenue per active event = (booking rate × average basket × commission) + (pass conversion × net pass price)
revenue per active event  >  variable cost per active event
```
Starting hypotheses, to be tested at Gate 3 and not treated as facts: basket 1,000 €, commission 10%, booking rate 30% of events, pass 5.99 €, pass conversion 20% of organizers who reach the money step. Budget downloads-to-paid at 2%, the travel category median, not 5%.

**Growth:** each event brings 8 to 15 people to the link. The guests of this event are the organizers of the next; the memory page after the event, with "use this plan for my group", is the referral artifact. Organizers search Google from January for a March to September season: content and generated pages per city and activity are the top of the funnel. Providers who already pay for leads are partners, not competitors. No paid acquisition before Gate 3.

**The legal line.** Vaddi never collects payments for travel services and never contracts them on the group's behalf, so it is neither organizer nor retailer under package travel law and needs no agency licence or insolvency guarantee. Crossing that line is a Gate 4 decision taken with legal advice, never a feature.

**Not doing:** ads, selling data, B2B pivots, an agency licence, holding money, investor decks, revenue projections beyond the next gate.

---

## 9. Tech direction

- **One codebase:** React Native, Expo, Expo Router. TypeScript, strict. The organizer app for iOS and Android and the guest web page come from the same code.
- **The guest web page** at `vaddi.app/e/{code}`: see the event, join with a name, react, see the plan and the record, set your own status. Mobile-first, works inside WhatsApp's browser, no map in v1. Serves the link preview and the universal-link files so the app opens when installed. Free hosting with a custom domain and commercial use allowed.
- **Backend:** Supabase. Postgres, Auth with anonymous sign-in that upgrades to a full account, RLS on every table, Edge Functions for every paid call, Realtime for reactions and the record.
- **AI:** Gemini API through one backend function. Provider stays swappable.
- **Places:** Google Places API (New) for live suggestions. Partner inventory per city through affiliate links.
- **Purchases:** RevenueCat for the pass in the app; Stripe on the web if the organizer buys there. Decided at Phase 6.
- **Analytics:** one tool, free tier. Only the events that measure the loop, the record, the UX budgets and the gates.
- **Data model:** small. Around 9 tables: profiles, events, members (with in/out status and paid flag), places cache, ideas, reactions, booking clicks, usage log, shares. Every new table needs a reason.
- **Identifiers and environment** (Supabase, EAS, bundle IDs, keys) live in repo config, never in this document.

---

## 10. Working rules for Claude Code

1. **Read first.** This document, then `STATUS.md`, then `DECISIONS.md`. Before any work.
2. **Plan before code.** For anything beyond a small fix, write the plan and wait for approval, unless the prompt says it is the approved plan.
3. **One phase, one feature at a time.** Small commits. The app runs after every one.
4. **Ask before adding** a dependency, a table, a screen, a paid service or a paid call.
5. **Verdicts, not menus.** Juan is an operator who ships, not a full-time engineer. Explain trade-offs in plain language, recommend one option, say why.
6. **Push back.** If a request breaks this document, say so before building. If scope creeps, name it. Anything that collects money or books on behalf of users is refused and logged.
7. **Keep the state files current.** End every session by updating `STATUS.md`: done, next, open questions. Log every real decision in `DECISIONS.md` with date and reason.
8. **No speculative abstractions.** Build for the current gate.
9. **Security basics always:** secrets in environment, never committed. RLS tested, not assumed.
10. **Secrets never travel.** A secret never appears in a command string, a log line, a commit or the repo. GitHub goes through gh's credential store, EAS through its own session, Supabase through the MCP. A token that has been printed anywhere is treated as leaked and rotated.
11. **Test what breaks silently:** ranking, quotas, cost guards, RLS, the paid flag. Skip test noise.

**Code conventions:**
- `expo-clipboard`, never `Clipboard` from react-native
- Top-level imports, never `require()` inside functions
- Theme through one `useTheme()` hook
- One Supabase client module
- Navigation through expo-router
- Safe areas through `useSafeAreaInsets()`
- Shares carry `https://vaddi.app/...` links only; the custom scheme never goes in a message
- Bump `buildNumber` and `versionCode` before every store build

---

## 11. Build sequence

- **Phase 0. Audit and reset.** Inventory the existing repo, backend and accounts. Salvage versus rebuild. Fresh repo. `CLAUDE.md`, `STATUS.md`, `DECISIONS.md`.
- **Phase 1. Skeleton.** Navigation, theme tokens, the card component, anonymous auth, builds running on a real iPhone and a real Android.
- **Phase 2. The loop and the record with fixed ideas.** Create event, invite link, guest web page (join with name, react, see the plan), react, lock, who is in and who has paid, the caddie's WhatsApp messages from templates. Hardcoded ideas for two despedida cities. Prove the UX before paying for a single API call.
- **Phase 3. Real ideas.** Places, ranking in code, cache within the provider's terms, the model's three jobs, partner inventory per city with tracked links. Usage log, quotas and kill switch ship in this phase, not after.
- **Phase 4. Live, share and memory.** "What now?", share cards and link previews, the memory page with "use this plan", offline behaviour. **Then Gate 1.**
- **Phase 5. Season beta.** Analytics for the gates, onboarding, generated pages per city, TestFlight and Play internal testing, three to five events run by Juan as the caddie. **Then Gate 2.**
- **Phase 6. Money.** Affiliate agreements live with tracking. Organizer pass. **Then Gate 3.**
- **Phase 7. Launch.**

---

## 12. Definition of done

A feature is done when:
- It serves a named step of the loop or makes the record more complete.
- It runs on a real iPhone, a real Android, and, for guest features, in WhatsApp's browser.
- All four states exist.
- It meets the UX budgets it touches.
- No key in the client. RLS covers its data. Vaddi holds no money.
- Its paid calls and booking clicks are logged, cached and inside budget.
- `STATUS.md` is updated.

---

*One loop, one record, one gate at a time. If it is not easier than the group chat and cheaper than the agency, it is not done.*
