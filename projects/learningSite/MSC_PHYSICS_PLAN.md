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
- [ ] The path integral formulation (Feynman's approach, conceptual)
- [ ] Second quantization and Fock space (bridge to QFT)
- [ ] The Klein-Gordon and Dirac equations (relativistic QM)

## Phase M4 — Statistical mechanics (existing: partition function through critical phenomena)

- [ ] The grand canonical ensemble and grand partition function
- [ ] The Ising model and mean-field theory
- [ ] The renormalization group (conceptual: why critical exponents are universal)
- [ ] Bose-Einstein condensation
- [ ] The fluctuation-dissipation theorem
- [ ] The Boltzmann transport equation (bridge to solid-state transport)

## Phase M5 — Solid-state physics (existing: band theory through quantum confinement)

- [ ] Phonons and the dynamics of the 1D/3D lattice
- [ ] The tight-binding model
- [ ] BCS theory of superconductivity (microscopic, beyond the existing
      phenomenological `superconductivity` concept)
- [ ] The Fermi surface and electronic transport

## Phase M6 — Particle physics (existing: only 2 concepts — biggest MSc gap)

- [ ] Gauge symmetries and the Higgs mechanism
- [ ] Quantum electrodynamics and Feynman diagrams (conceptual)
- [ ] Quantum chromodynamics and colour confinement
- [ ] Electroweak unification
- [ ] Neutrino oscillations and neutrino mass

## Phase M7 — General relativity (new module — currently folded into astrophysics)

- [ ] Tensor calculus and the metric tensor
- [ ] The equivalence principle and geodesics
- [ ] The Einstein field equations
- [ ] The Schwarzschild solution and black holes
- [ ] Gravitational waves
- [ ] (Existing `general-relativity-and-cosmological-models`, currently in
      the astrophysics module, is a candidate to re-home here once this
      module exists — a call for the DECISIONS.md pass at the end, not a
      silent move mid-phase.)

## Phase M8 — Docs and coverage pass

- [ ] Record this phase's decisions into `DECISIONS.md` (level taxonomy
      already done; module additions/re-homes go here)
- [ ] `npm run content:coverage` clean, full test suite, full typecheck/lint

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
- [ ] The cosmic microwave background and recombination
- [ ] Big Bang nucleosynthesis
- [ ] Cosmological perturbation theory and structure formation (conceptual)
- [ ] Gravitational lensing

## Phase N — Nuclear physics deep dive (after Phase A; existing: 6 concepts)

Existing: atoms-and-the-nucleus, nuclear-binding-energy, nuclear-fission-
and-fusion, nuclear-reactions-and-threshold-energy, nuclear-shell-model,
radioactive-decay-modes (+ radioactivity-and-half-life in measurement).

- [ ] The liquid-drop model and the semi-empirical mass formula in depth
- [ ] Nuclear reaction cross-sections and the compound nucleus model
- [ ] Beta decay theory and the weak interaction (Fermi's golden rule
      applied to nuclear beta decay)
- [ ] Nuclear magnetic resonance and nuclear spin
- [ ] Fission reactor physics (criticality, neutron moderation, control)
- [ ] Fusion reactor physics (Lawson criterion, confinement approaches)
- [ ] Nuclear astrophysics reaction rates (Gamow peak — bridges to Phase A)
- [ ] Particle accelerators and detectors (beyond the existing
      mass-spectrometry/cyclotron concept — synchrotrons, collider physics)

---

## Stretch (not scheduled)

Full quantum field theory (path integral quantization of fields, the
renormalization program in detail, the Standard Model Lagrangian term by
term), general-relativistic cosmology at the level of Friedmann equations
derived from the field equations, and condensed matter topics beyond BCS
(topological insulators, the fractional quantum Hall effect) are real MSc/
early-PhD topics that could extend this further. Not scheduled now — flag
if you want the bar raised past what's listed above.
