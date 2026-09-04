# Medicine content plan

New subject, per the user's explicit instruction: after `BIOHACKING_PLAN.md`,
"go through all of the themes that involve the human body and what someone
has to learn to become a scientist on any medical topic." Same content
model, same schema, same workflow as every prior subject.

Baseline: `content/medicine/` does not exist yet — greenfield. This is the
largest scope any subject on this site has taken on since the original
physics build — comparable in ambition to `MSC_PHYSICS_PLAN.md`'s
astrophysics/nuclear-physics extension, not to a single-phase subject like
aerospace-engineering. Treat this file the way `MSC_PHYSICS_PLAN.md` was
treated: a living roadmap, phases detailed just before they're executed
rather than all up front, checked off and extended over many sessions.

## Scope and framing

"What someone has to learn to become a scientist on any medical topic"
is read as: the foundational biomedical sciences a medical-school/
biomedical-PhD curriculum builds before any clinical specialty (cell
biology, genetics, microbiology, immunology, pathology, pharmacology,
biostatistics/epidemiology, neuroscience), plus the organ-system
pathophysiology layer built on top of it (cardiology, pulmonology,
gastroenterology, nephrology, hematology/oncology, musculoskeletal,
reproductive medicine, dermatology, infectious disease, psychiatry) — the
same "foundational-through-graduate, every genuine standard-textbook topic"
bar the four already-comprehensive subjects were held to, translated into
medical-curriculum terms rather than a taught-MSc-physics one. This is
scientific/mechanistic content — how the body works and how disease and
treatment work mechanistically — not clinical training (no diagnostic
algorithms, treatment protocols, or anything resembling clinical practice
advice); the site's existing "no accounts, static content, misconceptions-
first" model fits a science-literacy treatment of medicine, not a
substitute for medical training or care.

