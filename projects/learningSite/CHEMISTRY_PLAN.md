# Chemistry content plan

Continuation of `MSC_PHYSICS_PLAN.md` → `MATH_PLAN.md` after mathematics was
judged comprehensive (see that file's closing section and `QUESTIONS.md`).
Same content model, same schema, same workflow — this file tracks the
chemistry-subject phase. Existing baseline: 35 chemistry concepts, bachelor
level (L1-L3) — general chemistry (stoichiometry, bonding, equilibrium,
kinetics, redox, acids/bases, the periodic table), inorganic chemistry
(main-group chemistry, transition metals/coordination compounds,
corrosion), organic chemistry (functional groups, reaction mechanisms,
substitution/addition/elimination, aromaticity, carbonyl and carboxylic
acid chemistry), physical chemistry (rate laws, Arrhenius, catalysis,
phase equilibria, colligative properties, electrochemistry, adsorption,
colloids), analytical chemistry (mass spectrometry, UV-Vis), and one
theoretical-chemistry concept (molecular orbital theory). Zero L4
(graduate) content and zero biochemistry content exist anywhere yet.

## Commit discipline

Identical rule to `MSC_PHYSICS_PLAN.md`/`MATH_PLAN.md`: one commit per
concept, single-line message (`content: add <concept-id>`), no body, no
trailer/signature. Every concept gets the full set — concept, >=3
misconceptions, >=1 item, a resource per locale, EN+ET explanations. Gate
before each commit: `npm run validate:content && npm run lint:terminology`.
Verify every resource URL with a live check before committing.

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase C1 — genuine gaps in the existing bachelor-level baseline

Surveyed all 35 existing concepts first (checked specifically for
stereochemistry, biochemistry, NMR, and quantum-chemistry content — all
four were completely absent). Stereochemistry/chirality is normally taught
at bachelor level alongside the existing organic-chemistry concepts, not
held back for a graduate phase, so it's grouped here rather than in the L4
phase below.

- [x] Stereochemistry and chirality (enantiomers, R/S nomenclature, optical
      activity — a standard bachelor organic-chemistry topic currently
      entirely absent despite nucleophilic-substitution already discussing
      stereochemical outcome in passing)
- [x] NMR spectroscopy (chemical shift, coupling, structure elucidation —
      analytical chemistry currently has mass spectrometry and UV-Vis but
      no NMR at all, a striking gap given NMR's centrality to real organic
      structure determination)

Phase C1 complete: 37 chemistry concepts.

## Phase C2 — graduate-level (L4) chemistry, first pass

Analogous to the physics MSc phase: existing chemistry content caps out at
bachelor level (L1-L3) with zero L4 concepts anywhere. Picking genuine
graduate-level gaps per subfield, same method as the physics MSc phase.

- [x] Quantum chemistry: the Hartree-Fock method and beyond (ab initio
      electronic structure theory, building on the existing
      molecular-orbital-theory-and-hybridisation concept)
- [x] Density functional theory (the practical workhorse of modern
      computational chemistry, distinct from wavefunction-based
      Hartree-Fock)
- [x] Statistical thermodynamics and molecular partition functions —
      note: could not use a physics-subject prerequisite (cross-subject
      prerequisites don't validate, confirmed again this phase), so this
      uses only chemistry-subject prerequisites
- [x] Ligand field theory (the quantum-mechanical successor to the
      existing transition-metals-and-coordination-compounds concept's
      crystal-field-level treatment)
- [x] Pericyclic reactions and the Woodward-Hoffmann rules (a major
      organic-chemistry topic — orbital-symmetry control of reactions like
      the Diels-Alder — entirely absent from the existing mechanism-focused
      organic concepts)

Phase C2 complete: 42 chemistry concepts (5 new L4 concepts on top of the
37-concept Phase C1 baseline).

## Phase C3 — biochemistry (new module, currently zero concepts)

- [x] Amino acids, peptide bonds, and protein primary structure (new
      biochemistry module started)
- [x] Enzyme kinetics and the Michaelis-Menten equation
- [x] Nucleic acid structure and base pairing

Phase C3 complete: 45 chemistry concepts (3-concept biochemistry module
established from zero).

## Phase C4 — final gap check before judging chemistry comprehensive

Quick grep-confirmed survey turned up two more genuine, completely absent
standard topics (checked specifically since they're foundational enough
that their absence was surprising):

- [x] Hess's law and thermochemistry (a foundational general-chemistry
      topic — enthalpy as a state function — with zero prior coverage)
- [x] Chromatography (analytical chemistry had mass spectrometry and
      UV-Vis but no separation techniques at all)

Phase C4 complete: 47 chemistry concepts.

## Chemistry judged comprehensive — pivoting to materials-science

Same reasoning and same depth target as the physics and mathematics calls
(see `QUESTIONS.md`). After Phase C1 (bachelor-level gaps: stereochemistry,
NMR), Phase C2 (5 new L4 concepts: quantum chemistry, DFT, statistical
thermodynamics, ligand field theory, pericyclic reactions), Phase C3 (a
new 3-concept biochemistry module), and Phase C4 (Hess's law,
chromatography), chemistry covers general/inorganic/organic/physical/
analytical/theoretical chemistry from bachelor through graduate level, plus
a foundational biochemistry module — judged comprehensive at the
taught-MSc/early-PhD depth target. Continuing now into materials-science;
see a new `MATERIALS_SCIENCE_PLAN.md` for that phase's breakdown.

---
