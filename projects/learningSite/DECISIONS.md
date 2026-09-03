# Decisions

Scope, taxonomy and policy decisions for FKM Kompass, recorded as they're made
so later phases don't silently re-litigate them. See `todo.md` for the full
build spec these decisions implement.

## Scope

- Static site (Next.js App Router SSG), no AI or network calls at runtime
  for content itself. Problem generation, grading and unit checking run in
  the browser against build-time-validated content. An optional account
  system (see § Accounts) is the one deliberate exception to "no backend" —
  every page still works fully signed out.
- Build order: physics fully first (Phases 0-13), then mathematics,
  chemistry and materials science reuse the same schema (Phase 14).
- Out of scope: gamification, spaced repetition, free-text explanation
  grading, mobile app, PWA, offline caching, lab uncertainty calculator.

## Level taxonomy

Five levels. L0-L3 were hard-capped while the site's scope was a bachelor's
degree; L4 was added when that scope explicitly widened to graduate-level
physics (mechanics, electromagnetism, quantum mechanics, statistical
mechanics, solid-state and particle physics brought to a complete Master's
standard) and beyond (deeper, more specialised astrophysics and nuclear
physics content past that). Don't add a level beyond L4 without the same
kind of explicit scope decision this one and the original cap recorded:

| Level | Estonian     | English                |
| ----- | ------------ | ----------------------- |
| L0    | põhikool     | Lower secondary         |
| L1    | gümnaasium   | Upper secondary         |
| L2    | alusained    | University foundations  |
| L3    | bakalaureus  | Bachelor core           |
| L4    | magistriõpe  | Master's core           |

Never use "high school" in English copy — it's US-specific and the site is
not US-scoped. Never use "graduate school" either, for the same reason —
"Master's" is the international term the Bologna-system levels above already
use.

## Bilingual policy

- English is the source locale; Estonian is a required parallel locale.
  A concept may not exist with only one locale filled in. CI fails the
  build on a missing or stale translation (`npm run validate:content`).
- Estonian physics terminology is established and not derivable from
  English by translation. The glossary (`content/terminology/`) is the
  single source of truth and is built before any content is authored
  (Phase 1). Estonian content is linted against it and against a
  banned-variant list of common wrong renderings.
- UI strings never interpolate content nouns (`"Practise {concept}"` can't
  be translated, since Estonian requires case inflection on the noun).
  Write full strings per item, or keep UI labels noun-free.
- Resources (external links) are curated per locale, not translated — the
  EN and ET resource sets for the same concept are legitimately different
  and unrelated in content.
- Decimal comma: the answer parser accepts both `9,81` and `9.81` as input
  regardless of locale; display formatting is localised
  (`src/i18n/numberFormat.ts`). Unit symbols stay canonical across locales;
  only unit *names* are localised.

## Routing

- `app/[lang]/layout.tsx` is the app's only root layout (renders
  `<html lang>`), per the Next.js 16 recommended i18n pattern — there is no
  separate top-level `app/layout.tsx`. This is what makes `next/root-params`
  usable for `lang` anywhere in the tree without prop-drilling.
- `/` has no page of its own; `src/proxy.ts` redirects any unprefixed path
  to `/en` before Next.js attempts to resolve it.
- Per-locale slugs for content routes (e.g. concept pages) are a Phase 8
  concern — the locale switcher currently swaps only the `/en`/`/et` path
  prefix and will need a slug-translation lookup once those routes exist.

## Content model

- Content lives in `content/` as MDX (prose: explanations, item stems) and
  JSON (structure: concepts, formulas, misconceptions, resources),
  validated with Zod schemas in `src/schema/` at build time.
- Roadmap order is derived from the prerequisite DAG by topological sort
  (Phase 7) — never hand-sorted. Cycles fail the build.
- `LocalisedString.sourceHash` records a hash of the English text at the
  time the Estonian translation was last synced; the staleness script
  recomputes it at build time and flags drift.

## Notes and highlights

- Learner notes live in `localStorage` under the `notes` key: versioned
  blob, Zod-validated on read, migrated forward by
  `src/lib/notes/migrations.ts`. Nothing above `src/lib/notes/store.ts`
  knows where the bytes are kept, which is what let the account system
  (see § Accounts) add server sync later by replacing the store's
  transport, not the feature.
