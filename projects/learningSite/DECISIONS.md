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
  grading, master's-level content, mobile app, PWA, offline caching, lab
  uncertainty calculator.

## Level taxonomy

Hard-capped at four levels — do not add a level beyond L3 without revisiting
this decision:

| Level | Estonian     | English                |
| ----- | ------------ | ----------------------- |
| L0    | põhikool     | Lower secondary         |
| L1    | gümnaasium   | Upper secondary         |
| L2    | alusained    | University foundations  |
| L3    | bakalaureus  | Bachelor core           |

Never use "high school" in English copy — it's US-specific and the site is
not US-scoped.

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
  presently `notes` and `progress`; a new synced feature adds a `kind`
  the same way, not a new endpoint.
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

## Stack choices

- Tailwind v4 (CSS-first `@theme`, no `tailwind.config.js`).
- KaTeX renders server-side via `katex.renderToString` in
  `src/components/Math.tsx` — no math library ships to the client.
- Vitest for unit tests (formula engine correctness, parser, distractors) —
  chosen over Jest for faster startup and native ESM/TS support with no
  extra config in a Next.js + Turbopack project.
