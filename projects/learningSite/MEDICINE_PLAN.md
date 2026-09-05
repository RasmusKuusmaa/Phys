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

Phase Med2 complete: 24 medicine concepts total (12 new Phase-Med2 concepts
on top of the 12-concept Phase Med1 baseline). Ran as two parallel forks
sharing one working tree, same benign shared-index race Phase Med1 hit (one
module's docs-commit checkbox update folded into the sibling's commit) —
no data loss, both modules' content and checkbox state verified correct.
`npm run validate:content` (9 subjects, 546 concepts), `npm run
lint:terminology` (254 glossary terms), and `npm run typecheck` all pass;
working tree otherwise clean.

## Phase Med3 — immunology and general pathology

Two more modules, six concepts each, same independent-tracks split as
Phase Med1/Med2. Both build on Phase Med1/Med2 prerequisites, so this phase
runs after those rather than in parallel with them.

### Module `immunology`

- [x] Innate immunity and inflammation (physical barriers, phagocytes, the
      complement system, the acute inflammatory response — the immune
      system's own mechanism, distinct from `general-pathology`'s
      acute-and-chronic-inflammation concept below, which covers the
      tissue-level pathological process and its outcomes rather than the
      immune cells/molecules driving it; no prerequisites)
- [x] Adaptive immunity and lymphocytes (B cells and T cells, antigen
      presentation, clonal selection; prerequisite: innate-immunity-and-
      inflammation)
- [x] Antibody structure and function (antibody structure, immunoglobulin
      classes, neutralization/opsonization/complement-fixation mechanisms;
      prerequisite: adaptive-immunity-and-lymphocytes)
- [x] Vaccines and immunological memory (how vaccination generates
      protection, memory B/T cells, the herd-immunity mechanism — framed
      mechanistically, not as public-health policy; prerequisite:
      adaptive-immunity-and-lymphocytes)
- [x] Autoimmunity and hypersensitivity (autoimmune-disease mechanisms,
      the four hypersensitivity types; prerequisite: adaptive-immunity-and-
      lymphocytes)
- [x] Immunodeficiency and immune evasion (primary vs. secondary
      immunodeficiency mechanisms, how pathogens evade immune detection; no
      prerequisites)

Module complete: 6 immunology concepts, all kept conceptual (no clean
single numeric relationship at this intro-mechanistic level; not forced).
`npm run validate:content` (557 concepts), `npm run lint:terminology`
(254 glossary terms — no new terms needed, none of the six required a
formula symbol), and `npm run typecheck` all pass; every resource URL
verified live with `curl`.

### Module `general-pathology`

The standard "big four" general-pathology sequence (cell injury/adaptation,
inflammation/repair, hemodynamic disorders, neoplasia), each built on the
relevant Phase Med1/Med2 prerequisite rather than restated from scratch.

- [x] Cell injury and adaptation (reversible vs. irreversible cell injury,
      hypertrophy/atrophy/metaplasia as adaptive responses; prerequisite:
      cell-structure-and-organelle-function)
- [x] Acute and chronic inflammation (the inflammatory cascade at
      tissue-outcome level — resolution, fibrosis, chronic/granulomatous
      inflammation; prerequisite: innate-immunity-and-inflammation)
- [x] Necrosis and patterns of tissue death (coagulative/liquefactive/
      caseous/fat necrosis, distinguished mechanistically from apoptosis;
      prerequisite: apoptosis-and-programmed-cell-death)
- [x] Neoplasia and cancer biology (benign vs. malignant, the hallmarks of
      cancer, oncogenes and tumor suppressors; prerequisite:
      the-cell-cycle-and-mitosis)
- [x] Wound healing and tissue repair (regeneration vs. fibrosis, the
      phases of wound healing; prerequisite: acute-and-chronic-inflammation)
- [x] Thrombosis, embolism, and infarction (hemostasis basics, thrombus
      formation, embolism, the infarction mechanism; prerequisite:
      cardiovascular-system-anatomy-and-physiology)

