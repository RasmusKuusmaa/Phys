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

## Phase GE2 — remaining foundational/intermediate gaps

Scoped from GE1's own candidate list. Checked `content/mathematics/` first:
`laplace-transform-methods.json` already exists, so control-systems-and-
feedback needs no new math gap-fill (unlike the MSc-physics phase's group-
theory/Riemannian-geometry additions). Checked `content/physics/` for
electrical-fundamentals overlap: physics already has thorough circuit
coverage (`kirchhoffs-laws-and-circuit-analysis`, `rc-circuit-transients`,
`inductance-and-rl-circuits`, `ac-circuits-and-impedance`,
`thevenin-and-norton-equivalent-circuits`) and thorough oscillator/vibration
coverage (`damped-oscillations`, `coupled-and-driven-oscillators`,
`small-oscillations-and-normal-modes`) — dropped both "electrical
fundamentals for engineers" and "mechanical vibrations" from the candidate
list as too likely to be padding rather than genuine gaps, and picked two
replacement topics with no existing site coverage instead: heat-exchanger
design (physics's `heat-transfer-mechanisms` covers conduction/convection/
radiation physics, not applied exchanger sizing) and quality control/
engineering statistics (mathematics has generic probability distributions,
not applied statistical process control).

- [x] Control systems and feedback (open-loop vs. closed-loop control, the
      PID control law, stability of a feedback loop — no prerequisite;
      formalised the proportional term of the control law, u = Kp·e, as a
      formula + problem template + error model — the one clean numeric
      relationship; integral/derivative action stays conceptual, per the
      plan's own note that not every graduate-adjacent nuance needs a
      formula)
- [x] Kinematics and dynamics of mechanisms (four-bar linkages, cams, gear
      trains and gear ratios — prerequisite:
      statics-and-equilibrium-of-structures; kept conceptual, no single
      clean numeric relationship across the three sub-topics)
- [x] Engineering economics (time value of money, net present value,
      payback period, breakeven analysis for engineering decisions — no
      prerequisite; formalised the two-cash-flow net present value
      relationship, NPV = CF/(1+r)^n − C0, as a formula + problem template +
      error model)
- [x] Heat exchanger design and thermal systems (overall heat transfer
      coefficient, log-mean temperature difference, fin effectiveness — the
      applied-design layer on top of engineering-thermodynamics-and-power-
      cycles; prerequisite: engineering-thermodynamics-and-power-cycles;
      formalised the LMTD relationship, ΔT_lm = (ΔT1−ΔT2)/ln(ΔT1/ΔT2), as a
      formula + problem template + error model)
- [x] Quality control and engineering statistics (control charts, process
      capability, tolerance stack-up — no prerequisite; kept conceptual)

## Phase GE3 — graduate-level (L3/L4) pass

Same move the MS3 phase made for materials-science: extend the now-11-
concept foundational baseline to taught-MSc depth. Each concept below
genuinely extends an existing GE1/GE2 concept's depth rather than restating
it.

- [x] Finite element analysis fundamentals (mesh discretisation, stiffness-
      matrix assembly at a conceptual level, convergence and mesh
      refinement — depth beyond the existing mechanics-of-materials
      concept's closed-form stress/strain treatment; distinct from
      materials-science's computational-materials-science, which covers
      atomistic/phase-field materials modelling, not structural-engineering
      FEA workflow, and cannot be a cross-subject prerequisite anyway;
      prerequisite: mechanics-of-materials; kept conceptual — the mesh/
      convergence idea is procedural, not one clean numeric relationship)
- [x] Advanced thermodynamic cycles and exergy analysis (combined Brayton-
      Rankine cycles, cogeneration, exergy/availability analysis — depth
      beyond the existing engineering-thermodynamics-and-power-cycles
      concept's single-cycle efficiency treatment; prerequisite:
      engineering-thermodynamics-and-power-cycles; formalised the combined-
      cycle efficiency relationship, η_c = η_t + η_b(1−η_t), as a formula +
      problem template + error model)
