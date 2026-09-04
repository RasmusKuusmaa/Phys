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

- [ ] Stereochemistry and chirality (enantiomers, R/S nomenclature, optical
      activity — a standard bachelor organic-chemistry topic currently
      entirely absent despite nucleophilic-substitution already discussing
      stereochemical outcome in passing)
- [ ] NMR spectroscopy (chemical shift, coupling, structure elucidation —
      analytical chemistry currently has mass spectrometry and UV-Vis but
      no NMR at all, a striking gap given NMR's centrality to real organic
      structure determination)

## Phase C2 — graduate-level (L4) chemistry, first pass

Analogous to the physics MSc phase: existing chemistry content caps out at
bachelor level (L1-L3) with zero L4 concepts anywhere. Picking genuine
graduate-level gaps per subfield, same method as the physics MSc phase.

- [ ] Quantum chemistry: the Hartree-Fock method and beyond (ab initio
      electronic structure theory, building on the existing
      molecular-orbital-theory-and-hybridisation concept)
- [ ] Density functional theory (the practical workhorse of modern
      computational chemistry, distinct from wavefunction-based
      Hartree-Fock)
- [ ] Statistical thermodynamics and molecular partition functions
      (bridging physical chemistry to the physics statistical-mechanics
      module's partition-function machinery, applied specifically to
      molecular translational/rotational/vibrational degrees of freedom)
- [ ] Ligand field theory (the quantum-mechanical successor to the
      existing transition-metals-and-coordination-compounds concept's
      crystal-field-level treatment)
- [ ] Pericyclic reactions and the Woodward-Hoffmann rules (a major
      organic-chemistry topic — orbital-symmetry control of reactions like
      the Diels-Alder — entirely absent from the existing mechanism-focused
      organic concepts)

## Phase C3 — biochemistry (new module, currently zero concepts)

- [ ] Amino acids, peptide bonds, and protein primary structure
- [ ] Enzyme kinetics and the Michaelis-Menten equation
- [ ] Nucleic acid structure and base pairing

---
