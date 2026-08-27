# Physics/Math topic-level coverage audit

Status: the 47 UNMAPPED fixes listed below are done (see `git log` for
"content: map existing concepts to ..." commits and `src/curriculum/mapping.ts`).
Of the 54 GAP concepts, seven authoring-order groups are done — 48/54 total:

- Foundational math (8): `improper-integrals`, `curve-sketching-with-derivatives`,
  `fourier-series`, `multivariable-optimization-and-lagrange-multipliers`,
  `common-probability-distributions`, `point-and-interval-estimation`,
  `hypothesis-testing`, `intro-to-partial-differential-equations`.
- Vector/tensor and complex-analysis math (10): `tensor-algebra-and-curvilinear-coordinates`,
  `dynamical-systems-and-phase-portraits`, `residue-theorem-and-contour-integration`,
  `laurent-series-and-singularities`, `conformal-mapping`,
  `separation-of-variables-and-sturm-liouville-problems`,
  `classification-of-pdes-parabolic-hyperbolic-elliptic`, `laplace-transform-methods`,
  `greens-function-method-for-odes-and-pdes`, `bessel-legendre-and-special-functions`.
- Electricity/magnetism device physics (9): `the-hall-effect`,
  `thevenin-and-norton-equivalent-circuits`, `transformers-and-ac-power-distribution`,
  `charged-particle-motion-mass-spectrometry-and-cyclotrons`,
  `magnetic-materials-and-ferromagnetic-hysteresis`,
  `electric-motors-generators-and-thermoelectric-effects`,
  `thermionic-emission-and-vacuum-tube-devices`,
  `millikan-experiment-and-elementary-charge`,
  `piezoelectric-and-ferroelectric-materials`.
- Optics (8): `rayleigh-and-mie-scattering`, `fresnel-equations-and-brewsters-angle`,
  `birefringence-and-wave-plates`, `radiometric-and-photometric-quantities`,
  `photodetectors-pmt-and-ccd`, `nonlinear-optics-and-harmonic-generation`,
  `electric-dipole-radiation`, `raman-and-fluorescence-spectroscopy`.
- Modern/nuclear/atomic physics (5): `nuclear-shell-model-spin-and-parity`,
  `nuclear-reactions-and-threshold-energy`, `the-zeeman-effect-and-stern-gerlach`,
  `fine-structure-and-spin-orbit-coupling`, `ionizing-radiation-detection-and-dosimetry`.
- Statistical/quantum theory (5): `maxwell-thermodynamic-relations`,
  `critical-phenomena-and-continuous-phase-transitions`,
  `liouvilles-theorem-and-phase-space`,
  `quantum-dynamics-heisenberg-picture-and-perturbation-theory`,
  `basics-of-molecular-quantum-mechanics`.
- Analytical mechanics (3): `noethers-theorem-and-symmetries`,
  `nonholonomic-constraints-and-lagrange-multipliers-in-mechanics`,
  `canonical-transformations-and-hamilton-jacobi-theory`.
- Global physics / astro (6): `plate-tectonics-and-earths-interior`,
  `atmospheric-and-ocean-physics`, `solar-system-formation-and-planetary-astronomy`,
  `stellar-evolution-and-compact-objects`, `dark-matter-and-galactic-structure`,
  `general-relativity-and-cosmological-models`.

**All 54 GAP concepts are now authored — this phase's content authoring is
complete.** What remains before Phase 35 itself can be checked off: mapping
these 6 new concepts into `COURSE_CONCEPTS` in `src/curriculum/mapping.ts`
against LTFY.01.005 / LTTO.00.025 (see those courses' GAP entries above for
the exact topic-to-concept mapping), then `npm run curriculum:build` and
`npm run curriculum:coverage` to confirm the courses pick them up.


Method: for every in-scope course, `content/curriculum/courses/<CODE>.json` was read for its
`topics` array and `conceptIds`, cross-referenced against `COURSE_CONCEPTS` in
`src/curriculum/mapping.ts`, against every concept file under `content/physics/concepts/` (161
concepts) and `content/mathematics/concepts/` (27 concepts). Chemistry/materials-only concepts
(e.g. `mass-spectrometry`, `molecular-orbital-theory-and-hybridisation`) were treated as
out-of-repo for this audit per the task's physics/math-only scope.

**Counting convention**: each topic-array entry gets exactly one dominant classification
(COVERED / UNMAPPED / GAP) based on its main new content. Where a bundled Estonian topic entry
also contains a smaller uncovered clause, that clause is still surfaced as its own UNMAPPED/GAP
bullet so nothing is silently dropped — it just doesn't change the dominant topic's tally.
Administrative/review/"ülesannete lahendamine" entries with no new subject matter count as
trivially COVERED (nothing to map).

