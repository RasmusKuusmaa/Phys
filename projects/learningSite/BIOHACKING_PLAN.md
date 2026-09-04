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

- [ ] Evidence hierarchy and critical evaluation of health claims
      (randomized controlled trials vs. observational studies vs. anecdote;
      publication bias, confounding, regression to the mean — the
      scientific-literacy foundation every other concept in this subject
      leans on; no prerequisites)
- [ ] Circadian rhythm and light-based optimization (the suprachiasmatic
      clock, light exposure timing, melatonin, jet lag and shift work; no
      prerequisites)
- [ ] Sleep science and sleep optimization (sleep stages and architecture,
      sleep debt, common sleep-hacking claims vs. the evidence — e.g.
      polyphasic sleep; prerequisite: circadian-rhythm-and-light-based-
      optimization)
- [ ] Nutrition science and metabolic self-experimentation (macronutrients
      and caloric balance, intermittent fasting and ketogenic-diet evidence,
      common nutrition myths; no prerequisites)
- [ ] Exercise physiology and performance optimization (VO2 max, training
      adaptations, HIIT vs. steady-state evidence, overtraining; no
      prerequisites)
- [ ] Quantified-self methodology and biosensors (wearables — heart rate
      variability, continuous glucose monitoring; what a biomarker actually
      tells you; n-of-1 self-experiment design pitfalls; prerequisite:
      evidence-hierarchy-and-critical-evaluation-of-health-claims)

## Phase BH2 — intermediate (the more specialised, more claim-heavy
## self-experimentation domains)

- [ ] Nootropics and cognitive enhancement pharmacology (mechanisms of
      caffeine, L-theanine, racetams, modafinil; evidence quality and the
      unregulated-supplement risk; prerequisite: evidence-hierarchy-and-
      critical-evaluation-of-health-claims)
- [ ] Hormesis and stress adaptation (cold exposure, heat/sauna, fasting
      stress — the dose-response idea that a mild stressor can trigger a
      net-beneficial adaptive response; no prerequisites)
- [ ] Gut microbiome and self-experimentation (microbiome composition and
      function, probiotics/prebiotics evidence, fecal-transplant and
      microbiome-testing claims; no prerequisites)
- [ ] Personal genomics and genetic self-testing (direct-to-consumer
      genetic testing, polygenic risk scores, common misinterpretation of
      raw genotype data; prerequisite: evidence-hierarchy-and-critical-
      evaluation-of-health-claims)
- [ ] Hormonal optimization and endocrine self-experimentation (testosterone
      and thyroid self-optimization claims and their evidence base, at the
      applied claim-evaluation depth this subject needs — deep endocrine
      mechanism is `MEDICINE_PLAN.md`'s to own; no prerequisites)

## Phase BH3 — closing/advanced pass

- [ ] Epigenetics and lifestyle interventions (how diet, exercise, and
      stress can modify gene expression without changing DNA sequence, and
      the gap between that real mechanism and inflated popular claims about
      it; L3)
- [ ] DIY biology and citizen-science ethics (garage/community biolabs,
      self-experimentation with CRISPR, biosafety and ethical
      considerations; L2)
- [ ] Longevity science and biomarkers of aging (biological vs.
      chronological age, cellular senescence, the caloric-restriction/
      rapamycin/metformin research literature and what it does and doesn't
      show; L3)
- [ ] Regulatory and safety considerations in self-experimentation
      (supplement regulation — or its absence — drug interactions, risks of
      unregulated peptides and SARMs; L2)

---
