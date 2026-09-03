# MSc physics content plan

Extends the site from bachelor-complete (L0-L3, done — see `todo.md`) to a
complete Master's-level physics curriculum (L4), then deeper still into
astrophysics and nuclear physics specifically. See `DECISIONS.md` § Level
taxonomy for why L4 exists, and `QUESTIONS.md` for the judgment calls this
plan rests on.

## Commit discipline

Same rule as `todo.md` and `JOURNAL_PLAN.md`: one commit per concept (or a
small group of tightly related concepts authored together), single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations — never a partial one. A formula +
problem template + error model is added only when the concept has a clean,
well-defined quantitative problem; many MSc topics are conceptual/
derivation-heavy and get a multiple-choice item only, same as several
existing L3 concepts (e.g. `canonical-transformations-and-hamilton-jacobi-theory`).

Gate before each commit: `npm run validate:content && npm run lint:terminology`.
Run `npm run check:links` after adding resources (batched across several
concepts is fine, network calls are slow). Full
`npm run typecheck && npm test -- --run` periodically, not necessarily
every single concept.

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
grep -c '^- \[ \]' MSC_PHYSICS_PLAN.md      # items remaining
git log --oneline | grep '^content: add '   # concepts already landed this phase
```

---

## Phase M1 — Mechanics (existing: Newtonian through Hamiltonian/Noether/chaos) — done

- [x] Rigid body dynamics: the inertia tensor, principal axes
- [x] Euler's equations and torque-free precession
- [x] Small oscillations and normal modes (coupled systems via the mass/
      stiffness matrix eigenproblem, distinct from the existing
      two-body `coupled-and-driven-oscillators`)
- [x] Action-angle variables
- [x] Classical scattering and the differential cross-section

## Phase M2 — Electromagnetism (existing: Coulomb through Maxwell/Poynting) — done

- [x] Multipole expansion of the electric potential (magnetic multipoles
      folded into this concept's closing paragraph rather than a separate
      concept — the same expansion machinery, one extra sentence, not a
      whole new page's worth of content)
- [x] Larmor formula and radiation from accelerated charges (retarded
      potentials and the Liénard-Wiechert route folded in as the
      derivation, rather than a separate concept — they're how you get to
      Larmor, not a separate destination)
- [x] Boundary value problems and the method of images (Laplace's
      equation + separation of variables + images, as planned)
- [x] Waveguides and cavity resonators
- [x] The electromagnetic field tensor and covariant electrodynamics
- [x] Gauge transformations and gauge invariance (Coulomb/Lorenz gauge)

## Phase M3 — Quantum mechanics (existing: postulates through perturbation theory, spin, hydrogen atom)

- [x] Addition of angular momentum and Clebsch-Gordan coefficients
- [x] Identical particles and the symmetrization postulate (bosons vs.
      fermions as a wavefunction symmetry, distinct from the existing
      Pauli-exclusion concept)
- [x] The WKB approximation
- [x] Scattering theory: the Born approximation and cross-sections
- [x] Partial wave analysis and phase shifts
- [x] Density matrices and mixed states
- [x] The path integral formulation (Feynman's approach, conceptual)
- [x] Second quantization and Fock space (bridge to QFT)
- [x] The Klein-Gordon and Dirac equations (relativistic QM)

## Phase M4 — Statistical mechanics (existing: partition function through critical phenomena) — done

- [x] The grand canonical ensemble and grand partition function
- [x] The Ising model and mean-field theory
- [x] The renormalization group (conceptual: why critical exponents are universal)
- [x] Bose-Einstein condensation
- [x] The fluctuation-dissipation theorem
- [x] The Boltzmann transport equation (bridge to solid-state transport)

## Phase M5 — Solid-state physics (existing: band theory through quantum confinement) — done

- [x] Phonons and the dynamics of the 1D/3D lattice
- [x] The tight-binding model
- [x] BCS theory of superconductivity (microscopic, beyond the existing
      phenomenological `superconductivity` concept)
- [x] The Fermi surface and electronic transport

## Phase M6 — Particle physics (existing: only 2 concepts — biggest MSc gap) — done

- [x] Gauge symmetries and the Higgs mechanism
- [x] Quantum electrodynamics and Feynman diagrams (conceptual)
- [x] Quantum chromodynamics and colour confinement
- [x] Electroweak unification
- [x] Neutrino oscillations and neutrino mass

## Phase M7 — General relativity (new module — currently folded into astrophysics) — mostly done

- [x] Tensor calculus and the metric tensor
- [x] The equivalence principle and geodesics
- [x] The Einstein field equations
- [x] The Schwarzschild solution and black holes
- [x] Gravitational waves
- [x] (Existing `general-relativity-and-cosmological-models`, currently in
      the astrophysics module, is a candidate to re-home here once this
      module exists — a call for the DECISIONS.md pass at the end, not a
      silent move mid-phase. Decided: keep it in `astrophysics` — its
      content and prerequisite are cosmology/observation-facing, which is
      what that module is for; see `DECISIONS.md` § MSc physics content.)

## Phase M8 — Docs and coverage pass — done

- [x] Record this phase's decisions into `DECISIONS.md` (level taxonomy
      already done; module additions/re-homes go here)
- [x] `npm run content:coverage` clean, full test suite, full typecheck/lint
      (250/250 physics concepts complete, 150/150 tests passing, typecheck
      and terminology lint clean — M1-M7 fully done, 40 new L4 concepts)

---

## Phase A — Astrophysics deep dive (after M1-M8; existing: 6 concepts)

Existing: solar-system-formation, the-greenhouse-effect, stellar-classification
(H-R diagram), stellar-evolution-and-compact-objects, dark-matter-and-galactic-
structure, hubbles-law, general-relativity-and-cosmological-models.

- [ ] Stellar structure equations (hydrostatic equilibrium, energy
      transport, the four structure equations)
- [ ] Nucleosynthesis in stars (beyond the nuclear-physics module's
      fission/fusion basics — the specific stellar burning chains: pp-chain,
      CNO cycle, triple-alpha)
- [ ] Supernova mechanisms (core-collapse vs. Type Ia)
- [ ] Neutron star structure and the equation of state
- [ ] Black hole thermodynamics (Hawking radiation, entropy — depends on
      Phase M7's GR module)
- [ ] Galactic dynamics and rotation curves (beyond the existing dark-matter
      concept's overview level)
- [x] The cosmic microwave background and recombination
- [x] Big Bang nucleosynthesis
- [x] Cosmological perturbation theory and structure formation (conceptual)
- [x] Gravitational lensing

## Phase N — Nuclear physics deep dive (after Phase A; existing: 6 concepts)

Existing: atoms-and-the-nucleus, nuclear-binding-energy, nuclear-fission-
and-fusion, nuclear-reactions-and-threshold-energy, nuclear-shell-model,
radioactive-decay-modes (+ radioactivity-and-half-life in measurement).

- [x] The liquid-drop model and the semi-empirical mass formula in depth
- [x] Nuclear reaction cross-sections and the compound nucleus model
- [x] Beta decay theory and the weak interaction (Fermi's golden rule
      applied to nuclear beta decay)
- [x] Nuclear magnetic resonance and nuclear spin
- [x] Fission reactor physics (criticality, neutron moderation, control)
- [x] Fusion reactor physics (Lawson criterion, confinement approaches)
- [x] Nuclear astrophysics reaction rates (Gamow peak — bridges to Phase A)
- [x] Particle accelerators and detectors (beyond the existing
      mass-spectrometry/cyclotron concept — synchrotrons, collider physics)

---

## Phase S — Stretch (early-PhD-adjacent depth, started after Phase A/N)

Real MSc/early-PhD topics extending past the taught-MSc bar the rest of this
plan targets. See `QUESTIONS.md` § Proceeding into "Stretch" scope — started
without being asked, flagged there.

- [ ] Path integral quantization of fields (upgrading the existing
      conceptual `the-path-integral-formulation` QM concept to full QFT:
      generating functionals, Feynman rules from the path integral)
- [ ] The renormalization group and renormalization in QFT in depth (beyond
      the existing statistical-mechanics RG concept's critical-exponents
      framing — divergences, regularization, running couplings)
- [ ] The Standard Model Lagrangian, term by term (conceptual walkthrough
      tying together the existing gauge-symmetry/QED/QCD/electroweak
      concepts into one explicit Lagrangian)
- [ ] The Friedmann equations derived from the Einstein field equations
      (upgrading `general-relativity-and-cosmological-models`'s
      observational framing with the actual GR derivation)
- [ ] Topological insulators and topological band theory
- [ ] The fractional quantum Hall effect and anyons

---