Courses with `hasSyllabus:false` / an empty `topics` array and no usable syllabus text
(all of Physics section 4.1, plus mandatory LOFY.01.018 and LOFY.01.124) are noted but not
broken into a full table — there is nothing scraped to compare against. MTMM.00.341 and
MTMS.02.059 also have an empty `topics` array; for those two (explicitly in scope) topics were
derived from the course's `outcomes`/`summary` text instead, flagged as such.

Excluded from scope despite sitting in physics-track modules because their actual subject
matter is not physics or mathematics: **LOFY.01.021** (Engineering graphics — technical
drawing/SolidWorks CAD) and **LTFY.01.012** (Seminar on the scientific method — generic
science-communication skills, no physics content in its topic list).

---

## LOFY.01.007 — Electricity and magnetism (required, physics 2.1)
- COVERED: 7/12
- UNMAPPED (concept exists, needs mapping):
  - `Eriotstarbelised elektrimaterjalid ja -seadmed (pn-siire, pooljuhi elektron/aukjuhtivus, tsooniteooria)` -> `band-theory-of-solids`
  - `Eriotstarbelised elektrimaterjalid ja -seadmed (pooljuhi elektron/aukjuhtivus)` -> `semiconductors-and-doping`
  - `Elektrivool ja elektromagnetlained aines (ülijuhtivus)` -> `superconductivity`
- GAP (needs new concept):
  - `Dielektrilised materjalid — piesoelektrikud ja ferroelektrikud` -> **piezoelectric-and-ferroelectric-materials** (L2, prereq: dielectrics-and-capacitor-energy)
  - `Alalisvool ja elektriahelad — Thevenin'i ja Norton'i generaatorid` -> **thevenin-and-norton-equivalent-circuits** (L2, prereq: kirchhoffs-laws-and-circuit-analysis)
  - `Vahelduvvool elektriahelates — magnetahelad, trafo` -> **transformers-and-ac-power-distribution** (L2, prereq: electromagnetic-induction, inductance-and-rl-circuits, ac-circuits-and-impedance; also covers skin-effect from the "Elektrivool ja elektromagnetlained aines" topic)
  - `Üksikute laengukandjate liikumine — Halli efekt` -> **the-hall-effect** (L2, prereq: lorentz-force, magnetic-fields)
  - `Üksikute laengukandjate liikumine — mass-spektromeetria, magnetron-generaator, tsüklotron-liikumine` -> **charged-particle-motion-mass-spectrometry-and-cyclotrons** (L2/L3, prereq: lorentz-force)
  - `Magnetmaterjalid — dia-/para-/ferromagneetikud, hüstereesisilmus, Bohri magneton` -> **magnetic-materials-and-ferromagnetic-hysteresis** (L2/L3, prereq: magnetic-fields)
  - `Eriotstarbelised elektrimaterjalid — elektrimootorid, generaatorid, termopaar, termoelektrilised nähtused` -> **electric-motors-generators-and-thermoelectric-effects** (L2, prereq: electromagnetic-induction, voltage-and-resistance)

## LOFY.01.008 — Optics (required, physics 2.1)
- COVERED: 19/36
- UNMAPPED:
  - `Geomeetriline optika — murdumine, peegeldumine` -> `reflection-and-refraction`
  - `Laineoptika, lainevõrrand, kompleksesitus` -> `the-wave-equation`
  - `Maxwelli võrrandid, lainefunktsioon, Poyntingi vektor` -> `maxwells-equations`, `the-poynting-vector`
  - `Laine levik ruumis ja ajas, Fourier teisendus` -> `signals-and-fourier-analysis`
  - `Must keha, Plancki valem, Stefan-Boltzmanni seadus, Wieni nihkeseadus` -> `blackbody-radiation-and-plancks-law`
  - `Fotomeetria ja sellega seonduv, Musta keha kiirgus` -> `blackbody-radiation-and-plancks-law`
  - `Difraktsioon avalt, Rayleigh kriteerium, Doppleri efekt` -> `the-doppler-effect`
  - `Fotoefekt, valguskvandi mõiste` -> `photoelectric-effect`, `photons-and-quanta`
  - `Valguse kiirgamine ja neelamine kvantidena, laser, LED, CCD` -> `lasers-and-stimulated-emission`
- GAP:
  - `Dipooli kiirgus` -> **electric-dipole-radiation** (L3, prereq: electromagnetic-waves, the-wave-equation)
  - `Rayleigh hajumine. Mie hajumine. Neeldumine` -> **rayleigh-and-mie-scattering** (L2/L3, prereq: electromagnetic-waves, wave-nature-of-light)
  - `Fresnel'i valemid, peegeldumine, murdumine, Brewsteri nurk` -> **fresnel-equations-and-brewsters-angle** (L2/L3, prereq: reflection-and-refraction [unmapped above], polarization-of-light)
  - `Pinnalaine, veerandlaineplaat, kaksikmurdumine, FTIR ATR` -> **birefringence-and-wave-plates** (L3, prereq: polarization-of-light)
  - `Radiomeetrilised ja fotomeetrilised suurused, valgusviljakus` -> **radiometric-and-photometric-quantities** (L2, prereq: electromagnetic-waves)
  - `Valguse punanihe, mittelineaarsed efektid, II harmoonilise levik` -> **nonlinear-optics-and-harmonic-generation** (L3, prereq: electromagnetic-waves-in-media)
  - CCD/photomultiplier detectors (recurs in LTFY.01.014) -> **photodetectors-pmt-and-ccd** (L2, prereq: photoelectric-effect)

