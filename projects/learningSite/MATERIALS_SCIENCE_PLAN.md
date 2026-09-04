# Materials science content plan

Continuation of `MSC_PHYSICS_PLAN.md` → `MATH_PLAN.md` → `CHEMISTRY_PLAN.md`
after chemistry was judged comprehensive (see that file's closing section
and `QUESTIONS.md`). Same content model, same schema, same workflow — this
file tracks the materials-science-subject phase. Existing baseline is thin:
only 7 concepts, all in one module (`materials-fundamentals`, L1-L2) —
classes of materials, structure-property relationships, amorphous solids/
liquid crystals, characterisation methods, composites, mechanical
deformation, polymers. Unlike physics/mathematics/chemistry, this subject
has no substantial bachelor-level foundation yet, so — following the same
"build the foundation before going deeper" order the physics phase used —
this plan starts with genuinely foundational topics (crystal structure,
phase diagrams, defects, diffusion, failure mechanisms) that a materials
science curriculum would normally cover early, before considering any
graduate-level (L4) content.

## Commit discipline

Identical rule to the other three plan files: one commit per concept,
single-line message (`content: add <concept-id>`), no body, no trailer/
signature. Every concept gets the full set — concept, >=3 misconceptions,
>=1 item, a resource per locale, EN+ET explanations. Gate before each
commit: `npm run validate:content && npm run lint:terminology`. Verify
every resource URL with a live check before committing.

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase MS1 — foundational gaps (crystal structure, defects, phase
## diagrams, diffusion, failure — the load-bearing topics a materials
## science course covers before anything graduate-level)

- [x] Crystal structure and crystallography (unit cells, Bravais lattices,
      Miller indices — genuinely absent; the existing
      amorphous-solids-and-liquid-crystals concept describes what
      crystalline materials are NOT, without ever covering crystallinity
      itself)
- [x] Point defects and dislocations in crystals (vacancies,
      interstitials, edge/screw dislocations — the atomic-scale origin of
      real materials' mechanical behavior, distinct from the existing
      continuum-level mechanical-deformation-elasticity-and-plasticity
      concept)
- [x] Phase diagrams and binary alloy systems (eutectic, peritectic
      systems — standard materials-engineering content, entirely absent)
- [x] Diffusion in solids (Fick's laws applied specifically to solid-state
      atomic diffusion — distinct from the physics module's general
      diffusion/random-walk treatment, which this subject cannot reference
      as a cross-subject prerequisite anyway)
- [x] Fracture, fatigue, and creep (the standard failure-mechanism trio
      every materials course covers — entirely absent from the existing
      mechanical-deformation concept, which stops at elastic/plastic
      deformation)

Phase MS1 complete: 12 materials-science concepts (5 new foundational
concepts on top of the thin 7-concept baseline).

## Phase MS2 — remaining foundational gaps

Surveyed the module for further genuine bachelor-level absences before
considering any graduate content.

- [x] Electronic, magnetic, and optical properties of materials (framed
      materials-science-style: property-selection and design tradeoffs
      across metals/ceramics/polymers/semiconductors, distinct from the
      physics module's band-theory/semiconductor-physics derivations,
      which cannot be referenced as cross-subject prerequisites)
- [x] Corrosion and material degradation (an entire standard topic
      currently absent from this subject; chemistry's
      metal-corrosion-and-the-electrochemical-series concept covers the
      electrochemistry but not the materials-selection/protection
      engineering angle, and cannot be a cross-subject prerequisite anyway)
- [x] Materials selection and design (Ashby-chart-style property-tradeoff
      reasoning — ties together strength, weight, cost, and other
      properties across material classes for a specific application)
- [x] Nanomaterials (size-dependent property changes at the nanoscale —
      distinct from the existing quantum-confinement content in physics,
      which is about electronic structure, not materials engineering, and
      cannot be a cross-subject prerequisite)

Phase MS2 complete: 16 materials-science concepts total.

## Phase MS3 — graduate-level (L3/L4) pass

Every existing concept is L1/L2 in a single module (materials-fundamentals).
Physics, mathematics, and chemistry were all extended to a taught-MSc/
early-PhD depth before being judged comprehensive; materials-science
deserves the same treatment rather than being left as a bachelor-only
subject. Surveyed for genuine graduate topics not overlapping existing
concepts (checked characterisation-methods specifically — it is an
intro-level "which technique fits which length scale" survey, not a deep
treatment of any one technique, so a deeper single-technique concept would
not be padding).

- [ ] Dislocation theory and strengthening mechanisms (Peierls-Nabarro
      stress, work hardening, precipitation/solid-solution/grain-boundary
      strengthening — depth beyond the existing intro-level
      point-defects-and-dislocations-in-crystals concept)
- [ ] Thermodynamics of materials and multicomponent phase equilibria
      (Gibbs free energy of mixing, CALPHAD approach, ternary systems —
      depth beyond the existing binary-only phase-diagrams concept)
- [ ] Computational materials science (finite-element and phase-field
      modelling, atomistic/molecular-dynamics simulation of materials —
      distinct from physics's general computational-methods content,
      which cannot be a cross-subject prerequisite anyway)
- [ ] Thin films, surface engineering, and semiconductor materials
      processing (deposition techniques, epitaxy, surface treatments —
      an entire standard topic currently absent)
- [ ] Biomaterials (materials designed for biological/medical
      compatibility — properties, biocompatibility criteria, degradation
      in vivo — an entire standard topic currently absent)

---
