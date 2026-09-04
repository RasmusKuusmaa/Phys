# Aerospace engineering content plan

New subject, per the user's explicit instruction to continue past the four
subjects `QUESTIONS.md` already judged comprehensive (physics, mathematics,
chemistry, materials-science) with aerospace engineering and general
engineering next. Same content model, same schema, same workflow as every
prior subject — this file tracks the aerospace-engineering phase.

Baseline: `content/aerospace-engineering/` does not exist yet — greenfield,
unlike materials-science's thin-but-nonzero 7-concept start. Checked for
overlap with existing subjects before drafting the concept list: physics's
`astrophysics`/`mechanics` modules cover orbital dynamics and rigid-body
mechanics from a physics-derivation angle (Kepler's laws, Lagrangian/
Hamiltonian mechanics); physics's `fluid-mechanics` module covers
Navier-Stokes and viscous-flow physics; materials-science covers materials
selection and structural materials generically. None of these are
cross-subject prerequisites (per `QUESTIONS.md`'s "Required math" note —
the architecture has no cross-subject prerequisite support), so every
aerospace concept stands alone and is framed at the applied-engineering
angle (design tradeoffs, performance equations, vehicle-level reasoning)
rather than re-deriving physics that already exists elsewhere under a
different lens.

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check (`npm run check:links`) before committing.
Formula + problem-template + error-model only where a concept has one
clean, well-defined numeric relationship, per the MSc-physics-phase
precedent recorded in `DECISIONS.md` — most early concepts here are
conceptual/design-reasoning, not plug-into-a-formula.

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase AE1 — foundational (the load-bearing topics an aerospace
## engineering course covers before anything specialised: aerodynamics,
## structures, propulsion, flight dynamics, orbital mechanics, compressible
## flow)

Single module for now (`aerospace-fundamentals`), same one-module-through-L4
pattern materials-science used rather than splintering a young subject into
many thin modules prematurely.

- [x] Aerodynamics fundamentals (airfoils, lift and drag, angle of attack,
      stall, Bernoulli/circulation-based lift explanation — the entry point
      the rest of the subject builds on; no prerequisites)
- [x] Aircraft structures (loads and load paths, spars/ribs/skin
      construction, structural-material tradeoffs specific to airframes —
      distinct from materials-science's generic materials-selection concept,
      which doesn't address aircraft-specific load cases)
- [x] Propulsion fundamentals (the thrust equation, jet-engine Brayton
      cycle, turbojet/turbofan/turboprop tradeoffs, an introduction to
      rocket propulsion and the Tsiolkovsky rocket equation; formalised the
      Tsiolkovsky rocket equation as a formula + problem template + error
      model — the one clean numeric relationship in this phase's batch)
- [x] Flight dynamics and stability (the four forces, control surfaces —
      ailerons/elevator/rudder, static and dynamic stability, center of
      gravity/center of pressure relationships; prerequisite:
      aerodynamics-fundamentals)
- [x] Orbital mechanics and spaceflight (Kepler's laws applied at the
      mission-design level — orbital elements, delta-v budgets, Hohmann
      transfer orbits, launch windows — framed as spacecraft engineering
      constraints, distinct from physics/astrophysics's planet-and-star
      framing of the same underlying laws, which cannot be a cross-subject
      prerequisite anyway; kept conceptual — a clean Hohmann-transfer
      delta-v formula would need a standard-gravitational-parameter symbol
      with no existing glossary entry, not worth the scope for this pass)
- [x] Compressible flow and gas dynamics (Mach number regimes, shock waves,
      subsonic/transonic/supersonic/hypersonic flow — foundation needed
      before any high-speed-flight topic; prerequisite:
      aerodynamics-fundamentals)

Phase AE1 complete: 6 aerospace-engineering concepts. `npm run
validate:content` (484 concepts, 7 subjects), `npm run lint:terminology`
(237 glossary terms), and `npm run typecheck` all pass; every resource URL
verified live individually (the repo-wide `npm run check:links` hits
Wikipedia's rate limit at the site's current resource count and reports
false-positive 429s across many pre-existing, unrelated resources, not a
usable per-concept gate at this scale — confirmed none of this phase's own
resources were among the 429s).

## Phase AE2 — remaining foundational/intermediate gaps

Scoped from AE1's own candidate list, same "survey before committing"
approach MS2 used. Checked each against physics/materials-science before
locking the list: none overlap an existing cross-subject concept (the
architecture has no cross-subject prerequisites anyway, per `QUESTIONS.md`).

- [x] Aircraft performance (range and endurance, the Breguet range equation,
      payload-range tradeoffs — the applied performance-analysis layer on
      top of propulsion and aerodynamics; prerequisites:
      propulsion-fundamentals, aerodynamics-fundamentals; formalised the
      Breguet range equation as a formula + problem template + error model)
- [x] Avionics and flight control systems (fly-by-wire, autopilot basics,
      sensor suites — attitude/air-data sensing feeding the control
      surfaces already introduced; prerequisite:
      flight-dynamics-and-stability; kept conceptual)
- [x] Spacecraft subsystems (attitude determination and control, thermal
      control, electrical power systems — the engineering-bus topics a
      spacecraft needs beyond its orbit; prerequisite:
      orbital-mechanics-and-spaceflight; kept conceptual)
- [x] Aeroelasticity (flutter, divergence, structural-aerodynamic coupling —
      a genuinely distinct topic combining aircraft-structures and
      aerodynamics-fundamentals, absent from both individually;
      prerequisites: aircraft-structures, aerodynamics-fundamentals; kept
      conceptual — divergence/flutter are stability-boundary phenomena, not
      single clean formulas)
- [x] Hypersonic aerothermodynamics (aerodynamic heating, stagnation
      temperature, thermal protection systems — the high-speed-flight
      topic compressible-flow-and-gas-dynamics sets up but doesn't cover;
      prerequisite: compressible-flow-and-gas-dynamics; kept conceptual)

## Phase AE3 — graduate-level (L3/L4) pass

Same move the MS3 phase made for materials-science: extend the now-11-
concept foundational baseline to taught-MSc depth rather than leaving the
subject bachelor-only. Each concept below genuinely extends an existing
AE1/AE2 concept's depth rather than restating it.

- [x] Aircraft dynamic modes and stability derivatives (phugoid,
      short-period, and dutch-roll modes; stability derivatives — depth
      beyond the existing intro-level flight-dynamics-and-stability
      concept, which stops at static stability and control-surface roles;
      prerequisite: flight-dynamics-and-stability; L4; kept conceptual)
- [x] Computational fluid dynamics for aerospace design (meshing,
      discretisation, turbulence modelling in an aircraft/spacecraft
      design context — distinct from materials-science's computational-
      materials-science, which is about materials modelling, not
      aerodynamic simulation, and cannot be a cross-subject prerequisite
      anyway; prerequisite: aerodynamics-fundamentals; L4; kept conceptual)
- [x] Advanced propulsion and specific impulse (specific impulse in depth,
      electric/ion propulsion, hybrid and solid rocket motors — depth
      beyond the existing propulsion-fundamentals concept's thrust-equation/
      Brayton-cycle introduction; prerequisite: propulsion-fundamentals; L4;
      formalised specific impulse, Isp = F/(mdot*g0), as a formula +
      problem template + error model — one new glossary term needed,
      specific impulse, reusing the existing force/flow-rate terms for the
      other two symbols)
- [x] Composite aerostructures and buckling (laminate theory basics,
      buckling of thin-walled structures — depth beyond the existing
      aircraft-structures concept's load-path/materials-tradeoff survey;
      prerequisite: aircraft-structures; L4; kept conceptual — a clean
      Euler-buckling formula would need an area-moment-of-inertia unit
      (m^4) not present in `src/lib/units/registry.ts`, a code change
      outside this content-only phase's scope)
- [x] Orbital perturbations and reentry dynamics (J2 perturbation,
      atmospheric drag decay, reentry trajectory and heating — depth
      beyond the existing orbital-mechanics-and-spaceflight concept's
      two-body/Hohmann-transfer treatment; prerequisites:
      orbital-mechanics-and-spaceflight, hypersonic-aerothermodynamics; L4;
      kept conceptual)

Phase AE3 complete: 16 aerospace-engineering concepts total (5 new L4
concepts on top of the 11-concept Phase AE1+AE2 baseline). All five
committed at L4, judged genuinely graduate-core once written rather than
upper-bachelor, matching the register of the MS3 materials-science phase's
own L4 concepts. Only one got a formula (advanced-propulsion-and-specific-
impulse's specific-impulse relationship) — composite-aerostructures-and-
buckling's Euler-buckling load would have been a second clean candidate but
needs an area-moment-of-inertia (m^4) unit not yet in the unit registry, a
code change outside a content-only phase's scope, so it was left
conceptual instead of forcing an incomplete formula. `npm run
validate:content` (504 concepts, 7 subjects), `npm run lint:terminology`
(250 glossary terms — added one new term, `specific-impulse`; reused
`force` and `flow-rate` for the formula's other two symbols), and `npm run
typecheck` all pass; every resource URL verified live individually with
`curl` (repo-wide `npm run check:links` remained impractical during this
phase — a sibling fork was concurrently authoring general-engineering's own
Phase GE3, same adjustment every phase since AE1 has recorded).

Phase AE2 complete: 11 aerospace-engineering concepts total (5 new Phase-AE2
concepts on top of the 6-concept Phase AE1 baseline). `npm run
validate:content` (494 concepts, 7 subjects), `npm run lint:terminology`
(248 glossary terms — added `specific-fuel-consumption` for the Breguet
formula, the only new term this phase needed; reused `distance`, `velocity`,
`mass`, and `coefficient` for the formula's other symbols, same generic-name
convention Phase AE1 used for the Tsiolkovsky equation), and `npm run
typecheck` all pass; every resource URL verified live individually with
`curl` (repo-wide `npm run check:links` is rate-limited by Wikipedia at this
site's scale, same adjustment Phase AE1 recorded). A handful of Estonian
aerospace terms with no existing glossary/Wikipedia precedent were coined
this phase (e.g. "flatter" kept as a loanword for aeroelastic flutter,
"reaktsioonihoorattas" for reaction wheel, "erikütusekulu" for specific fuel
consumption) — same unreviewed-terminology caveat as Phase AE1 and the
MSc-physics phase, flagged for a native-speaker/domain-expert pass.

---
