# General engineering content plan

New subject, alongside `AEROSPACE_ENGINEERING_PLAN.md`, per the user's
explicit instruction to continue past the four subjects `QUESTIONS.md`
already judged comprehensive. Same content model, same schema, same
workflow as every prior subject — this file tracks the general-engineering
phase.

Baseline: `content/general-engineering/` does not exist yet — greenfield.
"General engineering" here means the core engineering-science topics common
to mechanical/civil/industrial practice that are not already covered, under
a different lens, by an existing subject: statics and mechanics of
materials, engineering thermodynamics (cycles, engines), engineering fluid
mechanics (pipe/pump-level, not Navier-Stokes derivations), manufacturing
processes, the engineering design process, and control systems. Checked
overlap before drafting: physics's `mechanics`/`thermodynamics-and-
statistical-mechanics`/`fluid-mechanics` modules cover the underlying
physics derivations; this subject covers the applied, design-and-
performance-facing engineering treatment of the same domains (stress
analysis and safety factors, not Lagrangian mechanics; engine cycles and
efficiency, not the general laws of thermodynamics; pipe networks and pump
selection, not viscous-flow PDEs) — framed distinctly enough that neither
duplicates the other's angle, same reasoning `MATERIALS_SCIENCE_PLAN.md`
used for its electronic/magnetic/optical-properties and corrosion concepts
relative to physics and chemistry.

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check (`npm run check:links`) before committing.
Formula + problem-template + error-model only where a concept has one
clean, well-defined numeric relationship (several of these concepts do —
beam bending stress, thermodynamic cycle efficiency, pipe head loss — more
than the aerospace phase's initial batch).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase GE1 — foundational (the core engineering-science sequence: statics,
## mechanics of materials, engineering thermodynamics, engineering fluid
## mechanics, manufacturing processes, the design process)

Single module for now (`engineering-fundamentals`), same one-module pattern
materials-science and aerospace-engineering both start with.

- [x] Statics and equilibrium of structures (free-body diagrams, force and
      moment balance, trusses and frames — the entry point the rest of the
      subject builds on; no prerequisites)
- [x] Mechanics of materials (stress, strain, Hooke's law, beam bending and
      shear stress, factor of safety — distinct from physics's
      mechanical-deformation-elasticity-and-plasticity concept, which is
      materials-science's continuum-mechanics framing of yield/plasticity
      rather than engineering stress-analysis/design; prerequisite:
      statics-and-equilibrium-of-structures; formalised factor of safety as
      a formula + problem template + error model)
- [x] Engineering thermodynamics and power cycles (Otto, Diesel, Rankine,
      and Brayton cycles, thermal efficiency, the engineering
      cycle-analysis framing of the laws of thermodynamics rather than
      their general statement; formalised the Otto-cycle efficiency
      formula, η = 1 − r^(1−γ), as a formula + problem template + error
      model — the compression-ratio dependence is the concept's central
      testable fact)
- [x] Engineering fluid mechanics (Bernoulli's equation applied to pipe
      flow, head loss, pump and turbine performance — the applied,
      systems-level treatment distinct from physics's viscous-flow/
      Navier-Stokes framing; formalised the Darcy-Weisbach head-loss
      equation as a formula + problem template + error model)
- [x] Manufacturing processes (casting, machining, forming, additive
      manufacturing — an entire standard topic currently absent from every
      subject on the site; kept conceptual, no clean single numeric
      relationship)
- [x] The engineering design process (requirements and specifications,
      iterative design, failure mode and effects analysis, safety
      factors and design margins — how engineering judgment turns physical
      principles into a built artifact; kept conceptual)

Phase GE1 complete: 6 general-engineering concepts. `npm run
validate:content` (484 concepts, 7 subjects), `npm run lint:terminology`
(238 glossary terms — added stress, yield strength, factor of safety,
compression ratio, heat capacity ratio, and head loss, none of which had
existing entries; reused the existing thermal-efficiency, coefficient-of-
friction, length, diameter, and velocity entries where the concept's own
symbol matched one already locked for physics), and `npm run typecheck`
all pass; every resource URL verified live individually with `curl`
(`npm run check:links` covers the whole repo including the sibling
aerospace-engineering phase's in-flight files, so a scoped individual
check was used instead, same adjustment that phase's own plan file
records).

## Phase GE2 — not yet planned

To be scoped after GE1 lands. Candidates surveyed but not committed to:
control systems and feedback (PID control, transfer functions, stability —
may need a Laplace-transform concept added to mathematics first, same
"add the missing math as its own concept" pattern `QUESTIONS.md` used for
group theory and Riemannian geometry), electrical and electronics
fundamentals for non-EE engineers, kinematics and dynamics of mechanisms
(gear trains, cams, linkages), engineering economics.

---