## LOFY.01.009 — Physics of the microworld (required, physics 2.1)
- COVERED: 16/22 (real content rows; problem-solving/review rows and section headers counted trivially covered)
- UNMAPPED — this course's electives (LOFY.04.073, LOFY.01.014) already have these concepts written; they simply aren't linked here even though the syllabus explicitly needs them:
  - `De Broglie lainete tõestus, Schrödingeri võrrand` -> `the-schrodinger-equation`, `de-broglie-wavelength`
  - `Määramatuse printsiip, tunnelefekt, tunnelmikroskoopia` -> `quantum-tunneling`
  - `Potentsiaalikaevus viibiva elektroni käsitlus` -> `particle-in-a-box`
  - `Vesinikusarnane aatom: kvantarvud, lainefunktsioonid` -> `quantum-numbers-and-atomic-orbitals`, `the-hydrogen-atom-and-atomic-structure`
  - `Impulsimoment ja magnetmoment: spinn` -> `spin-and-angular-momentum-in-quantum-mechanics`
  - `Keeruline aatom I — Pauli keeluprintsiip` -> `the-pauli-exclusion-principle`
  - `Bohri aatomimudel` -> `atoms-and-the-nucleus`
- GAP:
  - `Tuumajõud, kihtmudel, paarsus` + `Tuumaosakeste spinnid, energiatasemed tuumas, kihtmudel` -> **nuclear-shell-model-spin-and-parity** (L3, prereq: nuclear-binding-energy)
  - `Tuumareaktsioonid, lävienergiad ja kulgemine` -> **nuclear-reactions-and-threshold-energy** (L2/L3, prereq: nuclear-binding-energy, conservation-laws-in-particle-interactions)
  - `Zeemani efekt, Einstein-de Haasi katse, Stern-Gerlachi katse` -> **the-zeeman-effect-and-stern-gerlach** (L3, prereq: spin-and-angular-momentum-in-quantum-mechanics, magnetic-fields)
  - `Aatomi energiatasemete peenstruktuur` -> **fine-structure-and-spin-orbit-coupling** (L3, prereq: the-hydrogen-atom-and-atomic-structure, spin-and-angular-momentum-in-quantum-mechanics)
  - `Elektronspektroskoopia` -> folds into **fine-structure-and-spin-orbit-coupling** as an experimental-methods note
  - `Tuumasisesed võnkumised, kvadrupoolsiirded, ülipeenstruktuur` -> folds into **nuclear-shell-model-spin-and-parity**
  - `Tuumafüüsikast lähtuvad eksperimendimeetodid` -> **ionizing-radiation-detection-and-dosimetry** (dedup, see LOFY.01.015)

