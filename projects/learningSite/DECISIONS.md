# Decisions

Scope, taxonomy and policy decisions for FKM Kompass, recorded as they're made
so later phases don't silently re-litigate them. See `todo.md` for the full
build spec these decisions implement.

## Scope

- Static site (Next.js App Router SSG), no accounts, no backend, no AI or
  network calls at runtime. Problem generation, grading and unit checking
  run in the browser against build-time-validated content.
- Build order: physics fully first (Phases 0-13), then mathematics,
  chemistry and materials science reuse the same schema (Phase 14).
- Out of scope for v1: accounts, gamification, spaced repetition, free-text
  explanation grading, master's-level content, mobile app, PWA, offline
  caching, lab uncertainty calculator.

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

## Stack choices

- Tailwind v4 (CSS-first `@theme`, no `tailwind.config.js`).
- KaTeX renders server-side via `katex.renderToString` in
  `src/components/Math.tsx` — no math library ships to the client.
- Vitest for unit tests (formula engine correctness, parser, distractors) —
  chosen over Jest for faster startup and native ESM/TS support with no
  extra config in a Next.js + Turbopack project.
