# FKM Kompass — build specification

Bilingual reference and practice site for physics, mathematics, chemistry and materials
science. English is the source locale, Estonian is a required parallel locale. Static site,
no accounts, no backend, no AI at runtime.

Build physics fully first. The schema is subject-agnostic from day one.

---

## Stack

- Next.js App Router, TypeScript
- Tailwind
- Content as MDX + JSON in `content/`, validated with Zod at build time
- KaTeX with server-side rendering
- Fully static (SSG). Problem generation, grading and unit checking run in the browser
- Deployed to Vercel

---

## Levels

| Level | Estonian | English |
|---|---|---|
| L0 | põhikool | Lower secondary |
| L1 | gümnaasium | Upper secondary |
| L2 | alusained | University foundations |
| L3 | bakalaureus | Bachelor core |

Hard cap at L3. Do not use "high school" in English — it is US-specific.

---

## Constraints

**No AI or network calls at runtime.** All problems are generated from parametrised templates
with answers computed in the browser. All distractors are computed from a declared error
model. All conceptual test items are hand-authored.

**Both locales always ship together.** No concept may exist with only one locale filled. CI
fails the build on a missing or stale translation.

**Terminology is locked before content is written.** Estonian physics terminology is
established and not derivable from English. A glossary with a banned-variant list is built
first and enforced by a linter.

**No content nouns interpolated into UI strings.** Estonian requires case inflection on the
noun, so `"Practise {concept}"` cannot be translated. Write full strings per item, or keep UI
labels noun-free.

**Decimal comma.** The answer parser accepts both `9,81` and `9.81`; display is localised.
Unit symbols stay canonical, unit names are localised.

**Resources are curated per locale, not translated.** The Estonian and English resource sets
for the same concept are legitimately different.

---

## Content model

Language-neutral, written once: LaTeX, symbols, unit registry, numeric ranges, constraints,
prerequisite edges, error models, answer values.

Localised: titles, summaries, explanations, misconception text, item stems, option labels,
resource annotations.

Roadmap order is derived from the prerequisite DAG by topological sort, never hand-sorted.
Cycles fail the build.

---

## Out of scope for v1

Accounts, gamification, spaced repetition, free-text explanation grading, master's-level
content, mobile app, PWA, offline caching, lab uncertainty calculator.

---

## Build order note

Phase 3 (formula engine) comes before Phase 6 (design system). Get one formula generating
problems with computed distractors in an unstyled page before building any UI polish.

---

## Todo list

### Phase 0 — Foundation

- [x] Init Next.js App Router project with TypeScript, ESLint, Prettier
  `chore: scaffold next.js app router project`
- [x] Add Tailwind and configure base type scale and colour tokens
  `chore: configure tailwind with design tokens`
- [x] Set up folder structure and path aliases
  `chore: set up project structure and path aliases`
- [x] Configure `/en` and `/et` routes with per-locale slugs and hreflang
  `feat: add per locale routing and hreflang`
- [x] Add the i18n message catalogue and locale switcher
  `feat: add i18n catalogue and locale switcher`
- [x] Add locale-aware number formatting for decimal comma and thousands separator
  `feat: add locale aware number formatting`
- [x] Write UI strings with no interpolated content nouns to respect Estonian case
  `chore: keep ui strings free of interpolated nouns`
- [x] Configure KaTeX with server-side math rendering
  `feat: add katex with ssr math rendering`
- [x] Add Zod and create the schema directory
  `chore: add zod for content validation`
- [x] Add CI running typecheck, lint and build
  `ci: add typecheck lint and build workflow`
- [x] Record scope, level taxonomy and bilingual policy in `DECISIONS.md`
  `docs: record project scope decisions`

### Phase 1 — Terminology base

Complete before any content is authored.

- [x] Create `glossary.json` with EN↔ET term pairs and a source citation per entry
  `feat: add bilingual terminology glossary`
- [x] Populate mechanics and measurement terminology
  `content: add mechanics terminology to glossary`