## LTFY.01.006 — Mechanics and heat (required, physics 2.1 / materials-science 2.5)
- COVERED: 29/29
- No gaps found. Every real topic line (kinematics, Newton's laws, momentum/energy, rotational dynamics, non-inertial frames mentioned only implicitly, fluids, oscillations, waves, thermodynamics, kinetic theory) already has a mapped concept. This is the best-covered course in the audit.

## LOFY.04.003 — Special relativity (elective, physics 2.2)
- COVERED: 5/5
- No gaps. Postulates, kinematics, four-vector formalism and relativistic mechanics are all mapped.

## LOFY.04.004 — Thermodynamics and statistical physics (elective, physics 2.2)
- COVERED: 10/16
- UNMAPPED:
  - `Adiabaadid ja adiabaatiline protsess` -> `thermodynamic-processes`
  - `Termilised ja kalorilised olekuvõrrandid` / `Ideaalne gaas` -> `ideal-gas-law`
  - `Faasisiirded` -> `phase-transitions`
- GAP:
  - `Maxwelli seosed` -> **maxwell-thermodynamic-relations** (L3, prereq: laws-of-thermodynamics, entropy-and-the-second-law) — distinct from the existing Maxwell–Boltzmann distribution concept
  - `Faasisiirded — teist liiki faasisiirded` -> **critical-phenomena-and-continuous-phase-transitions** (L3, prereq: phase-transitions, statistical-definition-of-entropy)
  - `Liouville'i teoreem ja ergoodsuse hüpotees` -> **liouvilles-theorem-and-phase-space** (L3, prereq: microstates-and-multiplicity; dedup with LTFY.04.016 below)

## LOFY.04.073 — Quantum mechanics (elective, physics 2.2)
- COVERED: 16/22
- UNMAPPED:
  - `Energiatsoonid perioodilises potentsiaaliväljas` -> `band-theory-of-solids`
  - `Eristamatute osakeste süsteemid` -> `quantum-statistics-fermi-dirac-and-bose-einstein`
- GAP:
  - `Siirded perioodilise mõju toimel; Ajalise sõltuvusega häiritusarvutus` + `Füüsikalise suuruse muutumiskiirus, Ehrenfesti teoreem ja Heisenbergi pilt` -> **quantum-dynamics-heisenberg-picture-and-perturbation-theory** (L3, prereq: the-schrodinger-equation, operators-and-observables, expectation-values-and-measurement)
  - `Molekulide kvantmehaanika alged` -> **basics-of-molecular-quantum-mechanics** (L3, prereq: the-schrodinger-equation)

## LTFY.04.013 — Mathematical physics (elective, physics 2.2) — math-subject
- COVERED: 18/36
- UNMAPPED:
  - `Baasiteisendused (maatriksid)` -> `matrices`
  - `Omaväärtused ja omavektorid` / `Maatriksi diagonaliseerimine` / `Jordani normaalkuju` -> `eigenvalues-and-eigenvectors` (currently an unmapped enrichment concept — this is exactly the course it belongs to)
- GAP:
  - The whole tensor-algebra block: tensor product, dual/curvilinear bases, metric tensor, covariant/contravariant components, index raising/lowering, pseudotensors, Levi-Civita tensor, curve/surface differential geometry, grad/div/curl/Laplacian in curvilinear coordinates -> **tensor-algebra-and-curvilinear-coordinates** (L3, prereq: vectors-in-space, the-dot-product, the-cross-product, vector-fields-and-the-gradient, divergence-and-curl) — matches the mapping.ts comment "not yet fully covered (tensor calculus missing)" verbatim
  - `Dünaamilised süsteemid, püsipunktid, bifurkatsioonid` -> **dynamical-systems-and-phase-portraits** (L3, prereq: eigenvalues-and-eigenvectors, second-order-differential-equations)

## LTFY.04.016 — Analytical mechanics (elective, physics 2.2)
- COVERED: 29/41 (many rows are logistics/homework-consultation/group-work sessions, trivially covered)
- UNMAPPED:
  - `Punktmassi kinemaatika: puutujavektor, peanormaalvektor` -> `displacement-velocity-acceleration`
  - `Newtoni II seadus ja mehaanilise energia jäävus`, `Kolm samaväärset konservatiivsuse tunnust` -> `conservation-of-energy`
  - `Orbitaalliikumise dünaamika; radiaalvõrrand; Kepleri ülesanne` -> `central-force-motion-and-orbits` (unmapped enrichment concept — exact fit)
  - `Liikumine Maa raskusväljas: Coriolis'i efekt` -> `non-inertial-frames-and-fictitious-forces` (unmapped enrichment concept — exact fit)
  - `Poissoni sulud` -> `hamiltonian-mechanics` (unmapped enrichment concept)
  - `Lagrange'i võrrandid mittekonservatiivsete jõudude korral (laetud osake magnetväljas)` -> `lorentz-force`
- GAP:
  - `Lagranžiaani invariantsus — Noetheri teoreem` -> **noethers-theorem-and-symmetries** (L3, prereq: lagrangian-mechanics)
  - `Lagrange'i võrrandid mitteholonoomsete seoste korral, Lagrange'i kordajate meetod` -> **nonholonomic-constraints-and-lagrange-multipliers-in-mechanics** (L3, prereq: lagrangian-mechanics)
  - `Kanoonilised teisendused, Hamilton-Jacobi võrrandid, kvaasiklassikaline lähendus` -> **canonical-transformations-and-hamilton-jacobi-theory** (L3, prereq: hamiltonian-mechanics)
  - `Integreeruv Hamiltoni süsteem (Liouville'i teoreem)` -> **liouvilles-theorem-and-phase-space** (dedup with LOFY.04.004)

## LOFY.01.123 — Physics practical II — electricity and magnetism (required, physics 3.1)
- COVERED: 4/14
- UNMAPPED:
  - `Kompassinõela magnetresonants, elektroni/tuuma paramagnetresonants` -> `spin-and-angular-momentum-in-quantum-mechanics`
  - `RC-vooluring — kondensaatori laadumine/tühjenemine` -> `rc-circuit-transients`
  - `Elektromagnetilised vabavõnkumised` -> `lc-and-rlc-oscillations`
  - `Elektromagnetilised sundvõnkumised, pinge- ja vooluresonants` -> `ac-circuits-and-impedance`
- GAP:
  - `Elementaarlaengu määramine Millikani meetodil; aatomi ergastuspotentsiaal` -> **millikan-experiment-and-elementary-charge** (L2, prereq: electric-fields, quantum-energy-levels)
  - `Elektroni erilaengu määramine (trajektoor, magnetronimeetod)` -> **charged-particle-motion-mass-spectrometry-and-cyclotrons** (dedup with LOFY.01.007)
  - `Termoemissioon, väljumistöö, kolme kahendiku seadus` + `Vaakum- ja pooljuhtsuunajad, lamptrioodi võimendi` -> **thermionic-emission-and-vacuum-tube-devices** (L2, prereq: photoelectric-effect, electric-fields)
  - `Ferromagneetikute uurimine, hüsterees` -> **magnetic-materials-and-ferromagnetic-hysteresis** (dedup with LOFY.01.007)
  - `Pooljuhi keelutsooni laius, Halli efekti uurimine` -> **the-hall-effect** (dedup with LOFY.01.007)

## LTFY.01.004 — Physics practical I — mechanics and heat (required, physics 3.1)
- COVERED: 5/11
- UNMAPPED (all cheap fixes — these concepts exist and are used by the lecture course LTFY.01.006, just not linked to this practical):
  - `Kummipaela elastsuse potentsiaalne energia` -> `mechanical-deformation-elasticity-and-plasticity`
  - `Pöörlemise kineetiline energia ja inertsimoment` -> `moment-of-inertia-and-rotational-dynamics`, `rotational-kinetic-energy`
  - `Heli kiirus gaasides` -> `sound-waves-and-intensity`
  - `Õhutakistuse uurimine` -> `drag-and-terminal-velocity`
  - `Gaasi paisumisel tehtav töö` -> `ideal-gas-law`
  - `Adiabaatiliste protsesside uurimine` -> `thermodynamic-processes`
- GAP: none.

## LTFY.01.014 — Spectroscopy (required, physics 3.1)
- COVERED: 1/5
- UNMAPPED:
  - `IR Fourier-spektromeetriga tutvumine` -> `signals-and-fourier-analysis`
  - `Laseri moodide uurimine interferomeetriga` -> `lasers-and-stimulated-emission`, `the-michelson-interferometer`
- GAP:
  - `Materjali faasikoostise määramine kombinatsioonhajumise (Raman) spektrist` -> **raman-and-fluorescence-spectroscopy** (L2/L3, prereq: spectroscopy, quantum-energy-levels)
  - `RGB CCD maatriksdetektori uurimine` -> **photodetectors-pmt-and-ccd** (dedup with LOFY.01.008)

## LOFY.01.015 — Experimental methods of nuclear physics (elective, physics 3.2)
- COVERED: 2/14
- UNMAPPED:
  - `Ioniseeriva kiirguse vastastikmõju ainega` -> `compton-scattering`, `photoelectric-effect`, `x-rays-and-their-production`
  - `Ioniseeriva kiirguse mudeldamine` (×2) -> `statistical-distributions-in-measurement`
- GAP (all fold into one concept — this course is essentially "how do you detect and quantify radiation," which nothing on the platform currently teaches):
  - `Ioniseeriva kiirguse detekteerimise viisid`, `Kiirgusdoos ja dosimeetria`, `Alfaspektromeetria` (×2), `Vedelikstsintillatsioonmeetod (LSC)`, `Geigeri loendur ja saastunud ala seire`, `Dosimeetrite kalibreerimine`, `Gammaspektromeetria` -> **ionizing-radiation-detection-and-dosimetry** (L2, prereq: radioactivity-and-half-life, radioactive-decay-modes; dedup with LOFY.01.009's experimental-methods topic)

## LOFY.04.035 — Equations of mathematical physics (elective, physics 3.2) — math-subject
- COVERED: 0/15
- UNMAPPED: `Rakendused kvantmehaanikas` -> `the-schrodinger-equation`
- GAP: this course is almost entirely uncovered — only the four most generic ODE/series/Stokes concepts are mapped, none of the actual PDE-methods content:
  - `Osatuletistega diferentsiaalvõrrandite klassifikatsioon ja lihtsustamine, matemaatilise füüsika ülesannete seade` -> **classification-of-pdes-parabolic-hyperbolic-elliptic** (L3, prereq: second-order-differential-equations, partial-derivatives) — also covers the repeated "parabolic/hyperbolic/elliptic equation solving" sessions
  - `Omaväärtusülesanne, muutujate eraldamise meetod (Fourier' meetod)` -> **separation-of-variables-and-sturm-liouville-problems** (L3, prereq: second-order-differential-equations, infinite-series)
  - `Fourier' teisendus, Laplace'i teisendus` -> **laplace-transform-methods** (L2/L3, prereq: first-order-differential-equations, second-order-differential-equations)
  - `Raja- ja algtingimuste lihtsustamine, Greeni funktsiooni meetod` -> **greens-function-method-for-odes-and-pdes** (L3, prereq: second-order-differential-equations)
  - `Besseli funktsioonid, Legendre'i, Laguerre'i ja Hermite'i polünoomid` -> **bessel-legendre-and-special-functions** (L3, prereq: second-order-differential-equations)

## LTFY.01.005 — Global physics (LTFY) (elective, physics 3.2)
- COVERED: 2/10
- UNMAPPED:
  - `Maa mitteinertsiaalse taustsüsteemina, Coriolise kiirendus` -> `non-inertial-frames-and-fictitious-forces`
  - `Astrofüüsika uurimismeetodid ... Spektroskoopilised meetodid` -> `spectroscopy`
- GAP:
  - `Planeedi Maa vertikaalne kihistus, seismiline sondeerimine, laamtektoonika` -> **plate-tectonics-and-earths-interior** (L2, prereq: pressure-in-fluids)
  - `Atmosfääri üldkirjeldus`, `UV-kiirgus ja osoon`, `Kuiv ja niiske õhk`, `Temperatuuri vähenemine kõrgusega`, `Maailmamere soolsus ja temperatuur` -> **atmospheric-and-ocean-physics** (L2, prereq: ideal-gas-law, thermodynamic-processes)

## LTTO.00.025 — Global physics (LTTO) (elective, physics 3.2)
Shares LTFY.01.005's first 9-10 topics (same GAP/UNMAPPED entries, deduped above) plus a full astronomy/cosmology half:
- COVERED: 2/17
- UNMAPPED: same two as LTFY.01.005 above
- GAP (additional, beyond the geophysics ones already listed):
  - `Vaatlusastronoomia, Päikesesüsteem, Päikesesüsteemi tekkehüpoteesid` -> **solar-system-formation-and-planetary-astronomy** (L2, prereq: keplers-laws, newtonian-gravitation)
  - `Teised tähed: heledused, Hertzsprung-Russelli diagramm, tekkimine ja arenemine, neutrontähed ja mustad augud` -> **stellar-evolution-and-compact-objects** (L2/L3, prereq: stellar-classification-and-the-hertzsprung-russell-diagram, nuclear-fission-and-fusion)
  - `Linnutee ja teised galaktikad, galaktika dünaamika ja mass, tume aine` + `Kauged galaktikad, Universumi suuremastaabiline struktuur` -> **dark-matter-and-galactic-structure** (L2/L3, prereq: newtonian-gravitation)
  - `Kosmoloogia, Hubble'i seadus, üldrelatiivsusteooria, Suur Pauk, kosmiline taustkiirgus` + `Kaasaegne kosmoloogia: inflatsioon, tume energia` -> **general-relativity-and-cosmological-models** (L3, prereq: hubbles-law-and-the-expanding-universe)

## LTFY.04.015 — Functions of a complex variable in physics (elective, physics 3.2) — math-subject
- COVERED: 7/15
- GAP: everything past the basic complex-number/complex-function review is uncovered:
  - `Kontuurintegraalide mooduli ülemine piir`, `Cauchy-Goursat' teoreem`, `Liouville'i teoreem ja algebra põhiteoreem`, `Resiidid poolustes`, `Cauchy peaväärtus, Fourier integraalid resiidide abil` -> **residue-theorem-and-contour-integration** (L3, prereq: functions-of-a-complex-variable)
  - `Kompleksarvude jadad ja read`, `Analüütilise funktsiooni isoleeritud iseärasused`, `Funktsiooni käitumine singulaarsuste ümbruses` -> **laurent-series-and-singularities** (L3, prereq: functions-of-a-complex-variable, infinite-series)
  - Riemann sphere/surface and conformal-transformation outcomes (stated in the course's outcomes, not broken into their own topic row) -> **conformal-mapping** (L3, prereq: functions-of-a-complex-variable)

## MTMM.00.340 — Higher mathematics I (required, all tracks)
- COVERED: 29/32
- GAP:
  - `Päratud integraalid. Lõpmatute rajadega integraalid` + `Päratud integraalid. Integraalid tõkestamata funktsioonist` -> **improper-integrals** (L2, prereq: the-definite-integral)
  - `Funktsiooni uurimine` (monotonicity/convexity/L'Hôpital, implied by outcome 6-7 but not its own concept) -> **curve-sketching-with-derivatives** (L2, prereq: the-derivative)

## MTMM.00.341 — Higher mathematics II (required, all tracks)
- `topics` array is empty in the scraped JSON (0t) — the 8 pseudo-topics below are derived from the course's `outcomes`/`summary` text, flagged as such.
- COVERED: 4/8 (vector spaces, series, partial derivatives, multiple integrals)
- UNMAPPED: `Harilikud diferentsiaalvõrrandid — eralduvate muutujatega, homogeensed, eksaktsed, lineaarsed I ja II järku` -> `first-order-differential-equations`, `second-order-differential-equations` (exist, mapped to MTMM.00.340 but not to this course)
- GAP:
  - `Fourier' read` -> **fourier-series** (L2/L3, prereq: infinite-series)
  - `Kahe muutuja funktsiooni ekstreemumid, Lagrange'i meetod` -> **multivariable-optimization-and-lagrange-multipliers** (L2/L3, prereq: partial-derivatives)
  - `Osatuletistega diferentsiaalvõrrandid (lihtsamad juhud)` -> **intro-to-partial-differential-equations** (L3, prereq: partial-derivatives, second-order-differential-equations) — an introductory counterpart to LOFY.04.035's advanced PDE-methods gaps

## MTMS.02.059 — Probability theory and mathematical statistics (required, all tracks)
- `topics` array is empty in the scraped JSON (0t) — the 5 pseudo-topics below are derived from the course's `outcomes`/`summary` text, flagged as such.
- COVERED: 2/5 (classical probability; random variables and distributions)
- GAP:
  - `Enam kasutust leidnud jaotused (binoom-, Poissoni-, normaal-, Studenti jaotus)` -> **common-probability-distributions** (L2, prereq: random-variables-and-distributions)
  - `Üldkogumi karakteristikute punkti- ja vahemikhinnangud valimi põhjal` -> **point-and-interval-estimation** (L2/L3, prereq: common-probability-distributions)
  - `Hüpoteeside püstitamine ja kontrollimine` -> **hypothesis-testing** (L2/L3, prereq: point-and-interval-estimation)

## No-syllabus courses (checked, nothing to compare)
- **Physics section 4.1** (all electives): LOFY.01.026, LOFY.01.031, LOFY.01.037, LOFY.02.013, LOFY.02.020, LOFY.02.045, LOFY.03.030, LOFY.04.040, LOFY.04.045, LOFY.04.052, LOFY.04.070, LOFY.05.032, LOOM.02.240, LOTI.05.030, LTFY.00.001, LTFY.03.001, LTFY.04.012, LTTO.00.013, LTTO.00.026 — all have `hasSyllabus: false` and an empty `topics` array (the university page was never scraped for these). No topic-level claim can be made either way.
- **LOFY.01.018** (Foundations of signal processing I, required 3.1) and **LOFY.01.124** (Physics practical III — optics, required 3.1) — `hasSyllabus: true` but `topics: []` (page scraped, no topic list parsed out of it). Same conclusion.

## Excluded (not physics/math subject matter)
- **LOFY.01.021** Engineering graphics — 16 topics, entirely CAD/technical-drawing standards (SolidWorks, ISO/ANSI drafting, tolerances, fits, bearings). No physics or math content to map.
- **LTFY.01.012** Seminar on the scientific method (physics) — 9 topics, entirely about reading/presenting/reviewing scientific literature in English. No physics content to map.

---

## Summary

**Physics GAP concepts (deduped): 36**
1. piezoelectric-and-ferroelectric-materials
2. thevenin-and-norton-equivalent-circuits
3. transformers-and-ac-power-distribution
4. the-hall-effect
5. charged-particle-motion-mass-spectrometry-and-cyclotrons
6. magnetic-materials-and-ferromagnetic-hysteresis
7. electric-motors-generators-and-thermoelectric-effects
8. electric-dipole-radiation
9. rayleigh-and-mie-scattering
10. fresnel-equations-and-brewsters-angle
11. birefringence-and-wave-plates
12. radiometric-and-photometric-quantities
13. nonlinear-optics-and-harmonic-generation
14. photodetectors-pmt-and-ccd
15. nuclear-shell-model-spin-and-parity
16. nuclear-reactions-and-threshold-energy
17. the-zeeman-effect-and-stern-gerlach
18. fine-structure-and-spin-orbit-coupling
19. ionizing-radiation-detection-and-dosimetry
20. maxwell-thermodynamic-relations
21. critical-phenomena-and-continuous-phase-transitions
22. liouvilles-theorem-and-phase-space
23. quantum-dynamics-heisenberg-picture-and-perturbation-theory
24. basics-of-molecular-quantum-mechanics
25. noethers-theorem-and-symmetries
26. nonholonomic-constraints-and-lagrange-multipliers-in-mechanics
27. canonical-transformations-and-hamilton-jacobi-theory
28. millikan-experiment-and-elementary-charge
29. thermionic-emission-and-vacuum-tube-devices
30. raman-and-fluorescence-spectroscopy
31. plate-tectonics-and-earths-interior
32. atmospheric-and-ocean-physics
33. solar-system-formation-and-planetary-astronomy
34. stellar-evolution-and-compact-objects
35. dark-matter-and-galactic-structure
36. general-relativity-and-cosmological-models

**Math GAP concepts (deduped): 18**
1. improper-integrals
2. curve-sketching-with-derivatives
3. tensor-algebra-and-curvilinear-coordinates
4. dynamical-systems-and-phase-portraits
5. fourier-series
6. multivariable-optimization-and-lagrange-multipliers
7. intro-to-partial-differential-equations
8. separation-of-variables-and-sturm-liouville-problems
9. laplace-transform-methods
10. greens-function-method-for-odes-and-pdes
11. bessel-legendre-and-special-functions
12. classification-of-pdes-parabolic-hyperbolic-elliptic
13. residue-theorem-and-contour-integration
14. laurent-series-and-singularities
15. conformal-mapping
16. common-probability-distributions
17. point-and-interval-estimation
18. hypothesis-testing

**Total deduped GAP concepts: 54** (36 physics + 18 math)

**Total UNMAPPED fixes (cheap — concept already exists, just add to a course's `conceptIds`): 47**, spanning LOFY.01.007 (3), LOFY.01.008 (9, one entry covers two ids), LOFY.01.009 (7 topic-lines, 9 ids), LOFY.04.004 (3), LOFY.04.073 (2), LTFY.04.013 (2 topic-lines, 4 ids incl. the Jordan-form/diagonalization reuse of eigenvalues-and-eigenvectors), LTFY.04.016 (6), LOFY.01.123 (4), LTFY.01.004 (6 topic-lines, 7 ids), LTFY.01.014 (2 topic-lines, 3 ids), LOFY.01.015 (2 topic-lines, 4 ids), LOFY.04.035 (1), LTFY.01.005/LTTO.00.025 (2, shared). The four pre-existing "enrichment" concepts flagged by `npm run curriculum:coverage` as taught-but-mapped-nowhere — `central-force-motion-and-orbits`, `eigenvalues-and-eigenvectors`, `hamiltonian-mechanics`, `non-inertial-frames-and-fictitious-forces` — turned out to be exact-match UNMAPPED fixes for LTFY.04.016 and LTFY.04.013, which is a good sign the enrichment list is worth checking first for any future course.

**Suggested authoring order (dependency-first)**, flat numbered list of the 54 deduped GAP concept ids:

Foundational math (unblocks the physics-side math tools):
1. improper-integrals
2. curve-sketching-with-derivatives
3. fourier-series
4. multivariable-optimization-and-lagrange-multipliers
5. common-probability-distributions
6. point-and-interval-estimation
7. hypothesis-testing
8. intro-to-partial-differential-equations

Vector/tensor and complex-analysis math (feeds LTFY.04.013/LOFY.04.035/LTFY.04.015):
9. tensor-algebra-and-curvilinear-coordinates
10. dynamical-systems-and-phase-portraits
11. residue-theorem-and-contour-integration
12. laurent-series-and-singularities
13. conformal-mapping
14. separation-of-variables-and-sturm-liouville-problems
15. classification-of-pdes-parabolic-hyperbolic-elliptic
16. laplace-transform-methods
17. greens-function-method-for-odes-and-pdes
18. bessel-legendre-and-special-functions

Electricity/magnetism device physics (feeds LOFY.01.007/LOFY.01.123, all L2, low dependency depth):
19. the-hall-effect
20. thevenin-and-norton-equivalent-circuits
21. transformers-and-ac-power-distribution
22. charged-particle-motion-mass-spectrometry-and-cyclotrons
23. magnetic-materials-and-ferromagnetic-hysteresis
24. electric-motors-generators-and-thermoelectric-effects
25. thermionic-emission-and-vacuum-tube-devices
26. millikan-experiment-and-elementary-charge
27. piezoelectric-and-ferroelectric-materials

Optics (feeds LOFY.01.008/LTFY.01.014):
28. rayleigh-and-mie-scattering
29. fresnel-equations-and-brewsters-angle
30. birefringence-and-wave-plates
31. radiometric-and-photometric-quantities
32. photodetectors-pmt-and-ccd
33. nonlinear-optics-and-harmonic-generation
34. electric-dipole-radiation
35. raman-and-fluorescence-spectroscopy

Modern/nuclear/atomic physics (feeds LOFY.01.009/LOFY.01.015):
36. nuclear-shell-model-spin-and-parity
37. nuclear-reactions-and-threshold-energy
38. fine-structure-and-spin-orbit-coupling
39. the-zeeman-effect-and-stern-gerlach
40. ionizing-radiation-detection-and-dosimetry

Statistical/quantum theory (feeds LOFY.04.004/LOFY.04.073):
41. maxwell-thermodynamic-relations
42. critical-phenomena-and-continuous-phase-transitions
43. liouvilles-theorem-and-phase-space
44. quantum-dynamics-heisenberg-picture-and-perturbation-theory
45. basics-of-molecular-quantum-mechanics

Analytical mechanics (feeds LTFY.04.016, depends on hamiltonian-mechanics/central-force-motion-and-orbits being mapped via the UNMAPPED fixes above):
46. noethers-theorem-and-symmetries
47. nonholonomic-constraints-and-lagrange-multipliers-in-mechanics
48. canonical-transformations-and-hamilton-jacobi-theory

Global physics / astro (feeds LTFY.01.005/LTTO.00.025, lowest interdependency, can be done any time):
49. plate-tectonics-and-earths-interior
50. atmospheric-and-ocean-physics
51. solar-system-formation-and-planetary-astronomy
52. stellar-evolution-and-compact-objects
53. dark-matter-and-galactic-structure
54. general-relativity-and-cosmological-models
