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

## Execution order

Phase numbers are stable identifiers, not a reading order. Physics is finished before any
other subject starts, so the actual order of remaining work is:

```
Phase 11b  →  Phases 15–23  →  Phase 24  →  Phases 25–34
(finish the    (physics to      (enforce &    (cover the whole UT degree:
 29 partial     bachelor         final QA)     maths, chemistry, materials
 concepts)      completeness)                  science, computing)
```

Phase 11b is done. Phases 25–34 are scoped against the real University of Tartu
curriculum, parsed into `content/curriculum/` — `npm run curriculum:coverage`
is the live answer to "how much of each degree can be learned here". Phase 14
is superseded by Phases 27–29 and kept only for the record.

## How to resume this on another machine

```bash
git clone <repo> && cd projects/learningSite
npm install
npm run content:coverage -- --incomplete   # exactly what is left to author
npm run validate:content                   # errors block; waived gaps print as warnings
```

Two commands are the source of truth for what remains, and this file is only the plan:

- `npm run content:coverage -- --incomplete` — every concept missing misconceptions,
  items, resources or explanations. Currently empty: all 79 physics concepts are complete.
- `npm run curriculum:coverage -- --gaps` — every *course* in the UT degree that no
  content covers yet. This is the bigger number and the one that matters for
  "could someone get the degree's knowledge here".

**Every new concept starts with the scaffold**, which writes all seven file types at once
so none can be forgotten:

```bash
npm run content:new-concept -- --id <concept-id> --module <module> --level L0|L1|L2|L3 \
  --prerequisites <comma,separated,ids>
```

Then replace every `TODO(en)` / `TODO(et)` placeholder, delete the `-todo` resource stubs
after curating real verified URLs, and add a formula + problem template + error model if
the concept is quantitative. See `CONTRIBUTING.md` for the full rules.

**Commit conventions:** one line, no body, no trailer or signature of any kind. Commit after
each concept or each small group of concepts — not in one large batch at the end.

**Gate before every push:**

```bash
npm run typecheck && npm run lint && npm run lint:terminology \
  && npm run validate:content && npm test -- --run && npm run build
```

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
- [x] Add clear progress with confirmation
  `feat: add clear progress action`
- [x] Add a storage version migration path
  `feat: add progress storage migration`

### Phase 11 — Physics content

Author both locales in the same pass, never translating in a batch at the end.

- [x] Author measurement and uncertainty across all levels
  `content: add measurement and uncertainty track`
- [x] Author mechanics concepts L0 through L3
  `content: add mechanics concepts`
- [x] Author thermodynamics and kinetic theory concepts
  `content: add thermodynamics concepts`
- [x] Author waves and oscillations concepts
  `content: add waves and oscillations concepts`
- [x] Author electromagnetism concepts
  `content: add electromagnetism concepts`
- [x] Author optics concepts
  `content: add optics concepts`
- [x] Author modern physics concepts
  `content: add modern physics concepts`
- [x] Write problem templates for every formula
  `content: add problem templates for physics formulas`
- [x] Write error models for every formula
  `content: add error models for physics formulas`
- [x] Write at least three misconceptions per concept
  `content: add misconceptions for physics concepts`
- [x] Write concept items covering every concept
  `content: add concept test items for physics`
- [x] Curate English-language resources per concept
  `content: add english resources for physics`
- [x] Curate Estonian-language resources separately from the English set
  `content: curate estonian language resources`
- [x] Audit the full physics prerequisite graph for gaps
  `content: audit physics prerequisite graph`

### Phase 11b — Bachelor-core physics depth

Phase 11 shipped L0–L2 solidly but only a thin L3 veneer — not genuine
bachelor-core coverage. This phase adds the missing subject areas at L2/L3,
same rigor as Phase 11: both locales authored together, formulas with
templates and error models where the concept is quantitative, three
misconceptions per concept, concept items, curated EN/ET resources.
Terminology for these modules is already locked in `glossary.json`.

**Status: all 29 concepts are complete.** `COVERAGE_WAIVERS` is now empty and
coverage enforcement is unconditional — every concept in the repo has three
misconceptions, two concept items, EN/ET resources and both explanations.
What remains in this phase is formulas for the still-qualitative concepts and
richer Estonian resources; neither blocks the build.

Per concept, "done" means: 3 misconceptions, ≥1 concept item whose wrong
options each name a misconception, `explanations/{id}-en.mdx` and
`explanations/{id}-et.mdx`, and its entry removed from `COVERAGE_WAIVERS`.

- [x] Author special relativity (postulates, time dilation, length
      contraction, relativistic momentum and energy)
  `content: add special relativity concepts`
