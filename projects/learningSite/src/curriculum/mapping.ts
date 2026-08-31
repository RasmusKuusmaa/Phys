/**
 * Which platform concepts cover which UT course.
 *
 * This is the join between the two halves of the project: the degree
 * (`content/curriculum/`, generated from the university's own text) and the
 * site (`content/physics/`, authored here). It is deliberately hand-authored
 * rather than inferred — "does this course's syllabus actually get taught by
 * these concepts" is a judgement, and writing it down is what makes the
 * remaining gap measurable instead of a feeling.
 *
 * Rules:
 * - A course with no entry is **not yet covered at all**. That is the honest
 *   default and it is what the coverage report counts as a gap.
 * - A concept may appear under several courses. Courses overlap in real
 *   curricula (mechanics shows up in the survey course, the mechanics course
 *   and the lab), and pretending otherwise would misreport both sides.
 * - A concept in **no** course is not a mistake: it is enrichment beyond the
 *   degree, and the report lists it separately so that stays visible.
 *
 * `npm run curriculum:coverage` reports against this table; the build writes
 * it into each course record's `conceptIds`.
 */
export const COURSE_CONCEPTS: Record<string, readonly string[]> = {
  "LOFY.01.002": [
    "atoms-and-the-nucleus",
    "displacement-velocity-acceleration",
    "electric-charge-and-current",
    "electric-fields",
    "lenses-and-focal-length",
    "magnetic-fields",
    "measurement-and-precision",
    "momentum-and-impulse",
    "newtons-first-law",
    "newtons-second-law",
    "newtons-third-law",
    "phase-transitions",
    "photons-and-quanta",
    "physical-quantities-and-units",
    "radioactivity-and-half-life",
    "reflection-and-refraction",
    "scalars-and-vectors",
    "significant-figures",
    "simple-harmonic-motion",
    "snells-law",
    "specific-heat-capacity",
    "speed-and-motion",
    "temperature-and-heat",
    "thermal-expansion",
    "uncertainty-and-error",
    "voltage-and-resistance",
    "wave-properties",
    "waves-and-oscillations-basics",
    "work-and-energy",
  ],
  "LTFY.01.006": [
    "heat-transfer-mechanisms",
    "internal-energy-and-the-first-law",
    "thermodynamic-processes",
    "beats-and-superposition",
    "sound-waves-and-intensity",
    "the-doppler-effect",
    "the-wave-equation",
    "wave-energy-and-power",
    "centre-of-mass",
    "centripetal-force",
    "damped-oscillations",
    "elastic-and-inelastic-collisions",
    "friction",
    "keplers-laws",
    "projectile-motion",
    "rolling-motion",
    "static-equilibrium",
    "uniform-circular-motion",
    "bernoullis-equation",
    "buoyancy-and-archimedes-principle",
    "conservation-of-energy",
    "conservation-of-momentum",
    "coupled-and-driven-oscillators",
    "displacement-velocity-acceleration",
    "fluid-continuity-and-flow-rate",
    "ideal-gas-law",
    "interference-and-diffraction",
    "kinetic-theory-of-gases",
    "lagrangian-mechanics",
    "surface-tension-and-capillarity",
    "drag-and-terminal-velocity",
    "reynolds-number-and-turbulence",
    "moment-of-inertia-and-rotational-dynamics",
    "momentum-and-impulse",
    "newtonian-gravitation",
    "newtons-first-law",
    "newtons-second-law",
    "newtons-third-law",
    "pascals-principle-and-hydraulics",
    "phase-transitions",
    "pressure-in-fluids",
    "resonance",
    "rotational-kinetic-energy",
    "simple-harmonic-motion",
    "specific-heat-capacity",
    "thermal-expansion",
    "torque-and-angular-momentum",
    "viscosity-and-poiseuille-flow",
    "wave-properties",
    "work-and-energy",
  ],
  "LOFY.01.007": [
    "ac-circuits-and-impedance",
    "amperes-law",
    "biot-savart-law",
    "capacitance",
    "coulombs-law",
    "dielectrics-and-capacitor-energy",
    "electric-charge-and-current",
    "electric-fields",
    "electric-power-and-joule-heating",
    "electric-potential-and-potential-energy",
    "electromagnetic-induction",
    "electromagnetic-waves",
    "electromagnetic-waves-in-media",
    "gausss-law",
    "inductance-and-rl-circuits",
    "kirchhoffs-laws-and-circuit-analysis",
    "lc-and-rlc-oscillations",
    "lorentz-force",
    "magnetic-fields",
    "maxwells-equations",
    "rc-circuit-transients",
    "resistivity-and-conductivity",
    "the-poynting-vector",
    "voltage-and-resistance",
    "band-theory-of-solids",
    "semiconductors-and-doping",
    "superconductivity",
    "the-hall-effect",
    "thevenin-and-norton-equivalent-circuits",
    "transformers-and-ac-power-distribution",
    "charged-particle-motion-mass-spectrometry-and-cyclotrons",
    "magnetic-materials-and-ferromagnetic-hysteresis",
    "electric-motors-generators-and-thermoelectric-effects",
    "piezoelectric-and-ferroelectric-materials",
  ],
  "LOFY.01.008": [
    "diffraction-gratings",
    "dispersion-and-chromatic-effects",
    "optical-instruments-and-magnification",
    "optical-resolution-and-the-rayleigh-criterion",
    "the-michelson-interferometer",
    "thin-film-interference",
    "interference-and-diffraction",
    "lenses-and-focal-length",
    "polarization-of-light",
    "resonance",
    "simple-harmonic-motion",
    "snells-law",
    "standing-waves",
    "total-internal-reflection",
    "wave-nature-of-light",
    "wave-properties",
    "reflection-and-refraction",
    "the-wave-equation",
    "maxwells-equations",
    "the-poynting-vector",
    "signals-and-fourier-analysis",
    "blackbody-radiation-and-plancks-law",
    "the-doppler-effect",
    "photoelectric-effect",
    "photons-and-quanta",
    "lasers-and-stimulated-emission",
    "rayleigh-and-mie-scattering",
    "fresnel-equations-and-brewsters-angle",
    "birefringence-and-wave-plates",
    "radiometric-and-photometric-quantities",
    "photodetectors-pmt-and-ccd",
    "nonlinear-optics-and-harmonic-generation",
    "electric-dipole-radiation",
  ],
  "LOFY.01.009": [
    "heisenberg-uncertainty-principle",
    "photoelectric-effect",
    "photons-and-quanta",
    "quantum-energy-levels",
    "radioactivity-and-half-life",
    "wave-particle-duality",
    "wavefunctions-and-probability",
    "compton-scattering",
    "x-rays-and-their-production",
    "nuclear-binding-energy",
    "nuclear-fission-and-fusion",
    "radioactive-decay-modes",
    "the-standard-model-of-particle-physics",
    "conservation-laws-in-particle-interactions",
    "the-schrodinger-equation",
    "de-broglie-wavelength",
    "quantum-tunneling",
    "particle-in-a-box",
    "quantum-numbers-and-atomic-orbitals",
    "the-hydrogen-atom-and-atomic-structure",
    "spin-and-angular-momentum-in-quantum-mechanics",
    "the-pauli-exclusion-principle",
    "atoms-and-the-nucleus",
    "nuclear-shell-model-spin-and-parity",
    "nuclear-reactions-and-threshold-energy",
    "the-zeeman-effect-and-stern-gerlach",
    "fine-structure-and-spin-orbit-coupling",
    "ionizing-radiation-detection-and-dosimetry",
  ],
  // LOFY.01.015 Tuumafüüsika eksperimentaalmeetodid — ionizing radiation and decay.
  "LOFY.01.015": [
    "radioactive-decay-modes",
    "radioactivity-and-half-life",
    "compton-scattering",
    "photoelectric-effect",
    "x-rays-and-their-production",
    "statistical-distributions-in-measurement",
    "ionizing-radiation-detection-and-dosimetry",
  ],
  // Phase 33 electives — no scraped syllabus for any of these four, so
  // mapped to the platform concepts a learner would need as background,
  // not a topic-by-topic match. "Most commonly taken" has no real
  // enrollment data behind it; these are picked as natural continuations
  // of already-deep subject content, not a verified popularity ranking.
  // LOTI.05.030 Kompuuterfüüsika I (Computational physics I).
  "LOTI.05.030": [
    "numerical-methods-in-computing",
    "data-structures-and-algorithms",
    "algorithms-and-program-structure",
  ],
  // LTFY.04.012 Kvantarvutuse alused (Foundations of quantum computing).
  "LTFY.04.012": [
    "wavefunctions-and-probability",
    "operators-and-observables",
    "expectation-values-and-measurement",
    "spin-and-angular-momentum-in-quantum-mechanics",
  ],
  // LTFY.05.008 Kliimateaduse ja -poliitika teejuht (climate science and policy).
  "LTFY.05.008": [
    "the-greenhouse-effect-and-planetary-energy-balance",
  ],
  // LOKT.09.018 Bioaktiivsete ühendite keemia (chemistry of bioactive compounds).
  "LOKT.09.018": [
    "functional-groups",
    "aromaticity",
    "carbonyl-chemistry-and-nucleophilic-addition",
  ],
  // LOFY.01.031 Tahkiseelektroonika — crystal structure, bands, semiconductors.
  "LOFY.01.031": [
    "crystal-structure-and-lattices",
    "band-theory-of-solids",
    "semiconductors-and-doping",
    "superconductivity",
    "lasers-and-stimulated-emission",
  ],
  // LTFY.01.005 / LTTO.00.025 Globaalfüüsika — Earth/atmospheric physics and
  // astrophysics/cosmology survey; both course listings share one syllabus.
  // Elective, eclectic (plate tectonics to cosmology) — mapped to the most
  // physics-canonical topics rather than attempting full topic coverage.
  "LTFY.01.005": [
    "the-greenhouse-effect-and-planetary-energy-balance",
    "stellar-classification-and-the-hertzsprung-russell-diagram",
    "hubbles-law-and-the-expanding-universe",
    "keplers-laws",
    "non-inertial-frames-and-fictitious-forces",
    "spectroscopy",
    "plate-tectonics-and-earths-interior",
    "atmospheric-and-ocean-physics",
  ],
  "LTTO.00.025": [
    "the-greenhouse-effect-and-planetary-energy-balance",
    "stellar-classification-and-the-hertzsprung-russell-diagram",
    "hubbles-law-and-the-expanding-universe",
    "keplers-laws",
    "non-inertial-frames-and-fictitious-forces",
    "spectroscopy",
    "plate-tectonics-and-earths-interior",
    "atmospheric-and-ocean-physics",
    "solar-system-formation-and-planetary-astronomy",
    "stellar-evolution-and-compact-objects",
    "dark-matter-and-galactic-structure",
    "general-relativity-and-cosmological-models",
  ],
  "LOFY.04.003": [
    "length-contraction",
    "postulates-of-special-relativity",
    "relativistic-momentum-and-energy",
    "time-dilation",
    "relativity-of-simultaneity",
    "lorentz-transformations",
    "relativistic-velocity-addition",
    "spacetime-and-four-vectors",
    "the-relativistic-doppler-effect",
  ],
  "LOFY.04.004": [
    "blackbody-radiation-and-plancks-law",
    "microstates-and-multiplicity",
    "the-equipartition-theorem",
    "the-partition-function",
    "entropy-and-the-second-law",
    "free-energy-and-spontaneity",
    "laws-of-thermodynamics",
    "statistical-definition-of-entropy",
    "the-carnot-cycle-and-heat-engines",
    "the-maxwell-boltzmann-distribution",
    "quantum-statistics-fermi-dirac-and-bose-einstein",
    "thermodynamic-processes",
    "ideal-gas-law",
    "phase-transitions",
    "maxwell-thermodynamic-relations",
    "critical-phenomena-and-continuous-phase-transitions",
    "liouvilles-theorem-and-phase-space",
  ],
  // Mapped against the course's own published topic list (Physicum, spring
  // 2026): continuous systems and fixed-point types, the matrix interlude,
  // the logistic map and bifurcations, Lyapunov exponents and deterministic
  // chaos. Its fractals section — Hausdorff dimension, iterated function
  // systems, Julia and Mandelbrot sets — has no concept here yet and is
  // deliberately not papered over with something adjacent.
  "LOFY.04.070": [
    "fixed-points-and-phase-plane-stability",
    "bifurcations-and-stability-loss",
    "deterministic-chaos-and-lyapunov-exponents",
    "limit-cycles-and-poincare-sections",
    "damped-oscillations",
    "coupled-and-driven-oscillators",
    "resonance",
    "eigenvalues-and-eigenvectors",
    "matrices",
    "first-order-differential-equations",
    "second-order-differential-equations",
  ],
  "LOFY.04.073": [
    "heisenberg-uncertainty-principle",
    "particle-in-a-box",
    "quantum-tunneling",
    "spin-and-angular-momentum-in-quantum-mechanics",
    "the-hydrogen-atom-and-atomic-structure",
    "wavefunctions-and-probability",
    "de-broglie-wavelength",
    "the-schrodinger-equation",
    "operators-and-observables",
    "expectation-values-and-measurement",
    "potential-steps-and-finite-wells",
    "the-quantum-harmonic-oscillator",
    "quantum-numbers-and-atomic-orbitals",
    "the-pauli-exclusion-principle",
    "band-theory-of-solids",
    "quantum-statistics-fermi-dirac-and-bose-einstein",
    "quantum-dynamics-heisenberg-picture-and-perturbation-theory",
    "basics-of-molecular-quantum-mechanics",
  ],
  "LTFY.04.016": [
    "coupled-and-driven-oscillators",
    "lagrangian-mechanics",
    "moment-of-inertia-and-rotational-dynamics",
    "rotational-kinetic-energy",
    "torque-and-angular-momentum",
    "displacement-velocity-acceleration",
    "conservation-of-energy",
    "central-force-motion-and-orbits",
    "non-inertial-frames-and-fictitious-forces",
    "hamiltonian-mechanics",
    "lorentz-force",
    "liouvilles-theorem-and-phase-space",
    "noethers-theorem-and-symmetries",
    "nonholonomic-constraints-and-lagrange-multipliers-in-mechanics",
    "canonical-transformations-and-hamilton-jacobi-theory",
  ],
  "LTFY.01.011": [
    "combining-uncertainties",
    "measurement-and-precision",
    "physical-quantities-and-units",
    "propagation-of-uncertainty-in-functions",
    "scalars-and-vectors",
    "significant-figures",
    "uncertainty-and-error",
    "graphing-and-linearisation-of-data",
    "least-squares-fitting-and-linear-regression",
    "statistical-distributions-in-measurement",
  ],
  // MTMM.00.340 Kõrgem matemaatika I — vectors, complex numbers, single-variable
  // calculus, linear algebra and first-order ODEs, per its 32-topic syllabus.
  "MTMM.00.340": [
    "complex-numbers",
    "determinants",
    "first-order-differential-equations",
    "second-order-differential-equations",
    "functions-and-inverses",
    "limits-of-functions",
    "lines-and-planes-in-space",
    "matrices",
    "polar-form-of-complex-numbers",
    "systems-of-linear-equations",
    "the-cross-product",
    "the-definite-integral",
    "the-derivative",
    "the-dot-product",
    "the-indefinite-integral",
    "vectors-in-space",
    "improper-integrals",
    "curve-sketching-with-derivatives",
  ],
  // Keemia alused — general chemistry, required of all three tracks.
  "LOKT.07.010": [
    "acids-bases-and-ph",
    "chemical-bonding",
    "chemical-equilibrium",
    "reaction-kinetics",
    "redox-reactions",
    "stoichiometry",
    "the-mole-and-amount-of-substance",
    "the-periodic-table",
  ],
  // Laboritöö praktikum (chemistry) — the theory the bench work rests on.
  // Bench technique itself cannot be delivered by a static site; see todo.md Phase 32.
  "LTKT.01.002": [
    "acids-bases-and-ph",
    "chemical-bonding",
    "chemical-equilibrium",
    "reaction-kinetics",
    "redox-reactions",
    "stoichiometry",
    "the-mole-and-amount-of-substance",
    "the-periodic-table",
  ],
  // Materjaliteaduse ülevaatekursus — required of all three tracks.
  "LTFY.02.003": [
    "classes-of-materials",
    "structure-property-relationships",
  ],
  // Sissejuhatus materjaliteadusse — the shorter introduction, same ground.
  "LOFY.02.008": [
    "classes-of-materials",
    "structure-property-relationships",
  ],
  // Kõrgem matemaatika II — vector spaces, series, multivariable calculus.
  "MTMM.00.341": [
    "infinite-series",
    "multiple-integrals",
    "partial-derivatives",
    "vector-spaces",
    "first-order-differential-equations",
    "second-order-differential-equations",
    "fourier-series",
    "multivariable-optimization-and-lagrange-multipliers",
    "intro-to-partial-differential-equations",
  ],
  // Tõenäosusteooria ja matemaatiline statistika.
  "MTMS.02.059": [
    "probability",
    "random-variables-and-distributions",
    "common-probability-distributions",
    "point-and-interval-estimation",
    "hypothesis-testing",
  ],
  // Programmeerimise alused — algorithms, expressions, conditionals, loops.
  // Writing and running real programs needs a real machine; see todo.md Phase 30.
  "MTAT.03.236": [
    "algorithms-and-program-structure",
    "control-flow",
  ],
  // Programmeerimise alused II — same fundamentals, second half.
  "MTAT.03.256": [
    "algorithms-and-program-structure",
    "control-flow",
    "data-structures-and-algorithms",
  ],
  // Programmeerimine — the 6 EAP variant of the same material.
  "LTAT.03.001": [
    "algorithms-and-program-structure",
    "control-flow",
    "data-structures-and-algorithms",
    "numerical-methods-in-computing",
  ],
  // LTFY.01.014 Spektroskoopia — spectral variables, emission/absorption,
  // and the atomic energy levels the lines come from.
  "LTFY.01.014": [
    "spectroscopy",
    "quantum-energy-levels",
    "photons-and-quanta",
    "the-hydrogen-atom-and-atomic-structure",
    "wave-nature-of-light",
    "signals-and-fourier-analysis",
    "lasers-and-stimulated-emission",
    "the-michelson-interferometer",
    "photodetectors-pmt-and-ccd",
    "raman-and-fluorescence-spectroscopy",
  ],
  // LOFY.01.018 Signaalitöötluse alused I — signals, spectra, Fourier, sampling.
  "LOFY.01.018": [
    "signals-and-fourier-analysis",
    "wave-properties",
    "interference-and-diffraction",
    "resonance",
  ],
  // LTFY.04.013 Matemaatiline füüsika — vector/tensor algebra and calculus
  // applied to physics; elective, not yet fully covered (tensor calculus missing).
  "LTFY.04.013": [
    "vectors-in-space",
    "the-dot-product",
    "the-cross-product",
    "lines-and-planes-in-space",
    "vector-fields-and-the-gradient",
    "divergence-and-curl",
    "the-divergence-and-stokes-theorems",
    "partial-derivatives",
    "multiple-integrals",
    "matrices",
    "eigenvalues-and-eigenvectors",
    "tensor-algebra-and-curvilinear-coordinates",
    "dynamical-systems-and-phase-portraits",
  ],
  // LOFY.04.035 Matemaatilise füüsika võrrandid — ODEs, Fourier method,
  // boundary value problems; elective, partially covered.
  "LOFY.04.035": [
    "first-order-differential-equations",
    "second-order-differential-equations",
    "infinite-series",
    "the-divergence-and-stokes-theorems",
    "the-schrodinger-equation",
    "separation-of-variables-and-sturm-liouville-problems",
    "classification-of-pdes-parabolic-hyperbolic-elliptic",
    "laplace-transform-methods",
    "greens-function-method-for-odes-and-pdes",
    "bessel-legendre-and-special-functions",
  ],
  // LTFY.04.015 Kompleksmuutuja funktsioonid füüsikas.
  "LTFY.04.015": [
    "complex-numbers",
    "polar-form-of-complex-numbers",
    "functions-of-a-complex-variable",
    "residue-theorem-and-contour-integration",
    "laurent-series-and-singularities",
    "conformal-mapping",
  ],
  // LOKT.01.007 Anorgaaniline keemia — periodicity, redox, halogens, transition metals.
  "LOKT.01.007": [
    "the-periodic-table",
    "redox-reactions",
    "the-halogens",
    "transition-metals-and-coordination-compounds",
    "acids-bases-and-ph",
    "hydrogen-and-electrolysis",
    "oxides-and-oxoacids",
    "the-nitrogen-group",
    "the-carbon-and-silicon-group",
    "metal-corrosion-and-the-electrochemical-series",
  ],
  // LOKT.01.010 Anorgaanilise keemia praktikum I — theory behind the bench work.
  "LOKT.01.010": [
    "the-halogens",
    "transition-metals-and-coordination-compounds",
    "acids-bases-and-ph",
    "redox-reactions",
    "hydrogen-and-electrolysis",
    "oxides-and-oxoacids",
    "metal-corrosion-and-the-electrochemical-series",
  ],
  // LOKT.09.004 Orgaaniline keemia I — functional groups, mechanisms, aromaticity.
  "LOKT.09.004": [
    "functional-groups",
    "nucleophilic-substitution",
    "aromaticity",
    "reaction-mechanisms-and-bond-cleavage",
    "addition-reactions-of-alkenes-and-alkynes",
    "electrophilic-aromatic-substitution",
    "carbonyl-chemistry-and-nucleophilic-addition",
    "carboxylic-acid-derivatives-and-nucleophilic-acyl-substitution",
  ],
  // LOKT.06.012 Analüütilise keemia praktikum I — theory the titrations rest on.
  "LOKT.06.012": [
    "stoichiometry",
    "acids-bases-and-ph",
    "chemical-equilibrium",
    "uv-vis-spectroscopy-and-the-beer-lambert-law",
  ],
  // LTKT.06.019 Analüütilise keemia põhikursus.
  "LTKT.06.019": [
    "stoichiometry",
    "acids-bases-and-ph",
    "chemical-equilibrium",
    "redox-reactions",
  ],
  // LTKT.06.024 Analüütiline keemia II — instrumental methods, spectroscopy.
  "LTKT.06.024": [
    "uv-vis-spectroscopy-and-the-beer-lambert-law",
    "mass-spectrometry",
    "spectroscopy",
  ],
  // LOKT.08.001 Teoreetiline keemia — no scraped syllabus (points to course
  // materials); molecular orbital theory and hybridisation is the core
  // conceptual content a theoretical/quantum chemistry course builds on.
  "LOKT.08.001": [
    "molecular-orbital-theory-and-hybridisation",
    "chemical-bonding",
    "the-schrodinger-equation",
    "quantum-numbers-and-atomic-orbitals",
  ],
  // LOKT.02.037 Füüsikaline keemia 1. osa — thermodynamics (laws, entropy, Gibbs
  // energy), chemical equilibrium and kinetics. Draws on physics thermodynamics
  // concepts as well as chemistry, since the syllabus is classical thermo applied
  // to chemical systems.
  "LOKT.02.037": [
    "heat-transfer-mechanisms",
    "internal-energy-and-the-first-law",
    "thermodynamic-processes",
    "real-gases-and-the-van-der-waals-equation",
    "laws-of-thermodynamics",
    "entropy-and-the-second-law",
    "statistical-definition-of-entropy",
    "free-energy-and-spontaneity",
    "the-carnot-cycle-and-heat-engines",
    "ideal-gas-law",
    "chemical-equilibrium",
    "reaction-kinetics",
    "reaction-rate-laws-and-order",
    "arrhenius-equation-and-activation-energy",
    "phase-equilibria-and-the-clausius-clapeyron-equation",
    "raoults-law-and-colligative-properties",
  ],
  // LTKT.02.001 Füüsikaline keemia 2. osa — electrochemistry, surface chemistry,
  // catalysis; elective, builds on part 1.
  "LTKT.02.001": [
    "electrolyte-solutions-and-conductivity",
    "the-nernst-equation-and-electrode-potentials",
    "adsorption-isotherms",
    "catalysis-homogeneous-and-heterogeneous",
    "metal-corrosion-and-the-electrochemical-series",
  ],
  // LOKT.09.014 / LOKT.10.018 organic and bioorganic practicals — same functional
  // group and mechanism theory as the lecture course.
  "LOKT.09.014": [
    "functional-groups",
    "nucleophilic-substitution",
    "aromaticity",
    "reaction-mechanisms-and-bond-cleavage",
    "carbonyl-chemistry-and-nucleophilic-addition",
  ],
  "LOKT.10.018": [
    "functional-groups",
    "aromaticity",
    "carboxylic-acid-derivatives-and-nucleophilic-acyl-substitution",
  ],
  // LOKT.09.015 Orgaanilise keemia praktikum (3 EAP variant) — same theory
  // as LOKT.09.014, smaller credit load.
  "LOKT.09.015": [
    "functional-groups",
    "nucleophilic-substitution",
    "aromaticity",
  ],
  // LTKT.02.002 Füüsikalise keemia praktikum I — same thermodynamics theory.
  "LTKT.02.002": [
    "laws-of-thermodynamics",
    "chemical-equilibrium",
    "reaction-kinetics",
    "reaction-rate-laws-and-order",
    "phase-equilibria-and-the-clausius-clapeyron-equation",
    "electrolyte-solutions-and-conductivity",
  ],
  // LOKT.02.041 Füüsikalise keemia praktikum I (elective variant, materials
  // science track) — same theory as LTKT.02.002.
  "LOKT.02.041": [
    "laws-of-thermodynamics",
    "chemical-equilibrium",
    "reaction-kinetics",
    "reaction-rate-laws-and-order",
  ],
  // LTKT.02.003 Füüsikalise keemia praktikum II — same theory as LTKT.02.001
  // (physical chemistry part 2: electrochemistry, adsorption, catalysis).
  "LTKT.02.003": [
    "electrolyte-solutions-and-conductivity",
    "the-nernst-equation-and-electrode-potentials",
    "adsorption-isotherms",
    "catalysis-homogeneous-and-heterogeneous",
  ],
  // LOKT.04.003 Kolloid- ja pindnähtuste keemia — surface tension/adsorption are
  // already covered by physics and physical-chemistry concepts; the colloid-
  // specific electrokinetics (double layer, zeta potential, electrophoresis/
  // electroosmosis, coagulation stability) is new and covered by the concept
  // added for this course. Micelles/surfactants, polymer-solution rheology and
  // emulsion/foam/aerosol classification remain uncovered.
  "LOKT.04.003": [
    "surface-tension-and-capillarity",
    "adsorption-isotherms",
    "colloidal-systems-and-electrokinetic-phenomena",
  ],
  // LTKT.06.002 Keemiliste andmete analüüs — concentration/dilution calculation
  // and data-processing theory shared with the measurement module; no new
  // chemistry-specific content beyond what analytical chemistry already covers.
  "LTKT.06.002": [
    "the-mole-and-amount-of-substance",
    "uncertainty-and-error",
    "statistical-distributions-in-measurement",
    "least-squares-fitting-and-linear-regression",
  ],
  // LOKT.04.004 Keskkonnakeemia I — topics array empty in the scrape; outcomes
  // name concentration/equilibrium/Henry's-law/redox calculations on pollutants
  // as the concrete chemistry content, which existing concepts already cover.
  "LOKT.04.004": [
    "the-mole-and-amount-of-substance",
    "chemical-equilibrium",
    "redox-reactions",
  ],
  // LTKT.06.004 Keemilise analüüsi praktikum — theory the analysis rests on.
  "LTKT.06.004": [
    "stoichiometry",
    "acids-bases-and-ph",
    "redox-reactions",
    "uv-vis-spectroscopy-and-the-beer-lambert-law",
    "the-nernst-equation-and-electrode-potentials",
  ],
  // LTFY.02.001 Aine struktuur ja omadused — the structure-property chain,
  // and physics/chemistry bonding concepts that structure draws on.
  "LTFY.02.001": [
    "structure-property-relationships",
    "chemical-bonding",
    "classes-of-materials",
    "crystal-structure-and-lattices",
    "band-theory-of-solids",
    "mechanical-deformation-elasticity-and-plasticity",
    "composite-materials-and-microstructure",
    "amorphous-solids-and-liquid-crystals",
  ],
  // LTFY.02.002 Materjaliklassid ja nende tehnoloogiad — the largest single course
  // in the degree (12 EAP); its lecture syllabus was not captured in the scrape,
  // so this maps the concept that directly matches its title.
  "LTFY.02.002": [
    "classes-of-materials",
    "structure-property-relationships",
    "polymers-and-polymerisation",
    "composite-materials-and-microstructure",
    "semiconductors-and-doping",
    "mechanical-deformation-elasticity-and-plasticity",
  ],
  // LTFY.02.016 Uurimismeetodid materjaliteaduses — diffraction, microscopy, spectroscopy.
  "LTFY.02.016": [
    "characterisation-methods",
    "spectroscopy",
    "x-rays-and-their-production",
    "mass-spectrometry",
    "uv-vis-spectroscopy-and-the-beer-lambert-law",
  ],
  "LTFY.01.004": [
    "centre-of-mass",
    "elastic-and-inelastic-collisions",
    "friction",
    "projectile-motion",
    "combining-uncertainties",
    "displacement-velocity-acceleration",
    "momentum-and-impulse",
    "newtons-first-law",
    "newtons-second-law",
    "newtons-third-law",
    "phase-transitions",
    "scalars-and-vectors",
    "significant-figures",
    "specific-heat-capacity",
    "thermal-expansion",
    "uncertainty-and-error",
    "work-and-energy",
    "mechanical-deformation-elasticity-and-plasticity",
    "moment-of-inertia-and-rotational-dynamics",
    "rotational-kinetic-energy",
    "sound-waves-and-intensity",
    "drag-and-terminal-velocity",
    "ideal-gas-law",
    "thermodynamic-processes",
  ],
  "LOFY.01.123": [
    "capacitance",
    "coulombs-law",
    "dielectrics-and-capacitor-energy",
    "electric-fields",
    "electric-power-and-joule-heating",
    "electromagnetic-induction",
    "inductance-and-rl-circuits",
    "kirchhoffs-laws-and-circuit-analysis",
    "lorentz-force",
    "magnetic-fields",
    "resistivity-and-conductivity",
    "voltage-and-resistance",
    "spin-and-angular-momentum-in-quantum-mechanics",
    "rc-circuit-transients",
    "lc-and-rlc-oscillations",
    "ac-circuits-and-impedance",
    "the-hall-effect",
    "charged-particle-motion-mass-spectrometry-and-cyclotrons",
    "magnetic-materials-and-ferromagnetic-hysteresis",
    "thermionic-emission-and-vacuum-tube-devices",
    "millikan-experiment-and-elementary-charge",
  ],
  "LOFY.01.124": [
    "lenses-and-focal-length",
    "polarization-of-light",
    "snells-law",
    "total-internal-reflection",
  ],
  // LOFY.02.006 Materjalifüüsika praktikum II — same electricity/magnetism
  // theory as LOFY.01.123, materials-science track variant.
  "LOFY.02.006": [
    "capacitance",
    "coulombs-law",
    "electric-fields",
    "electric-power-and-joule-heating",
    "electromagnetic-induction",
    "kirchhoffs-laws-and-circuit-analysis",
    "magnetic-fields",
    "resistivity-and-conductivity",
    "voltage-and-resistance",
  ],
  // LOFY.02.007 Materjalifüüsika praktikum III — same optics theory as
  // LOFY.01.124, materials-science track variant.
  "LOFY.02.007": [
    "lenses-and-focal-length",
    "polarization-of-light",
    "snells-law",
    "total-internal-reflection",
  ],
  "LOFY.02.055": [
    "displacement-velocity-acceleration",
    "momentum-and-impulse",
    "newtons-first-law",
    "newtons-second-law",
    "newtons-third-law",
    "phase-transitions",
    "specific-heat-capacity",
    "thermal-expansion",
    "work-and-energy",
    "mechanical-deformation-elasticity-and-plasticity",
  ],};

/** Every concept referenced by any course, for separating covered from enrichment. */
export function mappedConceptIds(): Set<string> {
  return new Set(Object.values(COURSE_CONCEPTS).flat());
}