- [x] Populate thermodynamics, waves, electromagnetism, optics and modern physics terminology
  `content: complete physics terminology glossary`
- [x] Add a banned-variant list of common wrong Estonian renderings
  `feat: add banned term variants to glossary`
- [x] Write a linter flagging Estonian content that uses a banned variant
  `test: lint estonian content against glossary`
- [x] Write a linter flagging English terms with no glossary entry
  `test: flag untranslated terms in glossary`
- [x] Wire both linters into CI
  `ci: enforce terminology linting`
- [x] Build a glossary page exposing the term base to users
  `feat: add public glossary page`

### Phase 2 — Content schema

- [x] Define the `Level` enum L0–L3
  `feat: define level taxonomy`
- [x] Define `LocalisedString` requiring both locales, with `sourceHash` and `stale` flag
  `feat: add localised string type with staleness tracking`
- [x] Define the `Concept` schema with localised text and language-neutral edges
  `feat: add concept schema`
- [x] Define the `Formula` schema: LaTeX, symbols, units, solve-for targets
  `feat: add formula schema`
- [x] Define the `Misconception` schema attached to concepts
  `feat: add misconception schema`
- [x] Define the `Resource` schema with a language field per link
  `feat: add resource schema`
- [x] Write the content loader that validates all files at build time
  `feat: add validating content loader`
- [x] Add a script computing source hashes and marking translations stale on drift
  `feat: add translation staleness detection`
- [x] Add a check that every prerequisite id resolves
  `test: validate prerequisite references resolve`
- [x] Add cycle detection on the prerequisite graph
  `test: detect cycles in prerequisite graph`
- [x] Add a check that both locales are present on every concept
  `test: require both locales on every concept`
- [x] Add a check that every concept has at least one resource per locale
  `test: require resources in both locales`
- [x] Add a check failing the build when any translation is stale
  `ci: fail build on stale translations`
- [x] Add a report listing stale translations for review
  `feat: add stale translation report`
- [x] Wire all content checks into CI
  `ci: fail build on invalid content`

### Phase 3 — Formula practice engine

- [x] Add a units library and define the unit registry
  `feat: add units library and registry`
- [x] Localise unit display names while keeping symbols canonical
  `feat: localise unit names with canonical symbols`
- [x] Define the `ProblemTemplate` schema with variable ranges and constraints
  `feat: add problem template schema`
- [x] Write the seeded RNG so a seed reproduces an identical problem
  `feat: add seeded random number generator`
- [x] Write the instantiator that samples values and rejects unphysical combinations
  `feat: add template instantiator with constraint rejection`
- [x] Round sampled values to sensible significant figures
  `feat: round generated values to sane precision`
- [x] Write the solver computing the answer for any solve-for target
  `feat: add deterministic formula solver`
- [x] Write the answer parser accepting decimal comma, decimal point and scientific notation
  `feat: add answer parser with locale support`
- [x] Add unit parsing and equivalence checking to the parser
  `feat: add unit parsing and equivalence`
- [x] Write the grader with configurable tolerance
  `feat: add numeric grader with tolerance`
- [x] Define the `ErrorModel` schema describing common mistakes per formula
  `feat: add error model schema`
- [x] Compute distractors from the error model for multiple-choice mode
  `feat: generate distractors from error model`
- [x] Deduplicate and shuffle options, guarding against collisions
  `feat: deduplicate and shuffle answer options`
- [x] Generate the worked solution from the solver's rearrangement path
  `feat: generate worked solutions from solve path`
- [x] Localise worked solution generation with per-locale connective phrases
  `feat: localise generated worked solutions`
- [x] Add difficulty tiers by rearrangement depth and unit conversion count
  `feat: add difficulty tiers to drills`
- [x] Write unit tests asserting solver correctness across every template
  `test: add solver correctness tests`
- [x] Write tests asserting distractors never equal the correct answer
  `test: assert distractors differ from correct answer`
- [x] Test the parser against Estonian and English formatted inputs
  `test: verify parser across both locales`