- [x] Mechanical vibrations and rotating machinery (natural frequency of
      machine elements, critical speed, rotor balancing, vibration
      isolation design — GE2 deliberately dropped an intro-level
      "mechanical vibrations" concept as redundant with physics's existing
      damped/coupled/driven-oscillator concepts; this is the genuinely
      distinct graduate-level applied-engineering angle those don't cover —
      rotating-machinery design, not oscillator derivations; prerequisite:
      kinematics-and-dynamics-of-mechanisms; formalised the single-DOF
      natural-frequency relationship, f_n = (1/2π)√(k/m), as a formula +
      problem template + error model — needed no new glossary terms,
      reusing the existing frequency/stiffness/mass entries)
- [x] Reliability engineering and systems safety (mean time between
      failures, reliability block diagrams, redundancy — the quantitative
      extension of the existing engineering-design-process concept's
      qualitative FMEA treatment; prerequisite: engineering-design-process;
      formalised the series-system reliability relationship,
      R_sys = R1·R2, as a formula + problem template + error model; added
      one new glossary term, "reliability" → "töökindlus")
- [x] Robotics and mechatronics fundamentals (actuators and sensors, robot
      forward/inverse kinematics — ties together control-systems-and-
      feedback and kinematics-and-dynamics-of-mechanisms as a named
      standard topic in its own right; prerequisites:
      control-systems-and-feedback, kinematics-and-dynamics-of-mechanisms;
      kept conceptual)

Phase GE3 complete: 16 general-engineering concepts total (5 new Phase-GE3
concepts on top of the 11-concept Phase GE1+GE2 baseline). `npm run
validate:content` (7 subjects, 503 concepts — the aerospace-engineering
sibling Phase AE3 landed concurrently), `npm run lint:terminology` (250
glossary terms — only "reliability" was newly needed this phase, since the
vibrations formula reused frequency/stiffness/mass and the exergy formula
reused thermal-efficiency), and `npm run typecheck` all pass; every one of
this phase's 10 resource URLs individually curl-verified live. Two ET
resources are honestly-adjacent rather than topic-exact matches, since
Estonian Wikipedia has no dedicated article for the English term: the
exergy concept links to "Soojusjõujaam" (thermal power plant, covering the
combined-cycle half of the concept) instead of a nonexistent "Eksergia"
article, and the vibrations concept links to the general "Vibratsioon"
article rather than a nonexistent dedicated critical-speed one.

My own read after authoring this phase: general-engineering (16 concepts —
statics, mechanics of materials, thermodynamics/power cycles, fluid
mechanics, manufacturing, design process, control systems, mechanisms,
economics, heat exchangers, quality control, FEA, advanced thermo/exergy,
vibrations/rotating machinery, reliability engineering, robotics/
mechatronics) reads as comprehensive at the same taught-MSc/early-PhD depth
target the other subjects were judged at — every core engineering-science
strand (solid mechanics, thermo-fluids, controls, manufacturing, design/
safety practice) now has both a foundational and a graduate-depth concept.
One genuine gap I noticed while writing this phase but did not add, since it
wasn't in scope: nothing in the subject (or elsewhere on the site) covers
engineering materials selection/testing standards (e.g. ASTM/ISO test
methods) as its own topic — materials-science's own materials-selection-
and-design concept is adjacent but framed around Ashby-chart tradeoffs, not
standards/testing practice. Worth a look if another pass happens.

Added 9 new
glossary terms this phase needed (proportional gain, controller output, net
present value, cash flow, initial investment, discount rate, number of
periods, temperature difference, log-mean temperature difference) — none had
existing entries; reused the existing "error" entry for the control-law
formula's error-signal symbol. `npm run validate:content` (494 concepts, 7
subjects — the aerospace-engineering sibling phase landed concurrently),
`npm run lint:terminology` (248 glossary terms), and `npm run typecheck` all
pass; every one of this phase's 10 resource URLs individually curl-verified
live (200), same scoped-check adjustment Phase GE1 used while a sibling
phase was writing files concurrently.

---