- A note can link to a concept, a formula or a glossary term — the same
  three things global search indexes. Notes store only `{kind, id}`;
  labels are resolved per-locale at render time (`targets.ts`), so
  re-titling a concept re-labels every note pointing at it.
- Highlights anchor by **quoted text plus surrounding context**
  (a W3C-Annotation-style `TextQuoteSelector`), not by DOM path or bare
  character offset. Offsets alone silently shift onto the wrong sentence
  the moment a paragraph above is re-authored; matching on the quote means
  a highlight either finds its own words or reports itself as orphaned.
  The stored offset is kept only to break ties between identical quotes.
- Highlights are locale-scoped. The EN and ET explanations are independent
  prose, not translations of one string, so an anchor made in one locale is
  never painted in the other.
- Painting is DOM mutation over server-rendered MDX (React can't inject
  into it), so `clearHighlights` must restore the container's `innerHTML`
  byte-for-byte — that invariant is what keeps React the sole owner of
  those nodes, and it's asserted in `domRange.test.ts`.

## Reference data

- `content/reference/` holds lookup tables that belong to no single
  subject — the periodic table is the first. It is registered in
  `NON_SUBJECT_DIRS`, because anything else directly under `content/` is
  treated as a new subject and must have concepts.
- Element names use a plain `{en, et}` pair rather than `LocalisedString`.
  Element nomenclature is fixed international vocabulary with no English
  source text that can drift out from under the Estonian, which is the
  only thing `sourceHash`/`stale` exist to track.
- Element `category` is a pedagogical grouping, not an IUPAC one — IUPAC
  formally defines only a few. Elements 109-118 are `unknown` rather than
  guessed: too few atoms have been made to establish their chemistry.
- Lanthanides and actinides carry `group: null` and are placed by
  `src/lib/periodicTable/layout.ts` into their own two rows. That
  placement is unit-tested to give all 118 elements distinct cells — a
  wrong group or period would otherwise silently stack two elements in one
  grid cell, hiding one of them with no error anywhere.

## Accounts

- Accounts are additive, not required. `notes` and `progress` already lived
  in `localStorage` in a versioned, Zod-validated shape; an account only
  adds a server copy of the same blob and a merge step, so every page keeps
  working fully signed out and offline. `hasDatabase()` (`src/db/pool.ts`)
  gates every account-touching page and API route, so a deployment with no
  `DATABASE_URL` degrades to local-only instead of crashing.
