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
    "capacitance",
    "electric-fields",
    "electromagnetic-induction",
    "electromagnetic-waves",
    "kirchhoffs-laws-and-circuit-analysis",
    "magnetic-fields",
    "maxwells-equations",
    "rc-circuit-transients",
    "voltage-and-resistance",
  ],
  "LOFY.01.008": [
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
  ],
  "LOFY.01.009": [
    "heisenberg-uncertainty-principle",
    "photoelectric-effect",
    "photons-and-quanta",
    "quantum-energy-levels",
    "radioactivity-and-half-life",
    "wave-particle-duality",
    "wavefunctions-and-probability",
  ],
  "LOFY.04.003": [
    "length-contraction",
    "postulates-of-special-relativity",
    "relativistic-momentum-and-energy",
    "time-dilation",
  ],
  "LOFY.04.004": [
    "entropy-and-the-second-law",
    "free-energy-and-spontaneity",
    "laws-of-thermodynamics",
    "statistical-definition-of-entropy",
    "the-carnot-cycle-and-heat-engines",
    "the-maxwell-boltzmann-distribution",
  ],
  "LOFY.04.073": [
    "heisenberg-uncertainty-principle",
    "particle-in-a-box",
    "quantum-tunneling",
    "spin-and-angular-momentum-in-quantum-mechanics",
    "the-hydrogen-atom-and-atomic-structure",
    "wavefunctions-and-probability",
  ],
  "LTFY.04.016": [
    "coupled-and-driven-oscillators",
    "lagrangian-mechanics",
    "moment-of-inertia-and-rotational-dynamics",
    "rotational-kinetic-energy",
    "torque-and-angular-momentum",
  ],
  "LTFY.01.011": [
    "combining-uncertainties",
    "measurement-and-precision",
    "physical-quantities-and-units",
    "propagation-of-uncertainty-in-functions",
    "scalars-and-vectors",
    "significant-figures",
    "uncertainty-and-error",
  ],
  // MTMM.00.340 Kõrgem matemaatika I — vectors, complex numbers, single-variable
  // calculus, linear algebra and first-order ODEs, per its 32-topic syllabus.
  "MTMM.00.340": [
    "complex-numbers",
    "determinants",
    "first-order-differential-equations",
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
  ],
  // Tõenäosusteooria ja matemaatiline statistika.
  "MTMS.02.059": [
    "probability",
    "random-variables-and-distributions",
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
  ],
  // Programmeerimine — the 6 EAP variant of the same material.
  "LTAT.03.001": [
    "algorithms-and-program-structure",
    "control-flow",
  ],
  // LTFY.01.014 Spektroskoopia — spectral variables, emission/absorption,
  // and the atomic energy levels the lines come from.
  "LTFY.01.014": [
    "spectroscopy",
    "quantum-energy-levels",
    "photons-and-quanta",
    "the-hydrogen-atom-and-atomic-structure",
    "wave-nature-of-light",
  ],
  // LOFY.01.018 Signaalitöötluse alused I — signals, spectra, Fourier, sampling.
  "LOFY.01.018": [
    "signals-and-fourier-analysis",
    "wave-properties",
    "interference-and-diffraction",
    "resonance",
  ],
  "LTFY.01.004": [
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
  ],
  "LOFY.01.123": [
    "capacitance",
    "electric-fields",
    "electromagnetic-induction",
    "kirchhoffs-laws-and-circuit-analysis",
    "magnetic-fields",
    "voltage-and-resistance",
  ],
  "LOFY.01.124": [
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
  ],};

/** Every concept referenced by any course, for separating covered from enrichment. */
export function mappedConceptIds(): Set<string> {
  return new Set(Object.values(COURSE_CONCEPTS).flat());
}