Checked overlap before drafting: chemistry's `biochemistry` module (amino
acids, enzyme kinetics, nucleic acid structure) stays as molecular-level
biochemistry; medicine's cell/molecular-biology module covers cell-level
mechanism (organelles, transport, cell cycle, central dogma as a process)
without re-deriving the chemistry module's structural/kinetic content.
`BIOHACKING_PLAN.md` owns applied self-experimentation and claim-evaluation;
medicine owns the underlying mechanism at proper depth. Materials-science's
`biomaterials` concept stays a materials-engineering topic. Physics's
`fluid-mechanics` (Pascal's principle, Poiseuille flow) is a plausible
prerequisite-in-spirit for cardiovascular hemodynamics, but per the
architecture's confirmed lack of cross-subject prerequisites (`QUESTIONS.md`),
any physics machinery a medicine concept needs gets restated at the depth
that concept requires, not linked.

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (cardiac output, drug clearance/half-life, BMI-style
calculations, Hardy-Weinberg genotype frequencies — several modules below
will have genuine candidates; most cell-biology/anatomy/microbiology
content will stay conceptual, same balance every prior subject has struck).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Provisional module roadmap (subject to revision as phases land, same as
## `MSC_PHYSICS_PLAN.md`'s own roadmap evolved)

Foundational sciences first, organ-system pathophysiology after:

1. Cell and molecular biology
2. Human anatomy and physiology (by body system)
3. Genetics and molecular genetics
4. Microbiology
5. Immunology
6. General pathology (mechanisms of disease: inflammation, neoplasia, cell
   injury)
7. Pharmacology
8. Biostatistics, epidemiology, and evidence-based medicine
9. Neuroscience
10. Endocrinology (deep — module 2 covers only an intro-level overview)
11. Cardiovascular medicine
12. Respiratory medicine
13. Gastrointestinal and hepatic medicine
14. Renal and urologic medicine
15. Hematology and oncology
16. Musculoskeletal medicine and rheumatology
17. Reproductive medicine
18. Dermatology
19. Infectious disease (clinical syndromes, building on microbiology)
20. Psychiatry and behavioral medicine
21. Closing gap sweep (whatever the above phases' own forks flag, same
    pattern `AEROSPACE_ENGINEERING_PLAN.md`/`GENERAL_ENGINEERING_PLAN.md`
    used)

## Phase Med1 — foundational entry point (cell/molecular biology, and a
## human anatomy-and-physiology overview by body system)

Two modules, six concepts each, split as two independent tracks (no
concept in one module depends on a concept in the other, so these can be
authored in parallel).

### Module `cell-and-molecular-biology`

- [x] Cell structure and organelle function (eukaryotic cell structure —
      nucleus, mitochondria, ER/Golgi, lysosomes — and what each organelle
      actually does; no prerequisites)
- [x] Cell membrane transport and signaling (passive vs. active transport,
      membrane receptors, signal transduction basics; prerequisite:
      cell-structure-and-organelle-function)
- [x] The cell cycle and mitosis (cell cycle checkpoints, mitotic phases,
      what happens when cell-cycle control fails; prerequisite:
      cell-structure-and-organelle-function)
- [x] DNA replication, transcription, and translation (the central dogma as
      cellular machinery/process — distinct from chemistry's
      nucleic-acid-structure-and-base-pairing, which is molecular structure,
      not the replication/transcription/translation machinery; prerequisite:
      cell-structure-and-organelle-function)
- [x] Stem cells and cellular differentiation (potency, differentiation,
      and why this matters for development and regenerative medicine; no
      prerequisites)
- [x] Apoptosis and programmed cell death (distinct from necrosis; why
      controlled cell death is a normal, essential process; prerequisite:
      the-cell-cycle-and-mitosis)

Module complete: 6 cell-and-molecular-biology concepts, none needed a
formula (intro-level cell biology here was mechanistic/conceptual
throughout, same balance most subjects' first phase strikes). `npm run
validate:content`, `npm run lint:terminology`, and `npm run typecheck` all
pass as of this module's last commit; every resource URL verified live with
`curl`. One Estonian resource is an honest close match rather than an exact
title match: `dna-replication-transcription-and-translation` links to
"Valgusüntees" (protein synthesis) since Estonian Wikipedia has no article
matching the concept's combined replication+transcription+translation
scope, same kind of adjustment prior phases on other subjects recorded.

### Module `human-anatomy-and-physiology`

Anatomy and physiology combined per body system (how most intro courses
actually teach it), rather than two separate passes over the same six
systems.

- [x] Skeletal system anatomy and physiology (bone structure and
      remodeling, joints, the skeleton's structural and mineral-storage
      roles; no prerequisites)
- [x] Muscular system anatomy and physiology (skeletal/smooth/cardiac
      muscle types, the sliding filament mechanism; prerequisite:
      skeletal-system-anatomy-and-physiology)
- [x] Cardiovascular system anatomy and physiology (heart chambers and
      valves, the cardiac cycle, systemic/pulmonary circulation; no
      prerequisites)
- [x] Respiratory system anatomy and physiology (airway and alveolar
      structure, gas exchange, ventilation-perfusion matching; no
      prerequisites)
- [x] Nervous system anatomy and physiology overview (central vs.
      peripheral nervous system, neurons and synapses at an intro level —
      the deep-dive neuroscience module comes later in this plan; no
      prerequisites)
- [x] Digestive system anatomy and physiology (GI tract structure,
      digestion and absorption, the liver/pancreas's digestive roles; no
      prerequisites)

Module complete: 6 human-anatomy-and-physiology concepts, all kept
conceptual. A cardiac-output formula (HR × SV) was considered for the
cardiovascular concept but skipped: the unit registry
(`src/lib/units/registry.ts`) has no litre- or minute-based unit, and adding
one is a code change outside a content-only phase's scope — same reasoning
Phase AE3 used for a missing m^4 unit. `npm run validate:content`, `npm run
lint:terminology`, and `npm run typecheck` all pass; every resource URL
verified live with `curl`.

Phase Med1 complete: 12 medicine concepts total (the subject's first
concepts). This phase ran as two parallel forks sharing one working tree
rather than separate git worktrees, which caused one benign race (a
`cannot lock ref 'HEAD'` retry, and one module's docs commit folding into
the other's) — no data loss, both modules' content and checkbox state are
correct; noting it here in case a future multi-fork phase on this site
wants separate worktrees instead. `npm run validate:content` (9 subjects,
525 concepts), `npm run lint:terminology` (250 glossary terms — this
phase's anatomy/cell-biology vocabulary was written directly into Estonian
prose rather than glossary-locked, since none of it was a formula symbol
name, the only thing the linter's untranslated-term check enforces), and
`npm run typecheck` all pass; working tree clean.

## Phase Med2 — genetics and molecular genetics, and microbiology

Two more modules, six concepts each, same independent-tracks split as
Phase Med1.

### Module `genetics-and-molecular-genetics`

- [x] Mendelian genetics and inheritance patterns (dominant/recessive
      alleles, Punnett squares, autosomal vs. sex-linked inheritance; no
      prerequisites)
- [x] Meiosis and genetic recombination (meiosis I/II, crossing over,
      independent assortment — why gametes are genetically unique;
      prerequisite: the-cell-cycle-and-mitosis)
- [x] Gene expression regulation (operons, transcription factors, an
      intro-level look at epigenetic regulation as a mechanism — distinct
      from `BIOHACKING_PLAN.md`'s planned epigenetics-and-lifestyle-
      interventions concept, which will be about lifestyle-driven epigenetic
      change and its evidence base, not the regulatory mechanism itself;
      prerequisite: dna-replication-transcription-and-translation)
- [x] Mutations and genetic variation (point mutations, chromosomal
      mutations, how heritable variation arises; no prerequisites)
- [x] Genetic disorders and inheritance mechanisms (single-gene disorders,
      chromosomal disorders/aneuploidy, inheritance-mechanism categories —
      framed mechanistically, not as a clinical-diagnosis reference;
      prerequisite: mendelian-genetics-and-inheritance-patterns)
- [x] Population genetics and Hardy-Weinberg equilibrium (allele and
      genotype frequencies, the Hardy-Weinberg equation and what violates
      it; prerequisite: none; formalised the recessive-allele-frequency
      relationship q = sqrt(q^2) as a formula + problem template + error
      model — the classic testable Hardy-Weinberg application, given an
      observed recessive-phenotype frequency, solve for allele frequency;
      added two new glossary terms, allele frequency/alleelisagedus and
      genotype frequency/genotüübisagedus, neither of which existed before)

Module complete: 6 genetics-and-molecular-genetics concepts. `npm run
validate:content`, `npm run lint:terminology` (254 glossary terms), and
`npm run typecheck` all pass; every resource URL verified live with `curl`.
This module ran concurrently with a sibling `microbiology` module in the
same shared working tree (per Phase Med1's precedent) — no conflicts beyond
the routine, harmless git-lock retries that pattern already produced once.

### Module `microbiology`

- [x] Bacterial structure and classification (Gram-positive vs.
      Gram-negative cell walls, bacterial cell structure, classification
      basics; no prerequisites)
- [x] Bacterial growth and metabolism (the bacterial growth curve, aerobic
      vs. anaerobic metabolism; prerequisite:
      bacterial-structure-and-classification; formalised the exponential
      growth-curve relationship, N = N0 * 2^(t/td), as a formula + problem
      template + error model)
- [x] Viral structure and replication (virus structure, the lytic vs.
      lysogenic cycle, why viruses sit outside the standard definition of a
      living cell; no prerequisites; kept conceptual)
- [x] Fungal and parasitic pathogens (fungi and parasites as a distinct
      pathogen category from bacteria/viruses — basic classification and
      disease mechanisms; no prerequisites; kept conceptual)
- [x] Antimicrobial mechanisms and resistance (how antibiotics work — cell
      wall synthesis inhibitors, protein synthesis inhibitors, and the
      mechanisms by which bacteria evolve resistance to each; prerequisite:
      bacterial-structure-and-classification; kept conceptual)
- [x] Host-pathogen interactions and virulence (virulence factors,
      mechanisms of pathogenesis, colonization vs. infection; no
      prerequisites; kept conceptual)

Module complete: 6 microbiology concepts. Added two new glossary terms for
the growth-curve formula (`population-size`, `doubling-time`); every other
symbol reused an existing `time` entry. `npm run validate:content`,
`npm run lint:terminology`, and `npm run typecheck` all pass as of this
module's last commit; every resource URL verified live with `curl`. One
concept (`fungal-and-parasitic-pathogens`) combines two related topics under
one Wikipedia resource pair (fungal disease specifically) rather than
splitting into two concepts, since the shared "eukaryotic pathogen, harder
drug target" thread ties them together as one coherent idea.

---