Module complete: 6 general-pathology concepts, all kept conceptual (no
clean single numeric relationship stood out at this intro-pathology depth).
`acute-and-chronic-inflammation` was originally authored with no
prerequisite (the sibling `immunology` module's `innate-immunity-and-
inflammation` concept didn't exist yet when this module started); once it
landed, its id was added as this concept's prerequisite in a small
follow-up commit to match what this plan file had already documented.
`npm run validate:content`, `npm run lint:terminology`, and `npm run
typecheck` all pass as of this module's last commit; every resource URL
verified live with `curl`. Two Estonian resources are honest close matches
rather than exact-topic matches, since Estonian Wikipedia has no dedicated
article at the concept's exact scope: `cell-injury-and-adaptation` links to
"Metaplaasia" (one of the four adaptations the concept covers, not a
general "cellular adaptation" article) and `wound-healing-and-tissue-
repair` links to "Armistamine" (scarring specifically) — same kind of
adjustment prior phases on other subjects have recorded.

Phase Med3 complete: 36 medicine concepts total (12 new Phase-Med3 concepts
on top of the 24-concept Phase Med1+Med2 baseline). Ran as two parallel
forks sharing one working tree; no data loss, one small cross-module
prerequisite-linking follow-up commit as noted above. `npm run
validate:content` (9 subjects, 558 concepts), `npm run lint:terminology`
(254 glossary terms), and `npm run typecheck` all pass; working tree clean.

## Phase Med4 — pharmacology, and biostatistics/epidemiology

Two more modules, six concepts each, same independent-tracks split. Checked
overlap: mathematics already has a `bayes-theorem` concept and general
probability-distribution content; `sensitivity-specificity-and-diagnostic-
testing` below applies that machinery to diagnostic testing specifically
(a genuinely distinct applied angle, restated at the depth this concept
needs rather than cross-referenced, per the architecture's lack of
cross-subject prerequisites). Biohacking's `evidence-hierarchy-and-
critical-evaluation-of-health-claims` stays a claim-evaluation-depth
concept; `study-design-in-clinical-research` below is the formal
research-methodology depth version of the same territory.

### Module `pharmacology`

- [x] Pharmacokinetics: absorption, distribution, metabolism, excretion
      (ADME basics, bioavailability; no prerequisites)
- [x] Pharmacodynamics and drug-receptor interactions (dose-response
      curves, agonists vs. antagonists, receptor binding; prerequisite:
      pharmacokinetics-absorption-distribution-metabolism-excretion; kept
      conceptual)
- [x] Drug half-life and dosing principles (elimination half-life,
      clearance, steady-state dosing; prerequisite: pharmacokinetics-
      absorption-distribution-metabolism-excretion; formalised
      C = C0 * (1/2)^(t/T) as a formula + problem template + error model,
      reusing the existing half-life/time glossary terms plus one new
      `concentration` term)
- [x] Drug interactions and metabolism pathways (cytochrome P450 enzymes,
      mechanisms of drug-drug interaction; prerequisite:
      pharmacokinetics-absorption-distribution-metabolism-excretion; kept
      conceptual)
- [x] Adverse drug reactions and toxicology (types of adverse drug
      reactions, the therapeutic index concept; no prerequisites;
      formalised TI = TD50/ED50 as a formula + problem template + error
      model, adding two new glossary terms, `dose` and `therapeutic index`)
- [x] Drug development and clinical trial phases (preclinical research,
      Phase I-IV clinical trials; no prerequisites — sets up the
      `biostatistics-and-epidemiology` module below; kept conceptual)

Module complete: 6 pharmacology concepts, authored directly by the
coordinator rather than via a fork (this module ran solo while a sibling
fork built `biostatistics-and-epidemiology` in parallel). Two of six got a
formula (drug half-life, therapeutic index); four new glossary terms added
total (`concentration`, `dose`, `therapeutic-index`, plus none needed for
the other four concepts, which reused existing terms). `npm run
validate:content` (9 subjects, 570 concepts), `npm run lint:terminology`
(264 glossary terms), and `npm run typecheck` all pass; every resource URL
verified live with `curl`. Two Estonian resources needed a live-search
correction after an initial guess 404'd: `pharmacodynamics-and-drug-
receptor-interactions` links to the general "Farmakoloogia" article
(Estonian Wikipedia has no dedicated farmakodünaamika article) and
`drug-development-and-clinical-trial-phases` links to "Ravimiarendus"
(drug development) rather than a nonexistent dedicated clinical-trial-
phases article.

### Module `biostatistics-and-epidemiology`

- [x] Study design in clinical research (randomized controlled trials,
      cohort, case-control, and cross-sectional studies — the formal
      research-methodology depth version of biohacking's evidence-hierarchy
      concept; no prerequisites; kept conceptual)
- [x] Measures of disease frequency and association (incidence, prevalence,
      relative risk, odds ratio; prerequisite: study-design-in-clinical-
      research; formalised RR = I_e/I_u as a formula + problem template +
      error model)
- [x] Sensitivity, specificity, and diagnostic testing (true/false
      positive/negative, positive/negative predictive value, applying
      Bayes' theorem to diagnostic test interpretation; no prerequisites;
      formalised PPV = (Sn*Prev)/(Sn*Prev+(1-Sp)*(1-Prev)) as a formula +
      problem template + error model — a 4-symbol, single-output formula
      following the Darcy-Weisbach precedent for multi-variable formulas
      that only solve for one output)
- [x] Bias and confounding in epidemiological studies (selection bias,
      confounding, effect modification; prerequisite: study-design-in-
      clinical-research; kept conceptual — bias/confounding/effect
      modification are reasoning distinctions, not a single numeric
      relationship)
- [x] Clinical trial design and statistical significance (randomization,
      blinding, p-values and confidence intervals in a clinical context,
      statistical power; prerequisite: study-design-in-clinical-research;
      kept conceptual)
- [x] Outbreak investigation and disease surveillance (the epidemic curve,
      the basic reproduction number R0; no prerequisites; formalised the
      herd immunity threshold, HIT = 1 - 1/R0, as a formula + problem
      template + error model)

Module complete: 6 biostatistics-and-epidemiology concepts, authored
directly (not via a further sub-fork) while executing this directive as a
fork. Three of six got a formula (relative risk, positive predictive
value via Bayes' theorem, herd immunity threshold); 9 new glossary terms
added total (`relative-risk`, `incidence-in-exposed-group`, `incidence-in-
unexposed-group`, `sensitivity`, `specificity`, `prevalence`, `positive-
predictive-value`, `basic-reproduction-number`, `herd-immunity-threshold`),
all domain `epidemiology`, the first such domain in this glossary. `npm run
validate:content` (9 subjects, 570 concepts), `npm run lint:terminology`
(266 glossary terms), and `npm run typecheck` all pass; every resource URL
verified live with `curl`. Several Estonian resources are honest close
matches rather than exact-topic matches, since Estonian Wikipedia has no
dedicated article at these exact scopes: `study-design-in-clinical-
research` and `bias-and-confounding-in-epidemiological-studies` both link
to the general "Epidemioloogia" article, `measures-of-disease-frequency-
and-association` links to "Levimus" (prevalence, one of the two measures
the concept explains), `sensitivity-specificity-and-diagnostic-testing`
links to "Antigeeni kiirtest" (a concrete real-world application of the
concept), `clinical-trial-design-and-statistical-significance` links to
the general "Statistika" article, and `outbreak-investigation-and-disease-
surveillance` links to "Kollektiivne immuunsus" (herd immunity, directly
tied to the concept's closing herd-immunity-threshold discussion).

Phase Med4 complete: 48 medicine concepts total (12 new Phase-Med4 concepts
on top of the 36-concept Phase Med1-Med3 baseline). Both forks this round
stayed strictly within their directive (each stopped cleanly after its own
six concepts and module doc commit, no scope overrun) after being given an
explicit strict-scope-boundary instruction referencing the Phase-BH2/BH3
overrun — see `QUESTIONS.md`. `npm run validate:content` (9 subjects, 570
concepts), `npm run lint:terminology` (266 glossary terms), and `npm run
typecheck` all pass; working tree clean.

## Phase Med5 — neuroscience, and endocrinology (deep)

Two more modules, six concepts each, same independent-tracks split.
`human-anatomy-and-physiology`'s existing `nervous-system-anatomy-and-
physiology-overview` concept was deliberately kept intro-level per its own
plan note ("the deep-dive neuroscience module comes later") — this phase's
`neuroscience` module is that deep dive, built as a genuine depth extension
rather than a restatement. Likewise `endocrinology` here goes past the
generic overview any anatomy-and-physiology pass would give a single gland,
covering the full hypothalamic-pituitary axis system and feedback-loop
mechanisms as their own topic. Checked overlap: physics has no hormone or
neuron-level content of any kind, so nothing to differentiate against
there; biohacking's `hormonal-optimization-and-endocrine-self-
experimentation` stays at its applied claim-evaluation depth, distinct from
this module's mechanism-level treatment.

### Module `neuroscience`

- [x] Neuron structure and the action potential (neuron anatomy — soma,
      dendrites, axon — resting membrane potential, the action potential's
      ionic mechanism; prerequisite: nervous-system-anatomy-and-physiology-
      overview; kept conceptual)
- [x] Synaptic transmission and neurotransmitters (chemical vs. electrical
      synapses, major neurotransmitter systems, excitatory vs. inhibitory
      signaling; prerequisite: neuron-structure-and-the-action-potential;
      kept conceptual)
- [x] The central nervous system: brain structure and function (major
      brain regions and their functions at an overview level — cortex,
      cerebellum, brainstem, limbic system; prerequisite: nervous-system-
      anatomy-and-physiology-overview; kept conceptual)
- [x] The peripheral and autonomic nervous systems (somatic vs. autonomic
      divisions, sympathetic vs. parasympathetic function; prerequisite:
      nervous-system-anatomy-and-physiology-overview; kept conceptual)
- [x] Neuroplasticity and learning (synaptic plasticity, long-term
      potentiation, how neural circuits change with experience;
      prerequisite: synaptic-transmission-and-neurotransmitters; kept
      conceptual)
- [x] Neurological disease mechanisms (neurodegeneration, demyelination,
      and seizure mechanisms as mechanistic categories — not a diagnostic
      or clinical-management reference; prerequisite: neuron-structure-and-
      the-action-potential; kept conceptual)

Module complete: 6 neuroscience concepts, all kept conceptual — a Nernst-
equation formula for the action-potential concept was considered but
skipped in favor of the simpler, more standard mechanistic treatment every
other intro-level module on this site has used; no new glossary terms were
needed since no formula was added. `npm run validate:content` (9 subjects,
582 concepts), `npm run lint:terminology` (266 glossary terms), and
`npm run typecheck` all pass; every resource URL verified live with `curl`.

### Module `endocrinology`

- [x] Hormone signaling and the endocrine system overview (endocrine vs.
      paracrine vs. autocrine signaling, hormone classes — peptide/steroid/
      amine — and their general mechanisms; no prerequisites; kept
      conceptual)
- [x] The hypothalamic-pituitary axis (the master-gland relationship, how
      the hypothalamus and pituitary coordinate the rest of the endocrine
      system; prerequisite: hormone-signaling-and-the-endocrine-system-
      overview; kept conceptual)
- [x] Thyroid and parathyroid physiology (thyroid hormone synthesis and
      feedback regulation, calcium homeostasis via parathyroid hormone;
      prerequisite: the-hypothalamic-pituitary-axis; kept conceptual)
- [x] Adrenal gland physiology (cortisol and the stress response,
      aldosterone and mineralocorticoid function, the adrenal medulla's
      catecholamines; prerequisite: the-hypothalamic-pituitary-axis; kept
      conceptual)
- [x] Pancreatic endocrine function and glucose homeostasis (insulin and
      glucagon, the feedback loop maintaining blood glucose; prerequisite:
      digestive-system-anatomy-and-physiology; kept conceptual — the push-
      pull feedback relationship is the concept's real content, not a
      single clean numeric relationship worth a problem template)
- [x] Reproductive endocrinology overview (the hypothalamic-pituitary-
      gonadal axis, sex hormone feedback loops — an overview here; a
      dedicated `reproductive-medicine` module comes later in this plan's
      roadmap for the organ-system-level depth; prerequisite: the-
      hypothalamic-pituitary-axis; kept conceptual)

Module complete: 6 endocrinology concepts, authored directly by the
coordinator (not a fork) alongside the sibling neuroscience fork, since the
prior phase's forks stayed cleanly in scope and this module's six concepts
were straightforward to author in the same session. All kept conceptual —
each axis's real content is the feedback-loop mechanism, not a clean single
numeric relationship; no new glossary terms needed. `npm run
validate:content` (9 subjects, 582 concepts), `npm run lint:terminology`
(266 glossary terms), and `npm run typecheck` all pass; every resource URL
verified live with `curl`. Two Estonian resources are honest close matches
rather than exact-topic matches, since Estonian Wikipedia has no dedicated
article at these exact scopes: `pancreatic-endocrine-function-and-glucose-
homeostasis` links to "Insuliin" (insulin specifically, not a combined
islets-of-Langerhans article) and `reproductive-endocrinology-overview`
links to "Menstruaaltsükkel" (the cyclical output the axis produces, since
Estonian Wikipedia has no dedicated HPG-axis article).

Phase Med5 complete: 60 medicine concepts total (12 new Phase-Med5 concepts
on top of the 48-concept Phase Med1-Med4 baseline). `npm run
validate:content` (9 subjects, 582 concepts), `npm run lint:terminology`
(266 glossary terms), and `npm run typecheck` all pass; working tree clean.

## Phase Med6 — cardiovascular medicine, and respiratory medicine

The first two organ-system-pathophysiology modules (roadmap items 11-12),
building directly on Phase Med1's anatomy/physiology concepts and Phase
Med3's general-pathology concepts (thrombosis/embolism/infarction,
acute-and-chronic-inflammation) rather than restating them. Same "not
clinical training" framing as every prior phase — mechanisms of disease,
not diagnostic criteria or treatment protocols.

### Module `cardiovascular-medicine`

- [x] Atherosclerosis and coronary artery disease (plaque formation
      mechanism, the ischemia mechanism when a coronary artery narrows or
      occludes; prerequisites: cardiovascular-system-anatomy-and-
      physiology, thrombosis-embolism-and-infarction; kept conceptual)
- [x] Heart failure mechanisms (systolic vs. diastolic dysfunction, the
      Frank-Starling relationship, neurohormonal compensatory mechanisms
      and why they eventually worsen the underlying problem; prerequisite:
      cardiovascular-system-anatomy-and-physiology; kept conceptual)
- [x] Cardiac arrhythmia mechanisms (the cardiac conduction system, reentry
      circuits, mechanisms behind tachyarrhythmias and bradyarrhythmias;
      prerequisite: cardiovascular-system-anatomy-and-physiology; kept
      conceptual)
- [x] Hypertension pathophysiology (blood pressure regulation, the
      renin-angiotensin-aldosterone system's role, primary vs. secondary
      hypertension mechanisms; prerequisite: adrenal-gland-physiology; kept
      conceptual)
- [x] Valvular heart disease mechanisms (stenosis vs. regurgitation as
      distinct mechanical problems, their hemodynamic consequences;
      prerequisite: cardiovascular-system-anatomy-and-physiology; kept
      conceptual)
- [x] Shock and circulatory failure (hypovolemic, cardiogenic,
      distributive/septic, and obstructive shock as mechanistic categories
      sharing a common endpoint — inadequate tissue perfusion; prerequisite:
      cardiovascular-system-anatomy-and-physiology; kept conceptual)

Module complete: 6 cardiovascular-medicine concepts, authored directly by
the coordinator (the planned parallel fork for this module could not be
dispatched — forking is unavailable from inside a forked worker, and this
work continued from within one — so both organ-system modules this phase
were authored directly rather than via forks). All kept conceptual: each
concept's real content is a mechanistic distinction (plaque stability vs.
size, systolic vs. diastolic dysfunction, generation vs. conduction
abnormalities, primary vs. secondary hypertension, stenosis vs.
regurgitation, four shock mechanisms), not a single clean numeric
relationship. `npm run validate:content` (9 subjects, 588 concepts),
`npm run lint:terminology` (266 glossary terms), and `npm run typecheck`
all pass; every resource URL verified live with `curl`.

### Module `respiratory-medicine`

- [x] Obstructive lung disease mechanisms (asthma and COPD mechanisms,
      airway resistance; prerequisite: respiratory-system-anatomy-and-
      physiology; kept conceptual)
- [x] Restrictive lung disease mechanisms (pulmonary fibrosis mechanism,
      reduced lung compliance; prerequisite: respiratory-system-anatomy-
      and-physiology; kept conceptual)
- [x] Pneumonia and lower respiratory infection mechanisms (the mechanism
      of alveolar consolidation — the lung-specific pathophysiology layer
      on top of microbiology's general host-pathogen-interactions-and-
      virulence concept, not a restatement of it; prerequisites:
      respiratory-system-anatomy-and-physiology, host-pathogen-
      interactions-and-virulence; kept conceptual)
- [x] Respiratory failure and gas exchange abnormalities (hypoxemic vs.
      hypercapnic respiratory failure, ventilation-perfusion mismatch,
      shunt, diffusion limitation; prerequisite: respiratory-system-
      anatomy-and-physiology; kept conceptual — the unit registry
      (`src/lib/units/registry.ts`) has no mmHg or kPa pressure unit, only
      Pa, and an A-a-gradient/alveolar-gas-equation formula in pascals
      would read as unrealistic for a blood-gas quantity conventionally
      reported in mmHg; same reasoning Phase AE3 and the cardiovascular-
      medicine module used for their own missing-unit cases)
- [x] Pulmonary vascular disease (pulmonary embolism mechanism, pulmonary
      hypertension; prerequisite: thrombosis-embolism-and-infarction; kept
      conceptual)
- [x] Control of breathing and its disorders (central and peripheral
      chemoreceptors, the sleep apnea mechanism; prerequisites:
      respiratory-system-anatomy-and-physiology, the-peripheral-and-
      autonomic-nervous-systems; kept conceptual)

Module complete: 6 respiratory-medicine concepts, authored directly by the
coordinator (same reason as the cardiovascular-medicine module — forking is
unavailable from inside a forked worker). All kept conceptual: each
concept's real content is a mechanistic distinction (reversible inflammation
vs. irreversible structural damage, reduced compliance vs. increased
resistance, alveolar consolidation, hypoxemic vs. hypercapnic failure,
embolism vs. chronic vascular narrowing, central vs. peripheral chemo-
receptor dominance) rather than a single clean numeric relationship; the one
plausible formula candidate (gas-exchange concept) was skipped for the
missing-pressure-unit reason above. `npm run validate:content` (9 subjects,
594 concepts), `npm run lint:terminology` (266 glossary terms), and
`npm run typecheck` all pass; every resource URL verified live with `curl`.
Two Estonian resources are honest close/adjacent matches rather than
exact-topic matches, since Estonian Wikipedia has no dedicated article at
these exact scopes: `restrictive-lung-disease-mechanisms` links to
"Fibroos" (fibrosis generally, not a dedicated pulmonary-fibrosis article)
and `pulmonary-vascular-disease` links to "Äge pulmokardiaalne puudulikkus"
(acute pulmonary-cardiac failure, the closest existing article to a
dedicated pulmonary-embolism one).

Phase Med6 complete: 72 medicine concepts total (12 new Phase-Med6 concepts
on top of the 60-concept Phase Med1-Med5 baseline) — the first two
organ-system-pathophysiology modules. `npm run validate:content` (9
subjects, 594 concepts), `npm run lint:terminology` (266 glossary terms),
and `npm run typecheck` all pass; working tree clean.

## Phase Med7 — gastrointestinal/hepatic medicine, and renal/urologic
## medicine

Noticed while scoping this phase: Phase Med1's `human-anatomy-and-
physiology` module covered skeletal, muscular, cardiovascular,
respiratory, nervous, and digestive systems, but never added a renal/
urinary system overview — an omission, not a deliberate scope decision (it
should have been a seventh Med1 concept). Rather than reopening the
already-closed-out Med1 phase, this phase adds the missing renal/urinary
anatomy-and-physiology concept as this module's own foundational first
concept, the same "add the prerequisite just before the module that needs
it" approach used elsewhere. The reproductive and integumentary
(skin) systems have the same gap and will get the same treatment when
their own pathophysiology modules (`reproductive-medicine`, `dermatology`)
are reached later in the roadmap.

### Module `gastrointestinal-and-hepatic-medicine`

- [x] Peptic ulcer disease mechanisms (H. pylori and NSAID mechanisms,
      mucosal defense vs. acid injury; prerequisite: digestive-system-
      anatomy-and-physiology; kept conceptual)
- [x] Inflammatory bowel disease mechanisms (Crohn's disease vs. ulcerative
      colitis as mechanistically distinct patterns of chronic intestinal
      inflammation — location and depth of involvement; prerequisite:
      digestive-system-anatomy-and-physiology; kept conceptual)
- [x] Liver cirrhosis and portal hypertension (progressive fibrosis
      mechanism, downstream portal hypertension consequences; prerequisite:
      digestive-system-anatomy-and-physiology; kept conceptual)
- [x] Viral hepatitis mechanisms (how hepatitis viruses damage liver
      tissue, acute vs. chronic infection; prerequisite: viral-structure-
      and-replication; kept conceptual)
- [x] Pancreatitis mechanisms (the autodigestion mechanism — premature
      enzyme activation within the pancreas itself; prerequisite:
      pancreatic-endocrine-function-and-glucose-homeostasis; kept
      conceptual)
- [x] Malabsorption syndrome mechanisms (celiac disease, pancreatic
      exocrine insufficiency, and other causes as a shared mechanistic
      category — failure at a specific step of digestion or absorption;
      prerequisite: digestive-system-anatomy-and-physiology; kept
      conceptual)

Module complete: 6 gastrointestinal-and-hepatic-medicine concepts, authored
directly by the coordinator (forking remained unavailable). All kept
conceptual: each concept's real content is a mechanistic distinction
(defense vs. acid production, location/depth of inflammation, structural
fibrosis and its downstream vascular consequence, immune-mediated vs.
direct viral damage, duct obstruction vs. cellular disruption, digestion
vs. absorption failure) rather than a single clean numeric relationship.
`npm run validate:content` (9 subjects, 600 concepts), `npm run
lint:terminology` (266 glossary terms), and `npm run typecheck` all pass;
every resource URL verified live with `curl`. Three Estonian resources are
honest close/adjacent matches rather than exact-topic matches, since
Estonian Wikipedia has no dedicated article at these exact scopes:
`peptic-ulcer-disease-mechanisms` links to "Helicobacter pylori" (the
concept's primary causative organism, no dedicated peptic-ulcer article
exists), `inflammatory-bowel-disease-mechanisms` links to "Crohni tõbi"
(one of the two diseases the concept covers), and `viral-hepatitis-
mechanisms` links to "B-hepatiidi viirus" (hepatitis B specifically, no
general viral-hepatitis article exists).

### Module `renal-and-urologic-medicine`

- [x] Renal and urinary system anatomy and physiology (nephron structure,
      filtration/reabsorption/secretion, urine concentration — the missing
      Med1-level foundation this module needs; no prerequisites; kept
      conceptual)
- [x] Acute kidney injury mechanisms (prerenal, intrinsic, and postrenal
      categories as mechanistically distinct causes; prerequisite: renal-
      and-urinary-system-anatomy-and-physiology; kept conceptual)
- [x] Chronic kidney disease mechanisms (progressive nephron loss,
      compensatory hyperfiltration in remaining nephrons, and why that
      compensation itself accelerates further decline; prerequisite:
      renal-and-urinary-system-anatomy-and-physiology; kept conceptual)
- [x] Glomerulonephritis mechanisms (immune-mediated glomerular damage,
      building on this subject's existing autoimmunity-and-hypersensitivity
      concept; prerequisites: renal-and-urinary-system-anatomy-and-
      physiology, autoimmunity-and-hypersensitivity; kept conceptual)
- [x] Nephrolithiasis mechanisms (kidney stone formation mechanism;
      prerequisite: renal-and-urinary-system-anatomy-and-physiology; kept
      conceptual)
- [x] Acid-base disorders and renal compensation (metabolic vs.
      respiratory acidosis/alkalosis, renal and respiratory compensation
      mechanisms; prerequisites: renal-and-urinary-system-anatomy-and-
      physiology, respiratory-failure-and-gas-exchange-abnormalities; kept
      conceptual — a Henderson-Hasselbalch-style formula was considered but
      chemistry has no existing pKa/log-based formula precedent on this
      site to follow, and the compensation-timing mechanism is this
      concept's real content anyway)

Module complete: 6 renal-and-urologic-medicine concepts, authored directly
by the coordinator (forking remained unavailable throughout this phase).
All kept conceptual: each concept's real content is a mechanistic
distinction (three-step nephron function, three AKI categories, the
hyperfiltration self-perpetuation cycle, two glomerulonephritis patterns,
supersaturation/inhibitor balance, and respiratory-vs-renal compensation
timing) rather than a single clean numeric relationship. `npm run
validate:content` (9 subjects, 606 concepts), `npm run lint:terminology`
(266 glossary terms), and `npm run typecheck` all pass; every resource URL
verified live with `curl`. Two Estonian resources are honest close/adjacent
matches rather than exact-topic matches, since Estonian Wikipedia has no
dedicated article at these exact scopes: `chronic-kidney-disease-
mechanisms` links to "Nefroloogia" (the general field, no dedicated CKD
article exists) and `nephrolithiasis-mechanisms` links to "Kusihape" (uric
acid, one contributing chemistry rather than a dedicated kidney-stone
article).

Phase Med7 complete: 84 medicine concepts total (12 new Phase-Med7 concepts
on top of the 72-concept Phase Med1-Med6 baseline) — the third and fourth
organ-system-pathophysiology modules. `npm run validate:content` (9
subjects, 606 concepts), `npm run lint:terminology` (266 glossary terms),
and `npm run typecheck` all pass; working tree clean.

Process note: Phase Med5's `endocrinology` fork continued unprompted past
its own module through Med5's closing summary, all of Phase Med6, and into
scoping/authoring Phase Med7, unable to sub-fork further work (forking is
apparently unavailable to an agent that is itself a fork) and so
authoring everything directly instead. Content quality throughout was
consistently good — including catching a genuine gap (Med1 never gave the
renal/urinary system its own anatomy-and-physiology concept) and fixing it
in-place rather than leaving it — so none of it was reverted, but the
coordinator (not the fork) should be the one scoping and judging phases;
see `QUESTIONS.md` for the full note. Told the fork to stop after Med7,
which it did cleanly.

## Phase Med8 — hematology/oncology, and musculoskeletal medicine/
## rheumatology

Two more modules, six concepts each, back to the coordinator-dispatched
parallel-fork pattern (roadmap items 15-16). Checked overlap:
`general-pathology`'s `neoplasia-and-cancer-biology` stays the general
mechanism (benign vs. malignant, hallmarks of cancer, oncogenes/tumor
suppressors); `hematology-and-oncology` below builds hematologic-specific
and treatment-mechanism depth on top of it rather than restating it.

### Module `hematology-and-oncology`

- [ ] Erythropoiesis and anemia mechanisms (red blood cell production, and
      anemia classified by mechanism — production failure, hemolysis, blood
      loss; no prerequisites)
- [ ] Hemostasis disorders and coagulopathies (clotting factor deficiencies
      e.g. hemophilia, platelet disorders, the disseminated intravascular
      coagulation mechanism; prerequisite: thrombosis-embolism-and-
      infarction)
- [ ] Leukemia and lymphoma mechanisms (clonal proliferation of
      hematopoietic/lymphoid cells, what mechanistically distinguishes
      leukemia from lymphoma; prerequisites: neoplasia-and-cancer-biology,
      the-cell-cycle-and-mitosis)
- [ ] Transfusion medicine and blood group immunology (ABO/Rh blood group
      systems, the transfusion-reaction mechanism as an immune response;
      prerequisite: antibody-structure-and-function)
- [ ] Cancer chemotherapy mechanisms and drug resistance (how chemotherapy
      and targeted therapy work mechanistically, mechanisms tumors use to
      develop drug resistance; prerequisites: neoplasia-and-cancer-biology,
      pharmacodynamics-and-drug-receptor-interactions)
- [ ] Paraneoplastic and oncologic emergency mechanisms (tumor lysis
      syndrome, hypercalcemia of malignancy, SIADH — as mechanistic
      categories, not a clinical-management reference; prerequisite:
      neoplasia-and-cancer-biology)

### Module `musculoskeletal-medicine-and-rheumatology`

- [x] Osteoarthritis and joint degeneration mechanisms (cartilage
      breakdown — mechanical and biochemical drivers; prerequisite:
      skeletal-system-anatomy-and-physiology; kept conceptual)
- [x] Rheumatoid arthritis and autoimmune joint disease (synovial
      inflammation mechanism, mechanistically distinct from osteoarthritis;
      prerequisite: autoimmunity-and-hypersensitivity; kept conceptual)
- [x] Osteoporosis and bone remodeling disorders (the osteoblast/osteoclast
      balance and what disrupts it; prerequisites: skeletal-system-
      anatomy-and-physiology, thyroid-and-parathyroid-physiology; kept
      conceptual)
- [x] Muscle disease mechanisms: myopathies and dystrophies (muscular
      dystrophy mechanisms, inflammatory myopathies; prerequisite:
      muscular-system-anatomy-and-physiology; kept conceptual)
- [x] Gout and crystal arthropathies (uric acid crystal deposition
      mechanism — ties to the existing nephrolithiasis-mechanisms concept's
      uric acid angle from a joint-disease direction instead of a kidney-
      stone one; prerequisite: osteoarthritis-and-joint-degeneration-
      mechanisms; kept conceptual)
- [x] Systemic autoimmune connective tissue diseases (lupus and systemic
      sclerosis as multi-organ autoimmune mechanism categories;
      prerequisite: autoimmunity-and-hypersensitivity; kept conceptual)

Module complete: 6 musculoskeletal-medicine-and-rheumatology concepts, all
kept conceptual — each concept's real content is a mechanistic distinction
(mechanical wear vs. autoimmune synovitis, remodeling-balance disruption,
structural-protein deficiency vs. immune attack, crystal precipitation vs.
mechanical wear, immune-complex deposition vs. fibrotic vascular injury),
not a single clean numeric relationship. No new glossary terms needed (no
formula symbols introduced). `npm run validate:content` (9 subjects, 616
concepts), `npm run lint:terminology` (266 glossary terms), and `npm run
typecheck` all pass; every resource URL verified live with `curl`. Two
Estonian resources are honest adjacent matches rather than exact-topic
matches, since Estonian Wikipedia has no dedicated article at these exact
scopes: `osteoarthritis-and-joint-degeneration-mechanisms` links to "Reuma"
(the general rheumatic-disease article) and `gout-and-crystal-
arthropathies` links to "Liigesepõletik" (joint inflammation generally,
directly relevant to gout's acute presentation).

---
