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

- [x] Path integral quantization of fields (upgrading the existing
      conceptual `the-path-integral-formulation` QM concept to full QFT:
      generating functionals, Feynman rules from the path integral)
- [x] The renormalization group and renormalization in QFT in depth (beyond
      the existing statistical-mechanics RG concept's critical-exponents
      framing — divergences, regularization, running couplings)
- [x] The Standard Model Lagrangian, term by term (conceptual walkthrough
      tying together the existing gauge-symmetry/QED/QCD/electroweak
      concepts into one explicit Lagrangian)
- [x] The Friedmann equations derived from the Einstein field equations
      (upgrading `general-relativity-and-cosmological-models`'s
      observational framing with the actual GR derivation)
- [x] Topological insulators and topological band theory
- [x] The fractional quantum Hall effect and anyons

## Phase A2 — Astrophysics, extended (per "continue until I tell you to stop")

Going past Phase A's 10 concepts into further standard-textbook
astrophysics/cosmology topics not yet covered. User instruction: cycle
astrophysics → nuclear → rest of physics → back to nuclear, continuously,
without stopping to ask.

- [x] The Chandrasekhar limit (degenerate-electron-pressure derivation,
      distinct from the existing overview-level compact-objects concept)
- [x] The Tolman-Oppenheimer-Volkoff equation (relativistic hydrostatic
      equilibrium for neutron stars, upgrading the existing neutron-star
      structure concept's Newtonian framing)
- [x] Accretion disks and active galactic nuclei
- [x] Pulsars, pulsar timing, and neutron star magnetospheres
- [x] Compact binary coalescence and gravitational wave sources
- [x] The cosmic distance ladder (standard candles and standard rulers)
- [x] Dark energy, the cosmological constant problem, and the equation of
      state parameter w
- [x] Baryon acoustic oscillations and the matter power spectrum
- [x] Exoplanet detection methods (radial velocity, transit photometry)
- [x] Cosmic rays and ultra-high-energy astrophysical particles

## Phase N2 — Nuclear physics, extended (after Phase A2)

Going past Phase N's 8 concepts into further standard-textbook nuclear
topics not yet covered.

- [x] Nuclear deformation and rotational bands
- [x] The r-process and s-process nucleosynthesis pathways (beyond the
      existing stellar-nucleosynthesis pp-chain/CNO/triple-alpha concept)
- [x] Neutrinoless double beta decay and the Majorana neutrino question
- [x] The nuclear equation of state at high density
- [x] Heavy-ion collisions and the quark-gluon plasma
- [x] Superheavy elements and the island of stability
- [x] Nuclear medicine (PET, SPECT, radiotherapy dosimetry)
- [x] Fission product yields and decay chains

## Phase X — Gap-filling across the rest of physics (per "go through all
## physics subjects", before returning to nuclear again)

Not a full per-module sweep — the site's other modules are already very
thorough. See `QUESTIONS.md` § "Go through all physics subjects" for the
reasoning: these are genuine, real gaps (topics entirely absent), not a
mechanical 2-per-module quota.

- [x] Quantum entanglement and Bell's theorem (quantum-mechanics)
- [x] CP violation and the CKM matrix (particle-physics)
- [x] The Kerr metric and rotating black holes (general-relativity)
- [x] The integer quantum Hall effect (solid-state-physics)
- [x] Plasma physics and Debye shielding (electromagnetism)
- [x] Maxwell's demon and Landauer's principle (statistical-mechanics)

## Phase N3 — Nuclear physics, round 3 (after Phase X, per the "continue
## with nuclear" instruction)

Surveyed all 22 existing nuclear-physics concepts before picking these —
genuine gaps, not padding. Alpha decay is currently only described
qualitatively inside `radioactive-decay-modes`, missing the actual Gamow
tunneling theory (a famous, standard result — the first successful
application of quantum tunneling in physics, 1928). Detector technology and
isotope separation are real nuclear-engineering topics distinct from what
`particle-accelerators-and-detectors` and `nuclear-medicine...` cover.

- [x] Alpha decay theory and Gamow's quantum tunneling explanation
- [x] Nuclear isomers and metastable states
- [x] Radiation detection technologies (scintillators, semiconductor
      detectors, Geiger-Müller counters)
- [x] Isotope separation techniques (gas centrifuge, gaseous diffusion,
      laser isotope separation)

## Phase X2 — more gap-filling across the rest of physics (continuing the
## astro → nuclear → rest-of-physics → nuclear cycle)

- [x] The virial theorem (mechanics)
- [x] Solitons and nonlinear wave equations (waves)
- [x] The Joule-Thomson effect (thermodynamics)
- [x] Gaussian beam optics and laser cavity modes (optics)

---

## Phase A3 — Cosmology, stellar physics and general astrophysics, full pass
(per "I want all of cosmology and stellar physics, then general
astrophysics for each topic also its math")

Phase A's original checklist (above) is now fully implemented in content —
stellar-structure-equations, stellar-nucleosynthesis-and-fusion-chains,
supernova-mechanisms, neutron-star-structure-and-equation-of-state,
galactic-dynamics-and-rotation-curves, and black-hole-thermodynamics (the
last living in the `general-relativity` module, split out per
`DECISIONS.md`) all exist; the plan file just hadn't been checked off.
25 astrophysics + 8 general-relativity concepts total. This phase goes
past that into further genuine, standard-textbook gaps, continuing to add
the math machinery a topic needs (`mathematics/`) as its own concept when
it doesn't already exist yet, same policy as `QUESTIONS.md` § "Required
math in the math section".

- [x] Star formation and the Jeans instability
- [x] Stellar atmospheres and radiative transfer
- [x] The interstellar medium
- [x] Binary star systems and mass transfer
- [x] The initial mass function and stellar populations
- [x] Cosmic inflation (horizon and flatness problems, slow roll)
- [x] Baryogenesis and the matter-antimatter asymmetry
- [x] The Eddington luminosity limit
- [x] Galaxy formation and morphology
- [x] Reionization and the intergalactic medium
- [x] Globular clusters and stellar population synthesis
- [x] Asteroseismology and helioseismology

Phase A3 complete: 37 astrophysics concepts + 8 general-relativity concepts.
No new math-module gap surfaced this phase (all twelve concepts leaned on
existing mechanics/statistical-mechanics/GR machinery already in
`mathematics/` or not requiring named formal machinery beyond what's in the
concept's own explanation, per `QUESTIONS.md` § "Required math in the math
section" policy — math gets a new concept only when a topic needs machinery
the site genuinely doesn't have yet, not as a per-concept quota).

## Phase A4 — Astrophysics/cosmology, round 4 (per "continue... go through
## all physics subjects" cycle, next: nuclear, then a genuine-gap sweep of
## the rest of physics, per the established cadence)

Further genuine standard-textbook gaps surveyed after Phase A3's 12: galaxy
clusters and the intracluster medium, tidal disruption events, the
Sunyaev-Zel'dovich effect, modified Newtonian dynamics (MOND) as the leading
alternative-to-dark-matter proposal (notable and citable even though it is a
minority view), multi-messenger astronomy, stellar winds and mass loss,
magnetars and soft gamma repeaters, brown dwarfs and substellar objects,
gravitational microlensing, and X-ray/radio astronomical techniques.

- [x] Galaxy clusters and the intracluster medium
- [x] Modified Newtonian dynamics (MOND) as a dark-matter alternative
- [x] Magnetars and soft gamma repeaters
- [x] Brown dwarfs and substellar objects
- [x] Stellar winds and mass loss
- [x] Tidal disruption events
- [x] The Sunyaev-Zel'dovich effect
- [x] Multi-messenger astronomy

Phase A4 complete: 45 astrophysics concepts + 8 general-relativity concepts.
Cosmology, stellar physics and general astrophysics are now judged to have
comprehensive, genuine-gap-free coverage at the taught-MSc/early-PhD depth
this plan targets (see `QUESTIONS.md` § "Scope of 'complete material for a
MSc'" for the bar). Per the established astro → nuclear → rest-of-physics
cycle, next up is a nuclear-physics gap sweep (Phase N4), then a genuine-gap
sweep of the rest of physics, before moving to mathematics, chemistry and
materials-science per the user's explicit ordering.

## Phase N4 — Nuclear physics, round 4 (after Phase A3/A4; existing: 25
## nuclear-physics concepts across Phases N-N3)

Surveyed all 25 existing nuclear-physics concepts. Exotic/light nuclei (halo
nuclei near the drip lines), collective photoexcitation (the giant dipole
resonance), pairing correlations (nuclear superfluidity, distinct from the
solid-state BCS concept), and exotic decay modes beyond alpha/beta/gamma
(cluster and proton radioactivity) are genuine, standard-textbook gaps not
covered by the existing set.

- [x] Halo nuclei and the neutron/proton drip lines
- [x] The giant dipole resonance and photonuclear reactions
- [x] Nuclear pairing and superfluidity
- [x] Cluster radioactivity and proton emission

Phase N4 complete: 29 nuclear-physics concepts. Per the established
astro → nuclear → rest-of-physics cycle, next is a genuine-gap sweep of the
rest of physics (mechanics, electromagnetism, quantum mechanics,
thermodynamics, statistical mechanics, solid-state, particle physics,
optics, waves, fluid mechanics, special relativity, general relativity) —
most of these modules are already very deep (see the per-module concept
counts surveyed at the start of this session: 40 EM, 37 mechanics,
28 QM, 22 optics, 16 thermo, 16 stat-mech, 14 solid-state, 12 waves,
11 particle, 9 special-relativity, 9 fluid-mechanics, 8 GR), so this phase
targets real absent topics, not a per-module quota, same method as Phase X.

## Phase X3 — more gap-filling across the rest of physics (continuing the
## astro → nuclear → rest-of-physics → nuclear cycle)

- [ ] A genuine gap in quantum mechanics (to be picked)
- [ ] A genuine gap in solid-state physics (to be picked)
- [ ] A genuine gap in fluid mechanics (to be picked)
- [ ] A genuine gap in particle physics (to be picked)

---
