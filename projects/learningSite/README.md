# FKM Kompass

A bilingual (English / Estonian) reference and practice site for physics,
mathematics, chemistry and materials science — built subject by subject,
physics first. Static, no accounts, no backend, no AI at runtime: problem
generation, grading and unit checking all run in the learner's browser
against content that's fully validated at build time.

See [`todo.md`](./todo.md) for the full build specification and phase-by-phase
status, and [`DECISIONS.md`](./DECISIONS.md) for scope, taxonomy and policy
decisions recorded as they were made.

## Stack

- Next.js App Router, TypeScript, Tailwind v4
- Content as MDX + JSON in `content/`, validated with [Zod](https://zod.dev)
  schemas in `src/schema/` at build time
- [KaTeX](https://katex.org) for math, rendered server-side — no math library
  ships to the client
- [Vitest](https://vitest.dev) for unit tests (formula engine, parser,
  distractors)
- Deployed on [Vercel](https://vercel.com)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root path redirects
to `/en`; swap the locale segment for `/et` to browse the Estonian site.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build (also runs content validation as part of the build) |
| `npm test` | Run the Vitest unit test suite |
| `npm run lint` | ESLint |
| `npm run validate:content` | Validate every content JSON file against its Zod schema; checks prerequisite references, cycles, bilingual completeness, per-concept coverage (misconceptions, items, resources, formula backing) and staleness |
| `npm run content:coverage` | Per-concept completeness table — what's authored and what's still missing (`-- --incomplete` for gaps only) |
| `npm run content:new-concept` | Scaffold every file a new concept needs, both locales, in one go |
| `npm run lint:terminology` | Lint Estonian content against the glossary's banned-variant list, and flag formula symbol names with no glossary entry |
| `npm run content:hash` | Recompute `sourceHash` on every `LocalisedString` and flag any English text that changed since its Estonian translation was last synced |
| `npm run content:stale-report` | List every currently-stale translation without changing anything |
| `npm run check:links` | HEAD/GET every curated external resource URL and report any that no longer resolve |

CI (`.github/workflows/learningsite-ci.yml`, repo root) runs typecheck, lint,
terminology lint, content validation, unit tests and a full build on every
push and pull request that touches this project.

## Contributing content

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for how to add or edit concepts,
formulas, misconceptions, test items and resources — including the bilingual
policy that both locales must ship together, and the terminology rules that
keep Estonian physics vocabulary consistent across the site.