- [x] Author analytical and rotational mechanics (torque and angular
      momentum, moment of inertia and rotational dynamics, rotational
      kinetic energy, Lagrangian mechanics, coupled/driven oscillators)
  `content: add analytical and rotational mechanics concepts`
- [x] Author quantum mechanics (wavefunctions and probability, uncertainty
      principle, particle in a box, quantum tunneling, the hydrogen atom,
      spin and angular momentum)
  `content: add quantum mechanics concepts`
- [x] Author statistical mechanics (Maxwell-Boltzmann distribution,
      statistical entropy, free energy, the Carnot cycle and heat engines)
  `content: add statistical mechanics concepts`
- [x] Author upper electromagnetism (Maxwell's equations, Kirchhoff's laws,
      RC transients, AC circuits and impedance)
  `content: add upper electromagnetism concepts`
- [x] Author fluid mechanics (hydrostatic pressure, buoyancy, Pascal's
      principle, continuity, Bernoulli's equation, viscosity)
  `content: add fluid mechanics concepts`
- [x] Curate EN and ET resources for all 29 concepts
  `content: add en and et resources for bachelor-core physics concepts`
- [x] Make a half-authored concept fail validation instead of deploy
  `feat: enforce per concept content coverage`

Remaining, one commit per module:

- [x] Misconceptions, items and explanations — special relativity
      (postulates-of-special-relativity, time-dilation, length-contraction,
      relativistic-momentum-and-energy)
  `content: complete special relativity concepts`
- [x] Misconceptions, items and explanations — rotational mechanics
      (torque-and-angular-momentum,
      moment-of-inertia-and-rotational-dynamics, rotational-kinetic-energy)
  `content: complete rotational mechanics concepts`
- [x] Misconceptions, items and explanations — analytical mechanics
      (lagrangian-mechanics, coupled-and-driven-oscillators)
  `content: complete analytical mechanics concepts`
- [x] Misconceptions, items and explanations — quantum mechanics
      (wavefunctions-and-probability, heisenberg-uncertainty-principle,
      particle-in-a-box, quantum-tunneling,
      the-hydrogen-atom-and-atomic-structure,
      spin-and-angular-momentum-in-quantum-mechanics)
  `content: complete quantum mechanics concepts`
- [x] Misconceptions, items and explanations — statistical mechanics
      (the-maxwell-boltzmann-distribution, statistical-definition-of-entropy,
      free-energy-and-spontaneity, the-carnot-cycle-and-heat-engines)
  `content: complete statistical mechanics concepts`
- [x] Misconceptions, items and explanations — upper electromagnetism
      (maxwells-equations, kirchhoffs-laws-and-circuit-analysis,
      rc-circuit-transients, ac-circuits-and-impedance)
  `content: complete upper electromagnetism concepts`
- [x] Misconceptions, items and explanations — fluid mechanics
      (pressure-in-fluids, buoyancy-and-archimedes-principle,
      pascals-principle-and-hydraulics, fluid-continuity-and-flow-rate,
      bernoullis-equation, viscosity-and-poiseuille-flow)
  `content: complete fluid mechanics concepts`
- [ ] Add formulas, problem templates and error models to the quantitative
      concepts that still have none (heisenberg-uncertainty-principle,
      wavefunctions-and-probability, quantum-tunneling,
      the-hydrogen-atom-and-atomic-structure,
      spin-and-angular-momentum-in-quantum-mechanics,
      the-maxwell-boltzmann-distribution, statistical-definition-of-entropy,
      maxwells-equations, kirchhoffs-laws-and-circuit-analysis,
      coupled-and-driven-oscillators, lagrangian-mechanics,
      viscosity-and-poiseuille-flow)
  `content: add formulas for bachelor-core physics concepts`
- [ ] Enrich ET resource sets beyond Vikipeedia where a real Estonian source
      exists (opik.fyysika.ee sections, TaskuTark, university course pages)
  `content: enrich estonian resources for bachelor-core concepts`
- [ ] Re-audit the physics prerequisite graph and glossary coverage for
      the new modules
  `content: audit bachelor-core physics additions`

### Phase 12 — Bilingual QA

- [x] Review all Estonian concept text against the glossary
  `content: review estonian terminology across concepts`
- [x] Revise Estonian misconception text that reads as calqued
  `content: revise calqued estonian misconception text`
- [x] Fix Estonian test item stems that are grammatical only in English word order
  `content: fix estonian test item grammar`
- [x] Cross-check level names against the Estonian education system
  `content: align level names with estonian system`
- [x] Read every concept page in Estonian end to end
  `content: final estonian proofread pass`
- [x] Read every concept page in English end to end
  `content: final english proofread pass`

### Phase 13 — Ship

- [x] Build the landing page with copy written natively in both locales
  `feat: add landing page copy in both locales`
- [x] Add global search indexing both locales independently
  `feat: index both locales in global search`
- [x] Add a 404 page suggesting related concepts
  `feat: add helpful 404 page`
- [x] Add a link checker for external resources in CI
  `ci: add external link checker`
- [x] Run a Lighthouse pass and fix findings
  `perf: address lighthouse findings`
- [x] Emit localised sitemaps with hreflang alternates
  `feat: add localised sitemaps with hreflang`
- [x] Add cookieless analytics
  `feat: add cookieless analytics`
- [x] Deploy to Vercel and configure the domain
  `chore: deploy to vercel`
- [x] Write README and content contribution guide
  `docs: add readme and contribution guide`

---

## Physics to bachelor completeness (Phases 15–24)

Phases 0–13 shipped a working site; Phase 11b brought L3 from a veneer to real
depth. What follows is the rest of what a BSc physics core actually contains —
roughly 75 further concepts, each authored to the same bar: both locales in the
same pass, three misconceptions, at least one concept item, curated EN and ET
resources, an explanation per locale, and a formula with problem template and
error model wherever the concept is quantitative.

Scaffold every one of them with `npm run content:new-concept` (see
[How to resume](#how-to-resume-this-on-another-machine)). Commit per concept or
per small group, never in one batch.

Terminology first: for each phase, add any new physics term to
`content/terminology/glossary.json` with a cited Estonian rendering **before**
authoring content that uses it — `npm run lint:terminology` fails otherwise.

### Phase 15 — Electromagnetism to bachelor core

Module `electromagnetism`. The largest single gap: the current set jumps from
fields to Maxwell's equations with no potential, no Gauss, no Ampère.

- [x] Add terminology for electrostatics and magnetostatics
  `content: add electromagnetism terminology`
- [x] `coulombs-law` (L1) — prereq `electric-charge-and-current`
  `content: add coulombs law concept`
- [x] `resistivity-and-conductivity` (L1) — prereq `voltage-and-resistance`
  `content: add resistivity and conductivity concept`
- [x] `electric-power-and-joule-heating` (L1) — prereq `voltage-and-resistance`
  `content: add electric power and joule heating concept`
- [x] `electric-potential-and-potential-energy` (L2) — prereq `electric-fields`,
      `work-and-energy`
  `content: add electric potential concept`
- [x] `dielectrics-and-capacitor-energy` (L2) — prereq `capacitance`
  `content: add dielectrics and capacitor energy concept`
- [x] `lorentz-force` (L2) — prereq `magnetic-fields`
  `content: add lorentz force concept`
- [x] `gausss-law` (L3) — prereq `electric-fields`, `electric-potential-and-potential-energy`
  `content: add gausss law concept`
- [x] `amperes-law` (L3) — prereq `magnetic-fields`
  `content: add amperes law concept`
- [x] `biot-savart-law` (L3) — prereq `magnetic-fields`
  `content: add biot savart law concept`
- [x] `inductance-and-rl-circuits` (L3) — prereq `electromagnetic-induction`
  `content: add inductance and rl circuits concept`
- [x] `lc-and-rlc-oscillations` (L3) — prereq `inductance-and-rl-circuits`,
      `rc-circuit-transients`
  `content: add lc and rlc oscillations concept`
- [x] `the-poynting-vector` (L3) — prereq `maxwells-equations`, `electromagnetic-waves`
  `content: add poynting vector concept`
- [x] `electromagnetic-waves-in-media` (L3) — prereq `electromagnetic-waves`
  `content: add electromagnetic waves in media concept`

### Phase 16 — Mechanics to bachelor core

Module `mechanics`. Fills the L1 gaps a first-year course assumes, then the
analytical mechanics that follows Lagrangian.

- [x] Add terminology for rotational and analytical mechanics
  `content: add mechanics terminology`
- [x] `projectile-motion` (L1) — prereq `displacement-velocity-acceleration`
  `content: add projectile motion concept`
- [x] `uniform-circular-motion` (L1) — prereq `displacement-velocity-acceleration`
  `content: add uniform circular motion concept`
- [x] `centripetal-force` (L1) — prereq `uniform-circular-motion`, `newtons-second-law`
  `content: add centripetal force concept`
- [x] `friction` (L1) — prereq `newtons-second-law`
  `content: add friction concept`
- [x] `static-equilibrium` (L1) — prereq `newtons-first-law`, `torque-and-angular-momentum`
  `content: add static equilibrium concept`
- [x] `centre-of-mass` (L2) — prereq `conservation-of-momentum`
  `content: add centre of mass concept`
- [x] `elastic-and-inelastic-collisions` (L2) — prereq `conservation-of-momentum`,
      `conservation-of-energy`
  `content: add collisions concept`
- [x] `rolling-motion` (L2) — prereq `rotational-kinetic-energy`
  `content: add rolling motion concept`
- [x] `damped-oscillations` (L2) — prereq `simple-harmonic-motion`
  `content: add damped oscillations concept`
- [x] `keplers-laws` (L2) — prereq `newtonian-gravitation`
  `content: add keplers laws concept`
- [x] `non-inertial-frames-and-fictitious-forces` (L3) — prereq `newtons-second-law`
  `content: add non inertial frames concept`
- [x] `central-force-motion-and-orbits` (L3) — prereq `newtonian-gravitation`,
      `torque-and-angular-momentum`
  `content: add central force motion concept`
- [x] `hamiltonian-mechanics` (L3) — prereq `lagrangian-mechanics`
  `content: add hamiltonian mechanics concept`

### Phase 17 — Waves and sound

Module `waves`.

- [x] Add terminology for acoustics
  `content: add wave and acoustics terminology`
- [x] `sound-waves-and-intensity` (L1) — prereq `wave-properties`
  `content: add sound waves and intensity concept`
- [x] `wave-energy-and-power` (L2) — prereq `wave-properties`
  `content: add wave energy and power concept`
- [x] `beats-and-superposition` (L2) — prereq `wave-properties`
  `content: add beats and superposition concept`
- [x] `the-doppler-effect` (L2) — prereq `sound-waves-and-intensity`
  `content: add doppler effect concept`
- [x] `the-wave-equation` (L3) — prereq `wave-properties`, `simple-harmonic-motion`
  `content: add wave equation concept`

### Phase 18 — Thermodynamics and statistical mechanics

Modules `thermodynamics` and `statistical-mechanics`.

- [x] Add terminology for statistical mechanics
  `content: add statistical mechanics terminology`
- [x] `heat-transfer-mechanisms` (L1) — prereq `temperature-and-heat`
  `content: add heat transfer concept`
- [x] `internal-energy-and-the-first-law` (L2) — prereq `laws-of-thermodynamics`
  `content: add internal energy concept`
- [x] `thermodynamic-processes` (L2) — prereq `ideal-gas-law`,
      `internal-energy-and-the-first-law`
  `content: add thermodynamic processes concept`
- [x] `real-gases-and-the-van-der-waals-equation` (L3) — prereq `ideal-gas-law`
  `content: add real gases concept`
- [x] `the-equipartition-theorem` (L3) — prereq `kinetic-theory-of-gases`
  `content: add equipartition theorem concept`
- [x] `microstates-and-multiplicity` (L3) — prereq `statistical-definition-of-entropy`
  `content: add microstates and multiplicity concept`
- [x] `the-partition-function` (L3) — prereq `microstates-and-multiplicity`
  `content: add partition function concept`
- [x] `blackbody-radiation-and-plancks-law` (L3) — prereq `photons-and-quanta`
  `content: add blackbody radiation concept`
- [x] `quantum-statistics-fermi-dirac-and-bose-einstein` (L3) — prereq
      `the-partition-function`, `the-pauli-exclusion-principle`
  `content: add quantum statistics concept`

### Phase 19 — Optics

Module `optics`.

- [x] Add terminology for physical optics
  `content: add optics terminology`
- [x] `dispersion-and-chromatic-effects` (L2) — prereq `snells-law`
  `content: add dispersion concept`
- [x] `optical-instruments-and-magnification` (L2) — prereq `lenses-and-focal-length`
  `content: add optical instruments concept`
- [x] `thin-film-interference` (L2) — prereq `interference-and-diffraction`
  `content: add thin film interference concept`
- [x] `diffraction-gratings` (L2) — prereq `interference-and-diffraction`
  `content: add diffraction gratings concept`
- [x] `optical-resolution-and-the-rayleigh-criterion` (L3) — prereq `diffraction-gratings`
  `content: add optical resolution concept`
- [x] `the-michelson-interferometer` (L3) — prereq `interference-and-diffraction`
  `content: add michelson interferometer concept`

### Phase 20 — Quantum mechanics

Module `quantum-mechanics`. Depends on Phase 11b's quantum concepts being
finished first.

- [x] Add terminology for quantum formalism
  `content: add quantum mechanics terminology`
- [x] `de-broglie-wavelength` (L2) — prereq `wave-particle-duality`
  `content: add de broglie wavelength concept`
- [x] `the-schrodinger-equation` (L3) — prereq `wavefunctions-and-probability`
  `content: add schrodinger equation concept`
- [x] `operators-and-observables` (L3) — prereq `the-schrodinger-equation`
  `content: add operators and observables concept`
- [x] `expectation-values-and-measurement` (L3) — prereq `operators-and-observables`
  `content: add expectation values concept`
- [x] `potential-steps-and-finite-wells` (L3) — prereq `the-schrodinger-equation`,
      `quantum-tunneling`
  `content: add potential steps and finite wells concept`
- [x] `the-quantum-harmonic-oscillator` (L3) — prereq `the-schrodinger-equation`,
      `simple-harmonic-motion`
  `content: add quantum harmonic oscillator concept`
- [x] `quantum-numbers-and-atomic-orbitals` (L3) — prereq
      `the-schrodinger-equation`, `operators-and-observables`
  `content: add quantum numbers and orbitals concept`
- [x] `the-pauli-exclusion-principle` (L3) — prereq
      `quantum-numbers-and-atomic-orbitals`
  `content: add pauli exclusion principle concept`

### Phase 21 — Relativity

Module `special-relativity`. Depends on Phase 11b's relativity concepts.

- [x] Add terminology for relativistic kinematics
  `content: add relativity terminology`
- [x] `relativity-of-simultaneity` (L3) — prereq `postulates-of-special-relativity`
  `content: add relativity of simultaneity concept`
- [x] `lorentz-transformations` (L3) — prereq `time-dilation`, `length-contraction`
  `content: add lorentz transformations concept`
- [x] `relativistic-velocity-addition` (L3) — prereq `lorentz-transformations`
  `content: add relativistic velocity addition concept`
- [x] `spacetime-and-four-vectors` (L3) — prereq `lorentz-transformations`
  `content: add spacetime and four vectors concept`
- [x] `the-relativistic-doppler-effect` (L3) — prereq `the-doppler-effect`,
      `lorentz-transformations`
  `content: add relativistic doppler effect concept`

### Phase 22 — Nuclear, particle and solid-state physics

New modules `nuclear-physics`, `particle-physics` and `solid-state-physics`
alongside the existing `modern-physics`.

- [ ] Add terminology for nuclear, particle and solid-state physics
  `content: add nuclear and solid state terminology`
- [ ] `compton-scattering` (L2, modern-physics) — prereq `photons-and-quanta`
  `content: add compton scattering concept`
- [ ] `x-rays-and-their-production` (L2, modern-physics) — prereq `quantum-energy-levels`
  `content: add x rays concept`
- [ ] `nuclear-binding-energy` (L2, nuclear-physics) — prereq `atoms-and-the-nucleus`,
      `relativistic-momentum-and-energy`
  `content: add nuclear binding energy concept`
- [ ] `nuclear-fission-and-fusion` (L2, nuclear-physics) — prereq `nuclear-binding-energy`
  `content: add fission and fusion concept`
- [ ] `radioactive-decay-modes` (L2, nuclear-physics) — prereq `radioactivity-and-half-life`
  `content: add radioactive decay modes concept`
- [ ] `lasers-and-stimulated-emission` (L3, modern-physics) — prereq `quantum-energy-levels`
  `content: add lasers concept`
- [ ] `crystal-structure-and-lattices` (L3, solid-state-physics) — prereq `phase-transitions`
  `content: add crystal structure concept`
- [ ] `band-theory-of-solids` (L3, solid-state-physics) — prereq
      `crystal-structure-and-lattices`, `quantum-energy-levels`
  `content: add band theory concept`
- [ ] `semiconductors-and-doping` (L3, solid-state-physics) — prereq `band-theory-of-solids`
  `content: add semiconductors concept`
- [ ] `superconductivity` (L3, solid-state-physics) — prereq `band-theory-of-solids`
  `content: add superconductivity concept`
- [ ] `the-standard-model-of-particle-physics` (L3, particle-physics) — prereq
      `nuclear-binding-energy`, `spin-and-angular-momentum-in-quantum-mechanics`
  `content: add standard model concept`
- [ ] `conservation-laws-in-particle-interactions` (L3, particle-physics) — prereq
      `the-standard-model-of-particle-physics`
  `content: add particle conservation laws concept`

### Phase 23 — Fluids and experimental method

Modules `fluid-mechanics` and `measurement`. Depends on Phase 11b's fluids
concepts being finished first.

- [ ] `surface-tension-and-capillarity` (L2) — prereq `pressure-in-fluids`
  `content: add surface tension concept`
- [ ] `drag-and-terminal-velocity` (L2) — prereq `newtons-second-law`,
      `viscosity-and-poiseuille-flow`
  `content: add drag and terminal velocity concept`
- [ ] `reynolds-number-and-turbulence` (L3) — prereq `viscosity-and-poiseuille-flow`
  `content: add reynolds number concept`
- [ ] `graphing-and-linearisation-of-data` (L2, measurement) — prereq `uncertainty-and-error`
  `content: add data linearisation concept`
- [ ] `least-squares-fitting-and-linear-regression` (L3, measurement) — prereq
      `graphing-and-linearisation-of-data`
  `content: add least squares fitting concept`
- [ ] `statistical-distributions-in-measurement` (L3, measurement) — prereq
      `combining-uncertainties`
  `content: add statistical distributions concept`

### Phase 24 — Enforcement and final bilingual QA

Only once every concept above is authored. This is the phase that closes the
door on the failure mode that started all of this.

- [x] Empty `COVERAGE_WAIVERS` — every concept complete, no waivers left
  `content: clear all content coverage waivers`
- [x] Promote missing explanations from warning to error now that all exist
  `feat: require explanations in both locales`
- [ ] Add `npm run content:coverage -- --incomplete` to CI as a blocking step
  `ci: gate on content coverage`
- [ ] Re-run `npm run content:hash` and clear every stale translation flag
  `content: resync translation hashes`
- [ ] Full glossary audit — every formula symbol name has a cited entry
  `content: audit glossary coverage`
- [ ] Re-audit the prerequisite DAG across all modules for orphans and depth
  `content: audit full physics prerequisite graph`
- [ ] Read every new concept page end to end in Estonian
  `content: estonian proofread of bachelor completion`
- [ ] Read every new concept page end to end in English
  `content: english proofread of bachelor completion`
- [ ] Run `npm run check:links` and replace anything that no longer resolves
  `content: refresh dead resource links`
- [ ] Lighthouse pass on the grown site (roadmap and search now much larger)
  `perf: address lighthouse findings after content growth`

### Phase 14 — Remaining subjects — SUPERSEDED

Kept for the record. This phase said "add mathematics, chemistry and materials
science" with no further detail. Phases 25–34 replace it with the actual
requirement, taken from the University of Tartu curriculum rather than
invented: see `content/curriculum/README.md`.

- [~] Add mathematics using the existing schema → Phase 27
- [~] Add chemistry → Phase 28
- [~] Add materials science → Phase 29

---

## Covering the whole degree (Phases 25–34)

Phases 0–24 are about physics as a subject. These are about the **degree**: the
University of Tartu BSc *Füüsika, keemia ja materjaliteadus*, whose three tracks
a learner should be able to complete here without attending.

The requirement is not guesswork — it is parsed from the university's own course
text into `content/curriculum/`. Read
[`content/curriculum/README.md`](./content/curriculum/README.md) first; it
explains the module structure, what `mandatory-all` vs `mandatory` vs `elective`
mean, and how a course maps to concepts.

**The state of play is a command, not a paragraph:**

```bash
npm run curriculum:coverage            # all three tracks, module by module
npm run curriculum:coverage -- --gaps  # only what is still missing
```

| Track | Required courses covered | Required ECTS |
| --- | --- | --- |
| Physics | **20 / 20** | **102 / 102** |
| Chemistry | **21 / 21** | **102 / 102** |
| Materials science | **18 / 18** | **102 / 102** |

**All three tracks have every required course covered — 59/59 required
course-slots, 306/306 EAP.** Five subjects exist: `physics`, `mathematics`,
`chemistry`, `materials-science` and `computing`.

This is course-*coverage*, not course-*depth*, and the difference matters more
now than at any earlier point in this file. A course counts as covered once at
least one concept maps to it — the bar that makes "0 concepts" visible as a
gap. Many required courses are covered by 2-3 concepts against syllabi that list
15-30 topics (see any course's `topics` count in `content/curriculum/courses/`).
Reaching genuine depth — enough concepts that a learner could sit each course's
real exam — is Phases 15-23 for physics (still open) and the remaining work in
Phases 27-29 for the other three subjects. `npm run curriculum:coverage`
reports course-slot coverage; it does not yet report depth, and that gap between
"covered" and "complete" is the honest next target.

Two structural facts shape everything below:

- **Chemistry and materials science have no subject directory yet.** The schema
  is subject-agnostic, but each new subject needs `content/<subject>/`, its own
  terminology glossary with cited Estonian renderings, and any new units in the
  registry, *before* its first concept can be authored.
- **Practical courses cannot be fully delivered by a static site.** A
  `praktikum` teaches bench technique. Cover the theory the experiments rest on,
  map the concepts, and state plainly in the course page what still requires a
  lab. Do not claim coverage that isn't there.

### Phase 25 — Curriculum workspace

- [x] Parse the raw course text into a structured dataset
  `feat: parse the ut curriculum into a structured course dataset`
- [x] Map platform concepts to courses and report per-track coverage
  `feat: map platform concepts to ut courses and report degree coverage`
- [x] Document the workspace, the module structure and the mapping rules
  `docs: explain the curriculum workspace and how to read coverage`
- [ ] Capture the missing syllabus for `LOKT.07.010` Foundations of chemistry —
      the only *required* course with no course page in the raw scrape
  `content: add missing syllabus for foundations of chemistry`
- [ ] Surface the curriculum in the app: a per-track page showing modules,
      courses, and which are covered, linking each course to its concepts
  `feat: add curriculum pages per track`
- [ ] Show on every concept page which courses it belongs to
  `feat: show course membership on concept pages`

### Phase 26 — The shared spine (required of all three tracks)

The 11 `mandatory-all` courses. Two are already covered (`LOFY.01.002` The
physical world view, `LTFY.01.011` physics lab practical). These nine are not,
and each one blocks all three degrees at once:

- [x] `LOKT.07.010` Foundations of chemistry (6 EAP)
  `content: cover foundations of chemistry`
- [x] `LTFY.02.003` Survey course in materials science (6 EAP)
  `content: cover the materials science survey course`
- [x] `LTKT.01.002` Laboratory practical, chemistry (3 EAP) — theory side
  `content: cover the chemistry laboratory practical`
- [x] `MTMM.00.340` Higher mathematics I (6 EAP) — 32 syllabus topics parsed
  `content: cover higher mathematics i`
- [x] `MTMM.00.341` Higher mathematics II (6 EAP)
  `content: cover higher mathematics ii`
- [x] `MTMS.02.059` Probability theory and mathematical statistics (6 EAP)
  `content: cover probability and statistics`
- [x] `MTAT.03.236` Foundations of programming (3 EAP)
  `content: cover foundations of programming`
- [x] `MTAT.03.256` Foundations of programming II (3 EAP)
  `content: cover foundations of programming ii`
- [x] `LTAT.03.001` Programming (6 EAP)
  `content: cover programming`

### Phase 27 — Mathematics as a subject

`content/mathematics/`. Driven by `MTMM.00.340`'s 32 parsed topics, plus what
the physics content already leans on implicitly.

- [x] Scaffold the subject directory and its terminology glossary
  `content: scaffold the mathematics subject with vectors in space`
- [x] Author single-variable calculus — limits, derivatives, integrals
  `content: add single variable calculus concepts`
- [x] Author sequences, series and convergence
  `content: add sequences and series concepts`
- [x] Author linear algebra — vectors, matrices, determinants, systems,
      vector spaces, eigenvalues (8 concepts)
  `content: add linear algebra concepts`
- [x] Author multivariable calculus — partial derivatives, multiple integrals
  `content: add multivariable calculus concepts`
- [x] Author vector calculus — gradient, divergence, curl, the integral theorems
  `content: add vector calculus concepts`
- [~] Author ordinary differential equations — first-order separable and linear
      done; second-order still to come
  `content: add differential equations concepts`
- [x] Author probability and statistics for `MTMS.02.059`
  `content: add probability and statistics concepts`
- [x] Author complex numbers and functions of a complex variable — algebraic,
      polar/exponential form, holomorphic functions and Cauchy-Riemann (4 concepts)
  `content: add complex analysis concepts`

### Phase 28 — Chemistry as a subject

`content/chemistry/`. The largest single gap: 19 of chemistry's 21 required
courses have nothing.

- [x] Scaffold the subject directory and its terminology glossary
  `content: scaffold the chemistry subject with the mole`
- [x] Author general chemistry for `LOKT.07.010` — the mole, bonding, stoichiometry,
      the periodic table, acids/bases/pH, redox, equilibrium, kinetics (8 concepts)
  `content: add general chemistry concepts`
- [ ] Author inorganic chemistry for `LOKT.01.007` (25 syllabus topics)
  `content: add inorganic chemistry concepts`
- [ ] Author organic chemistry I for `LOKT.09.004` (14 topics)
  `content: add organic chemistry concepts`
- [ ] Author physical chemistry part 1 for `LOKT.02.037` (30 topics)
  `content: add physical chemistry part one concepts`
- [ ] Author physical chemistry part 2 for `LTKT.02.001` (30 topics)
  `content: add physical chemistry part two concepts`
- [ ] Author analytical chemistry for `LTKT.06.019` and `LTKT.06.024` (15 topics)
  `content: add analytical chemistry concepts`
- [ ] Author theoretical chemistry for `LOKT.08.001`
  `content: add theoretical chemistry concepts`
- [ ] Author the theory behind the chemistry practicals — `LOKT.01.010`,
      `LOKT.06.012`, `LOKT.09.014`, `LOKT.10.018`, `LTKT.02.002`, `LTKT.06.004`
  `content: add chemistry practical theory concepts`

### Phase 29 — Materials science as a subject

`content/materials-science/`. Sits on top of physics and chemistry, so it
follows both.

- [x] Scaffold the subject directory and its terminology glossary
  `content: scaffold the materials science subject`
- [x] Author the survey course for `LTFY.02.003` and `LOFY.02.008`
  `content: add materials science survey concepts`
- [ ] Author structure and properties of matter for `LTFY.02.001`
  `content: add structure and properties of matter concepts`
- [ ] Author classes of materials and their technologies for `LTFY.02.002`
      (12 EAP — the single largest course in the degree)
  `content: add materials classes concepts`
- [ ] Author research methods for `LTFY.02.016` — diffraction, microscopy,
      spectroscopy, thermal analysis
  `content: add materials research methods concepts`
- [ ] Author the theory behind the materials physics practicals
  `content: add materials practical theory concepts`

### Phase 30 — Computing as a subject

Three programming courses, 12 EAP, required of all three tracks. A static site
cannot run a compiler, so scope this honestly: concepts, worked examples and
hand-traced execution, with an explicit note that writing real programs needs a
real machine.

- [x] Scaffold the subject directory
  `content: scaffold the computing subject`
- [x] Author programming fundamentals — values, control flow, functions
  `content: add programming fundamentals concepts`
- [ ] Author data structures and algorithms at first-course level
  `content: add data structures concepts`
- [ ] Author numerical methods as used in physics and chemistry
  `content: add numerical methods concepts`

### Phase 31 — Physics courses still uncovered

- [x] `LTFY.01.014` Spectroscopy (5 EAP, required for physics)
  `content: cover spectroscopy`
- [x] `LOFY.01.018` Foundations of signal processing I (3 EAP, required)
  `content: cover signal processing`
- [ ] `LTFY.04.013` Mathematical physics (36 topics) — needs Phase 27
  `content: cover mathematical physics`
- [ ] `LOFY.04.035` Equations of mathematical physics (15 topics)
  `content: cover equations of mathematical physics`
- [ ] `LTFY.04.015` Functions of a complex variable in physics (15 topics)
  `content: cover complex variable physics`
- [ ] `LOFY.01.015` Experimental methods of nuclear physics (14 topics)
  `content: cover nuclear experimental methods`
- [ ] `LTFY.01.005` / `LTTO.00.025` Global physics
  `content: cover global physics`

### Phase 32 — Practical and laboratory courses

Every `praktikum` in all three tracks. The deliverable is the theory, the
measurement analysis and the write-up skills — not the bench work.

- [ ] Decide and document what "covered" means for a practical course, and show
      it honestly on the course page rather than as a full tick
  `docs: define coverage for practical courses`
- [ ] Cover measurement, uncertainty and data analysis as the shared basis
  `content: cover practical measurement and analysis`
- [ ] Map each practical to the concepts its experiments rest on
  `content: map practicals to underlying concepts`

### Phase 33 — Electives and enrichment

Not required for any degree, so this comes last — but the elective modules are
12 EAP a student must take from *somewhere*, and the enrichment list is where
content beyond the degree lives.

- [ ] Cover the most commonly taken electives per track
  `content: cover common elective courses`
- [ ] Keep `npm run curriculum:coverage -- --extra` meaningful: enrichment stays
      labelled as enrichment and never counts toward degree coverage
  `content: review enrichment classification`

### Phase 34 — Degree-completeness gate

The equivalent of Phase 24, for the degree rather than for physics.

- [ ] Add `npm run curriculum:coverage` to CI, failing if a required course
      that had content loses it
  `ci: gate on degree coverage regressions`
- [ ] Fail the build on a mapping entry naming a concept that does not exist
  `feat: validate the curriculum concept mapping`
- [ ] Full bilingual QA pass over every new subject, both locales
  `content: bilingual qa for new subjects`
- [ ] Re-audit the prerequisite graph across all four subjects
  `content: audit the cross subject prerequisite graph`