### Phase 4 — Concept test engine

- [x] Define the `ConceptItem` schema with localised stem and misconception-linked options
  `feat: add concept item schema`
- [x] Implement the static multiple-choice item type
  `feat: add multiple choice item type`
- [x] Implement the parametrised proportionality item type
  `feat: add proportionality item type`
- [x] Implement the "which formula applies" item type drawing from the formula index
  `feat: add formula selection item type`
- [x] Implement the ordering and matching item type
  `feat: add ordering item type`
- [x] Write the item selector that samples across chosen concepts without repeats
  `feat: add item selector`
- [x] Tag every wrong option with the misconception it represents
  `feat: tag distractors with misconceptions`

### Phase 5 — Test builder and runner

- [x] Build the test builder: pick subject, levels, concepts, item count, mode
  `feat: add test builder interface`
- [x] Add mode selection for concept only, formula only or mixed
  `feat: add test mode selection`
- [x] Add answer format selection for multiple choice or free entry
  `feat: add answer format selection`
- [x] Build the test runner with progress indicator
  `feat: add test runner`
- [x] Add immediate per-item feedback with the worked solution
  `feat: add per item feedback`
- [x] Build the results screen listing weak concepts with links back
  `feat: add test results screen`
- [x] Add misconception summary showing repeated error patterns
  `feat: add misconception summary to results`
- [x] Encode test configuration and seed in the URL for sharing and retaking
  `feat: encode test config and seed in url`

### Phase 6 — Design system and shell

- [x] Build the root layout with header, subject switcher, locale switcher and footer
  `feat: add root layout and navigation shell`
- [x] Pick and load display, body and mono typefaces
  `feat: add typography stack`
- [x] Build `LevelBadge` with a distinct colour per level
  `feat: add level badge component`
- [x] Build `Formula` rendering LaTeX with a localised symbol table
  `feat: add formula display component`
- [x] Build `ConceptCard` for roadmap and search results
  `feat: add concept card component`
- [x] Add dark mode persisted to localStorage
  `feat: add dark mode toggle`
- [x] Verify keyboard focus and reduced-motion handling across components
  `fix: ensure accessible focus and reduced motion`

### Phase 7 — Roadmap

- [x] Write the topological sort deriving study order from the prerequisite graph
  `feat: derive study order from prerequisite graph`
- [x] Build the roadmap page grouped by level then module
  `feat: add roadmap page grouped by level`
- [x] Show prerequisite relationships between concept cards
  `feat: show prerequisite links on roadmap`
- [x] Add a level filter
  `feat: add level filter to roadmap`
- [x] Add reverse prerequisite lookup showing what each concept unlocks
  `feat: show downstream concepts unlocked`
- [x] Add a "start here" entry point at the first unmet concept
  `feat: add start here entry point`
- [x] Make the roadmap responsive down to mobile
  `fix: make roadmap responsive on mobile`

### Phase 8 — Concept pages

- [x] Generate static routes for every concept in both locales
  `feat: statically generate concept pages`
- [x] Build the page layout: summary, key ideas, formulas, misconceptions, resources
  `feat: add concept page layout`
- [x] Render quick explanations from MDX
  `feat: render concept explanations from mdx`
- [x] Add prerequisite and next-step navigation
  `feat: add prerequisite navigation on concept pages`
- [x] Add a "practise this concept" launcher into the test builder
  `feat: add practise launcher on concept pages`
- [x] Add the curated resources section grouped by type and language
  `feat: add curated resources section`
- [x] Add hreflang tags and per-locale metadata
  `feat: add hreflang and localised metadata`
- [x] Add JSON-LD structured data for educational content
  `feat: add structured data for concept pages`

### Phase 9 — Formula index

- [x] Build the formula index listing every formula with concept and level
  `feat: add formula index page`
- [x] Add client-side fuzzy search across names, symbols and concepts
  `feat: add formula search`
- [x] Add subject and level filters
  `feat: add filters to formula index`