- Sync is client-pulled, not server-pushed. `POST /api/sync/[kind]` merges
  the browser's copy against the stored copy inside one transaction (`select
  ... for update` then upsert), so two devices syncing at the same moment
  can't clobber each other — whichever request commits second merges
  against what the first just wrote rather than overwriting it. `kind` is
  presently `notes`, `progress`, `journal` and `testHistory`; a new synced
  feature adds a `kind` the same way, not a new endpoint.
- The session strategy is JWT, not database sessions, because Auth.js v5's
  Credentials provider cannot issue a database session — the adapter
  (`@auth/pg-adapter`) still does real work persisting users, linked OAuth
  accounts and magic-link tokens, it just isn't what backs the session
  cookie.
- `AuthProvider` passes `SessionProvider` no server-fetched `session` prop
  on purpose: calling `auth()` in the root layout would read the session on
  the server and opt every route under it out of static rendering, turning
  every prerendered concept page into a per-request render. Sign-in state
  is fetched client-side after hydration instead.
- Password sign-in always runs a bcrypt compare, even when no user row
  matches (`DUMMY_HASH` in `src/auth.ts`) — branching out early on "no such
  user" would make response latency itself leak which addresses are
  registered. Registration answers with the same shape whether or not the
  address was already taken for the same reason.
- Merge rule depends on what a record *is*, never last-write-wins on the
  whole blob: `notes` merges per-record by `updatedAt` with tombstones for
  deletes; `progress` merges by "further along wins" per concept status and
  by max for cumulative misconception counts, since summing would
  double-count sessions both devices already saw (`src/lib/sync/merge.ts`).
  Any new synced kind picks the rule that matches whether its records are
  edited, cumulative, or immutable once written.

## Study journal

- A "topic" is a concept id. The site already has exactly one
  fine-grained, id-stable unit that time, tests and progress all key on —
  `Concept.id` — so the journal reuses it rather than inventing a second
  taxonomy or supporting formula/glossary targets the way `NoteLink` does.
- Session vs. day are two different records. A `StudySession`
  (`src/lib/journal/schema.ts`) is one logged block of work on one topic;
  a `JournalDay` is at most one freeform reflection per calendar date,
  independent of how many sessions happened that day. Collapsing these
  would force a day with three topics studied into three reflections, or
  one awkwardly split three ways.
- Understanding is a 1–5 self-rating, logged per session, not a second
  status field. The existing `ConceptStatus` (`unseen`/`learning`/
  `confident`) stays the one field the rest of the app reads; a session's
  rating derives it (`>=4` → confident, else learning) with the same
  "only ever moves forward on evidence" posture `mergeProgress` already
  has. Two competing "how well do I know this" numbers would just as
  easily disagree with each other as with reality.
- Test attempts (`src/lib/testHistory/`) get their own persisted history,
  separate from journal sessions, because an attempt is an immutable fact
  about the past — recorded once when `TestRunner` finishes scoring,
  never edited — while a session is a note that can still be corrected.
  This is also what lets a self-rating be checked against reality:
  `ratingMismatch` (`src/lib/testHistory/mismatch.ts`) flags rating
  "confident" or better against a most-recent attempt under 60% as a
  plain inline notice, never a blocking one — a self-rating and one
  test's worth of questions measure different things, so this only
  speaks up when they visibly disagree, and only compares the *latest*
  attempt, never an old low score sitting behind a since-improved one.
- The journal timeline folds test attempts in as read-only entries
  alongside sessions, keyed by the date each was taken/logged — a day can
  have an attempt with no session or the other way round, so the
  timeline's dates are the union of both, never just one.
- Sync follows the account system's own rule (see § Accounts) of picking
  a merge strategy per record shape, not a default: sessions merge by
  `updatedAt` with tombstones, same as notes; days merge by `updatedAt`
  with no tombstone, since a reflection is only ever upserted, never
  deleted; test attempts are a plain union by id, since two devices can
  never disagree about an immutable fact.

## MSc physics content

- Scope and the L4 level itself are decided in § Level taxonomy above; this
  section records the decisions specific to authoring the content, kept
  live in `MSC_PHYSICS_PLAN.md` while the phase is in progress.
- `general-relativity` is a new module, split from `astrophysics` rather
  than folded into it, because GR's mathematical and physical machinery
  (tensor calculus, the field equations, the Schwarzschild solution,
  gravitational waves) is normally its own taught course, not an
  astrophysics topic. The existing `general-relativity-and-cosmological-models`
  concept stays in `astrophysics` rather than moving: its content and its
  one prerequisite (`hubbles-law-and-the-expanding-universe`) are both
  cosmology/observation-facing (the Big Bang model, inflation, dark
  energy), which is what `astrophysics` is for; `general-relativity` is
  for the theory's own machinery, not every topic GR happens to touch.
- Most L4 concepts are conceptual, not quantitative: a formula + problem
  template + error model is added only where a concept has one clean,
  well-defined numeric relationship (as the existing bachelor-level
  content mostly does); many graduate topics are derivation- and
  reasoning-heavy rather than plug-into-a-formula, and forcing a formula
  where the real content is the argument would be a worse concept, not a
  more complete one. `canonical-transformations-and-hamilton-jacobi-theory`
  (pre-existing, L3) already established this pattern; the MSc phase
  continues it rather than introducing a new rule.
- Resource curation for this phase defaults to one verified Wikipedia
  article per locale per concept (checked live with `npm run check:links`
  before every commit), not a hunt for a more specialised source per
  concept — see `QUESTIONS.md` for the tradeoff this accepts.
- The Estonian terminology this phase introduces (for vocabulary with no
  existing glossary entry) was not run through the glossary's normal
  locked-first process — see `QUESTIONS.md` for why, and flag it for a
  native-speaker/domain-expert review pass.

## Stack choices

- Tailwind v4 (CSS-first `@theme`, no `tailwind.config.js`).
- KaTeX renders server-side via `katex.renderToString` in
  `src/components/Math.tsx` — no math library ships to the client.
- Vitest for unit tests (formula engine correctness, parser, distractors) —
  chosen over Jest for faster startup and native ESM/TS support with no
  extra config in a Next.js + Turbopack project.
