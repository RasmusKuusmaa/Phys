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

- [ ] Crystal structure and crystallography (unit cells, Bravais lattices,
      Miller indices — genuinely absent; the existing
      amorphous-solids-and-liquid-crystals concept describes what
      crystalline materials are NOT, without ever covering crystallinity
      itself)
- [ ] Point defects and dislocations in crystals (vacancies,
      interstitials, edge/screw dislocations — the atomic-scale origin of
      real materials' mechanical behavior, distinct from the existing
      continuum-level mechanical-deformation-elasticity-and-plasticity
      concept)
- [ ] Phase diagrams and binary alloy systems (eutectic, peritectic
      systems — standard materials-engineering content, entirely absent)
- [ ] Diffusion in solids (Fick's laws applied specifically to solid-state
      atomic diffusion — distinct from the physics module's general
      diffusion/random-walk treatment, which this subject cannot reference
      as a cross-subject prerequisite anyway)
- [ ] Fracture, fatigue, and creep (the standard failure-mechanism trio
      every materials course covers — entirely absent from the existing
      mechanical-deformation concept, which stops at elastic/plastic
      deformation)

---