- [x] Add a copy-LaTeX button
  `feat: add copy latex button`
- [x] Add a drill launcher on each formula row
  `feat: add drill launcher from formula index`

### Phase 10 — Progress without accounts

- [x] Define versioned localStorage progress schema
  `feat: add versioned progress storage schema`
- [x] Track per-concept status: unseen, learning, confident
  `feat: track per concept status`
- [x] Allow manual status setting on concept pages
  `feat: add manual status control`
- [x] Update status automatically from test results
  `feat: derive status from practice results`
- [x] Store per-misconception hit counts for targeted review
  `feat: track misconception frequency`
- [x] Overlay progress on the roadmap
  `feat: show progress on roadmap`
- [x] Add export progress to a copyable code
  `feat: add progress export`
- [x] Add import progress with validation
  `feat: add progress import`
- [ ] Add clear progress with confirmation
  `feat: add clear progress action`
- [ ] Add a storage version migration path
  `feat: add progress storage migration`

### Phase 11 — Physics content

Author both locales in the same pass, never translating in a batch at the end.

- [ ] Author measurement and uncertainty across all levels
  `content: add measurement and uncertainty track`
- [ ] Author mechanics concepts L0 through L3
  `content: add mechanics concepts`
- [ ] Author thermodynamics and kinetic theory concepts
  `content: add thermodynamics concepts`
- [ ] Author waves and oscillations concepts
  `content: add waves and oscillations concepts`
- [ ] Author electromagnetism concepts
  `content: add electromagnetism concepts`
- [ ] Author optics concepts
  `content: add optics concepts`
- [ ] Author modern physics concepts
  `content: add modern physics concepts`
- [ ] Write problem templates for every formula
  `content: add problem templates for physics formulas`
- [ ] Write error models for every formula
  `content: add error models for physics formulas`
- [ ] Write at least three misconceptions per concept
  `content: add misconceptions for physics concepts`
- [ ] Write concept items covering every concept
  `content: add concept test items for physics`
- [ ] Curate English-language resources per concept
  `content: add english resources for physics`
- [ ] Curate Estonian-language resources separately from the English set
  `content: curate estonian language resources`
- [ ] Audit the full physics prerequisite graph for gaps
  `content: audit physics prerequisite graph`

### Phase 12 — Bilingual QA

- [ ] Review all Estonian concept text against the glossary
  `content: review estonian terminology across concepts`
- [ ] Revise Estonian misconception text that reads as calqued
  `content: revise calqued estonian misconception text`
- [ ] Fix Estonian test item stems that are grammatical only in English word order
  `content: fix estonian test item grammar`
- [ ] Cross-check level names against the Estonian education system
  `content: align level names with estonian system`
- [ ] Read every concept page in Estonian end to end
  `content: final estonian proofread pass`
- [ ] Read every concept page in English end to end
  `content: final english proofread pass`

### Phase 13 — Ship

- [ ] Build the landing page with copy written natively in both locales
  `feat: add landing page copy in both locales`
- [ ] Add global search indexing both locales independently
  `feat: index both locales in global search`
- [ ] Add a 404 page suggesting related concepts
  `feat: add helpful 404 page`
- [ ] Add a link checker for external resources in CI
  `ci: add external link checker`
- [ ] Run a Lighthouse pass and fix findings
  `perf: address lighthouse findings`
- [ ] Emit localised sitemaps with hreflang alternates
  `feat: add localised sitemaps with hreflang`
- [ ] Add cookieless analytics
  `feat: add cookieless analytics`
- [ ] Deploy to Vercel and configure the domain
  `chore: deploy to vercel`
- [ ] Write README and content contribution guide
  `docs: add readme and contribution guide`

### Phase 14 — Remaining subjects

Only after physics is shipped.

- [ ] Add mathematics using the existing schema
  `content: add mathematics subject`
- [ ] Add chemistry
  `content: add chemistry subject`
- [ ] Add materials science
  `content: add materials science subject`
