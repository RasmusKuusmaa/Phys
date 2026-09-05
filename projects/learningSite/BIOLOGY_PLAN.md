# Biology content plan

New subject, first item on `SCIENCE_ROADMAP.md`'s build order. Same content
model, same schema, same workflow as every prior subject.

Baseline: `content/biology/` does not exist yet — greenfield.

## Scope and framing

"Biology" here means general/foundational biological science at the depth
a bachelor's biology degree covers before specializing — evolution,
ecology, taxonomy, and the diversity of life — distinct from what's already
built elsewhere on the site under a different lens:

- `medicine`'s `cell-and-molecular-biology` module already covers general
  eukaryotic cell structure, membrane transport, the cell cycle, the
  central dogma, stem cells, and apoptosis at a mechanism level applicable
  to any eukaryotic cell, not just human ones — this subject does not
  re-teach cell biology from scratch.
- `medicine`'s `genetics-and-molecular-genetics` module already covers
  Mendelian inheritance, meiosis, gene expression regulation, mutation,
  and population genetics/Hardy-Weinberg equilibrium — this subject does
  not re-teach genetics fundamentals; its own genetics-adjacent content
  (below) is specifically the evolutionary-mechanism angle (mutation,
  selection, drift, and gene flow as forces acting on populations over
  time), not inheritance mechanics.
- `medicine`'s `microbiology` module covers bacterial/viral/fungal/
  parasitic structure and pathogenic mechanism — this subject's own
  microbial-life content (Phase Bio2) covers prokaryotic diversity and
  ecology, not pathogenesis.
- `chemistry`'s `biochemistry` module covers molecular-level protein/
  nucleic-acid structure and enzyme kinetics — this subject stays at the
  organismal/population level, not molecular structure.
- `biohacking` stays at an applied, claim-evaluation depth for anything
  human-health-adjacent (nutrition, the microbiome) — this subject is the
  underlying biological science, not self-experimentation.

Given all of that, this subject's actual territory is: evolution and
natural selection as the unifying framework of biology, speciation and
phylogenetics, taxonomy and classification, photosynthesis and plant
energy metabolism (an entire process absent from every existing subject),
population and community ecology, ecosystem energy flow, animal and plant
diversity, prokaryotic/microbial diversity (the ecology angle, not the
pathogen angle), and conservation biology.

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (population growth models are the clearest candidate
in this phase — logistic/exponential growth equations).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase Bio1 — foundational (evolution as biology's unifying framework,
## classification, plant energy metabolism, and population/community
## ecology)

Single module for now (`biology-fundamentals`), same one-module-through-
later-phases pattern every new subject on this site has started with.

- [x] Evolution and natural selection (Darwinian selection, adaptation,
      the major lines of evidence for evolution; no prerequisites — the
      unifying framework the rest of this subject builds on)
- [x] Speciation and phylogenetics (how new species arise — allopatric/
      sympatric speciation — and how phylogenetic trees represent
      evolutionary relationships; prerequisite: evolution-and-natural-
      selection)
- [x] Taxonomy and biological classification (the three domains, kingdom-
      level classification, binomial nomenclature; no prerequisites)
- [x] Photosynthesis and plant energy metabolism (light-dependent and
      light-independent reactions, C3/C4/CAM photosynthesis at an overview
      level — an entire biological process absent from every existing
      subject; no prerequisites; kept conceptual)
- [x] Population ecology and population dynamics (carrying capacity,
      exponential vs. logistic population growth; no prerequisites;
      formalised the logistic growth equation, N = K/(1+((K-N0)/N0)e^(-rt)),
      as a formula + problem template + error model — the one clean
      numeric relationship in this phase's batch)
- [x] Community ecology and species interactions (competition, predation,
      mutualism, and other symbiotic relationships; prerequisite:
      population-ecology-and-population-dynamics; kept conceptual)

Phase Bio1 complete: 6 biology concepts. Only `population-ecology-and-
population-dynamics` got a formula; the rest are conceptual/mechanistic,
same balance every prior subject's first phase has struck. Two new
glossary terms added (`carrying-capacity`, `growth-rate`, domain
`ecology`); all other formula symbols reused existing `population-size`
and `time` entries. `npm run validate:content` (11 subjects — includes a
sibling `earth-science` subject that appeared mid-phase, untouched by this
directive — 659 concepts), `npm run lint:terminology` (269 glossary
terms), and `npm run typecheck` all pass; every resource URL verified live
with `curl`. One Estonian resource is an honest close match rather than an
exact-topic match: `community-ecology-and-species-interactions` links to
"Bioloogilised interaktsioonid" (biological interactions generally) since
Estonian Wikipedia has no dedicated "community ecology" article at that
exact scope.

## Phase Bio2 — not yet planned

To be scoped after Bio1 lands. Candidates already surveyed: ecosystem
ecology and energy flow (trophic levels, food webs, the ten-percent rule),
animal diversity and body plans, plant diversity and structure, and
microbial diversity and prokaryotic ecology (distinct from medicine's
pathogen-focused microbiology module). Biodiversity/conservation biology
was considered here but reassigned to `environmental-science`'s own plan
(a later `SCIENCE_ROADMAP.md` item) instead — it's a more natural fit as
that subject's applied/policy-facing "biosphere systems" territory than
this subject's organismal/evolutionary lens, and assigning it once avoids
the two subjects racing to cover the same concept independently.

---
