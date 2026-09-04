# Biohacking content plan

New subject, per the user's explicit instruction to build biohacking next,
followed by medicine (`MEDICINE_PLAN.md`). Same content model, same schema,
same workflow as every prior subject — this file tracks the biohacking
phase.

Baseline: `content/biohacking/` does not exist yet — greenfield.

## Scope and framing

"Biohacking" in popular usage ranges from genuinely evidence-based applied
physiology (sleep hygiene, structured fasting protocols, VO2max training)
to unregulated self-experimentation with real risk (unlicensed peptides,
DIY gene editing) to outright pseudoscience. This subject treats biohacking
as **the science and methodology of self-directed biological
experimentation and optimization** — what a critical, scientifically
literate person actually needs to know to evaluate a biohacking claim or
protocol, not an uncritical how-to guide. This is a strong fit for the
site's existing misconceptions-first pedagogy: the field is unusually rich
in plausible-sounding wrong beliefs (polyphasic sleep, detox claims,
supplement mega-dosing) that a learner needs corrected, not just supplied
with facts.

Checked overlap before drafting the concept list: chemistry's
`biochemistry` module (amino acids/protein structure, enzyme kinetics,
nucleic acid structure) covers molecular-level biochemistry, not applied
human physiology or self-experimentation methodology. Materials-science's
`biomaterials` concept covers materials engineering for implants/medical
devices, an unrelated angle. Nothing in physics or chemistry covers human
physiology, endocrinology, or experimental-design methodology as applied to
n-of-1 self-experiments. `MEDICINE_PLAN.md` (the next subject) will cover
the deep mechanistic physiology/endocrinology/pharmacology this subject only
needs at an applied, evaluate-a-claim depth — biohacking concepts should
stay at that applied layer and not attempt to re-teach mechanism medicine
will own.

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (most of this subject is evidence-evaluation and
mechanism reasoning, not plug-into-a-formula, similar to materials-science's
and aerospace-engineering's early phases).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase BH1 — foundational (scientific-literacy core: how to evaluate a
## health claim, plus the best-evidenced self-experimentation domains —
## circadian biology, sleep, nutrition, exercise, biosensors)

Single module for now (`biohacking-fundamentals`), same one-module-through-
later-phases pattern every new subject on this site has started with.

- [x] Evidence hierarchy and critical evaluation of health claims
      (randomized controlled trials vs. observational studies vs. anecdote;
      publication bias, confounding, regression to the mean — the
      scientific-literacy foundation every other concept in this subject
      leans on; no prerequisites)
- [x] Circadian rhythm and light-based optimization (the suprachiasmatic
      clock, light exposure timing, melatonin, jet lag and shift work; no
      prerequisites)
- [x] Sleep science and sleep optimization (sleep stages and architecture,
      sleep debt, common sleep-hacking claims vs. the evidence — e.g.
      polyphasic sleep; prerequisite: circadian-rhythm-and-light-based-
      optimization)
- [x] Nutrition science and metabolic self-experimentation (macronutrients
      and caloric balance, intermittent fasting and ketogenic-diet evidence,
      common nutrition myths; no prerequisites)
- [x] Exercise physiology and performance optimization (VO2 max, training
      adaptations, HIIT vs. steady-state evidence, overtraining; no
      prerequisites)
- [x] Quantified-self methodology and biosensors (wearables — heart rate
      variability, continuous glucose monitoring; what a biomarker actually
      tells you; n-of-1 self-experiment design pitfalls; prerequisite:
      evidence-hierarchy-and-critical-evaluation-of-health-claims)

Phase BH1 complete: 6 biohacking concepts. None needed a formula — this
phase's content is evidence-evaluation and mechanism reasoning throughout,
same balance most subjects' first phase strikes. `npm run validate:content`,
`npm run lint:terminology`, and `npm run typecheck` all pass; every one of
the 12 resource URLs (6 concepts × 2 locales) individually curl-verified
live (200). Two Estonian resources are honest close matches rather than
exact-topic matches, since Estonian Wikipedia has no dedicated article:
`exercise-physiology-and-performance-optimization` and
`quantified-self-methodology-and-biosensors` both link to "Autonoomne
närvisüsteem" (autonomic nervous system) instead of nonexistent dedicated
overtraining/HRV articles, and `nutrition-science-and-metabolic-self-
experimentation` links to "Paastumine" (fasting generally) instead of a
nonexistent intermittent-fasting-specific article — same kind of adjustment
prior phases on other subjects have recorded. Estonian terminology for this
entirely new biological domain was coined following the glossary's existing
compounding patterns with no prior domain precedent to check against (no
biology/physiology terms existed in the glossary before this phase) —
flagging for a native-speaker/domain-expert review pass, same standing
caveat every new-vocabulary phase on this site carries.

## Phase BH2 — intermediate (the more specialised, more claim-heavy
## self-experimentation domains)

- [x] Nootropics and cognitive enhancement pharmacology (mechanisms of
      caffeine, L-theanine, racetams, modafinil; evidence quality and the
      unregulated-supplement risk; prerequisite: evidence-hierarchy-and-
      critical-evaluation-of-health-claims; kept conceptual)
- [x] Hormesis and stress adaptation (cold exposure, heat/sauna, fasting
      stress — the dose-response idea that a mild stressor can trigger a
      net-beneficial adaptive response; no prerequisites; kept conceptual)
- [x] Gut microbiome and self-experimentation (microbiome composition and
      function, probiotics/prebiotics evidence, fecal-transplant and
      microbiome-testing claims; no prerequisites; kept conceptual)
- [x] Personal genomics and genetic self-testing (direct-to-consumer
      genetic testing, polygenic risk scores, common misinterpretation of
      raw genotype data; prerequisite: evidence-hierarchy-and-critical-
      evaluation-of-health-claims; kept conceptual)
- [x] Hormonal optimization and endocrine self-experimentation (testosterone
      and thyroid self-optimization claims and their evidence base, at the
      applied claim-evaluation depth this subject needs — deep endocrine
      mechanism is `MEDICINE_PLAN.md`'s to own; no prerequisites; kept
      conceptual)

Phase BH2 complete: 11 biohacking concepts total (5 new Phase-BH2 concepts
on top of the 6-concept Phase BH1 baseline). None needed a formula — this
phase, like BH1, is evidence-evaluation and mechanism reasoning throughout.
Authored directly rather than via a fork, running alongside two parallel
medicine-subject forks. `npm run validate:content` (9 subjects, 540
concepts), `npm run lint:terminology` (254 glossary terms — no new
biohacking-specific terms needed since nothing here is a formula symbol),
and `npm run typecheck` all pass; every resource URL verified live with
`curl`. Two Estonian resources are honest close/adjacent matches: Estonian
Wikipedia has no "Nootroopikum" article, so `nootropics-and-cognitive-
enhancement-pharmacology` links to "Kofeiin" (caffeine, the concept's
best-evidenced example) instead; and no "Hormees" article either, so
`hormesis-and-stress-adaptation` links to "Arndti-Schulzi reegel"
(Arndt-Schulz rule — the historical toxicological name for the same
dose-response principle), which is in fact a closer terminological match
than a direct translation would have been.

## Phase BH3 — closing/advanced pass

- [x] Epigenetics and lifestyle interventions (how diet, exercise, and
      stress can modify gene expression without changing DNA sequence, and
      the gap between that real mechanism and inflated popular claims about
      it; L3; kept conceptual)
- [x] DIY biology and citizen-science ethics (garage/community biolabs,
      self-experimentation with CRISPR, biosafety and ethical
      considerations; L2; kept conceptual)
- [x] Longevity science and biomarkers of aging (biological vs.
      chronological age, cellular senescence, the caloric-restriction/
      rapamycin/metformin research literature and what it does and doesn't
      show; L3; kept conceptual)
- [x] Regulatory and safety considerations in self-experimentation
      (supplement regulation — or its absence — drug interactions, risks of
      unregulated peptides and SARMs; L2; kept conceptual)

Phase BH3 complete: 15 biohacking concepts total (4 new Phase-BH3 concepts
on top of the 11-concept Phase BH1+BH2 baseline). Authored directly rather
than via a fork, running alongside two parallel medicine-subject forks.
None needed a formula — the whole subject has stayed evidence-evaluation
and mechanism reasoning throughout, appropriately for a subject about
critically evaluating claims rather than computing quantities. `npm run
validate:content` (9 subjects, 546 concepts), `npm run lint:terminology`
(254 glossary terms), `npm run typecheck`, and the full test suite
(150/150) all pass; every resource URL verified live with `curl`. Two
Estonian resources are honest adjacent matches rather than exact-topic
matches, since Estonian Wikipedia has no dedicated article: `diy-biology-
and-citizen-science-ethics` links to "CRISPR" (the concept's central
technology) instead of a nonexistent DIY-biology article, and `regulatory-
and-safety-considerations-in-self-experimentation` links to "Ravim"
(medication — the regulatory contrast case the concept explains) instead of
a nonexistent dedicated dietary-supplement-regulation article.

## Biohacking judged comprehensive

Same reasoning as the physics, mathematics, chemistry, materials-science,
aerospace-engineering, and general-engineering calls before it. Three
phases (BH1: evidence literacy plus the five best-evidenced self-
experimentation domains; BH2: five more specialised, claim-heavy domains;
BH3: epigenetics, DIY biology/CRISPR ethics, longevity science, and
regulatory/safety considerations) cover the standard biohacking-community
topic list at the applied, claim-evaluation depth this subject's framing
committed to from the start — deeper mechanistic depth (endocrinology,
molecular genetics, cell biology) is `MEDICINE_PLAN.md`'s to own, per this
file's own opening framing, so extending biohacking itself further would
mean either padding with marginal claim-evaluation topics or duplicating
medicine's mechanism-level content under a different label, neither of
which is a genuine gap. Same standing caveats as every prior subject: not a
claim that zero further biohacking content could ever be added, and the
Estonian biology/physiology terminology this subject introduced (the first
biology-domain vocabulary in this repo's glossary-adjacent usage) has not
been through a native-speaker review pass.

---
