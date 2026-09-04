# Mathematics content plan

Continuation of `MSC_PHYSICS_PLAN.md` after physics was judged comprehensive
(see that file's closing section and `QUESTIONS.md`). Same content model,
same schema, same workflow — this file just tracks the mathematics-subject
phase specifically. Existing baseline: 45 mathematics concepts (linear
algebra, complex analysis, ODEs/PDEs, Fourier series, special functions,
tensor algebra/curvilinear coordinates, vector calculus, probability/
statistics, dynamical systems, group theory/Lie algebras, Riemannian
geometry) — built during the physics MSc phase specifically to support
physics concepts that needed math machinery the site didn't have yet
(`QUESTIONS.md` § "Required math in the math section").

## Commit discipline

Identical rule to `MSC_PHYSICS_PLAN.md`: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check (`curl -s -o /dev/null -w "%{http_code}"`)
before committing, same as the physics phase.

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase MA1 — genuine gaps in the existing mathematics baseline

Surveyed all 45 existing mathematics concepts before picking these — real,
standard-textbook absences, not padding. The continuous Fourier transform
(distinct from the existing `fourier-series` concept), the calculus of
variations (the general mathematical method — functionals, the
Euler-Lagrange equation — underlying the existing physics concept
`lagrangian-mechanics` but never itself a math concept), differential
forms and exterior calculus (the modern unification of grad/div/curl/
Stokes, complementing the existing `the-divergence-and-stokes-theorems`
concept), and numerical methods for ODEs (Euler's method, Runge-Kutta —
zero numerical-methods content exists anywhere in the mathematics subject)
were the clearest gaps.

- [x] The Fourier transform
- [x] Calculus of variations and the Euler-Lagrange equation
- [x] Differential forms and exterior calculus
- [x] Numerical methods for ODEs (Euler's method and Runge-Kutta)

Phase MA1 complete: 49 mathematics concepts.

## Phase MA2 — further genuine gaps in mathematics

Checked for these specifically (grepped the whole subject for the terms
first) — all four were completely absent, not just thin:

- [x] Bayes' theorem and Bayesian inference (the probability/statistics
      modules cover frequentist hypothesis testing and point/interval
      estimation but not Bayesian updating at all)
- [x] Ring and field theory (group-theory-and-lie-algebras exists; rings
      and fields, the other two basic abstract-algebra structures, do not)
- [x] Matrix decompositions (LU, QR, SVD) — the existing
      eigenvalues-and-eigenvectors and determinants concepts don't cover
      the standard numerical-linear-algebra factorizations at all
- [x] Rigorous limits and continuity (epsilon-delta definitions, uniform
      vs. pointwise convergence) — the existing limits-of-functions concept
      is computational/intuitive, not the formal real-analysis definitions

Phase MA2 complete: 53 mathematics concepts. Full `npm run typecheck &&
npm test -- --run` re-run clean (150/150) partway through this phase.

## Phase MA3 — further gaps (after surveying all 53 existing concepts)

- [x] Markov chain Monte Carlo methods — note: the physics-subject
      `markov-chains-and-the-memoryless-property` concept could not be used
      as a prerequisite (prerequisites are strictly per-subject, per
      `QUESTIONS.md` § "Required math in the math section"'s established
      finding); used `bayes-theorem-and-bayesian-inference` and
      `random-variables-and-distributions` (both mathematics) instead
- [x] Metric spaces and topology basics (open/closed sets, compactness,
      connectedness)
- [x] Combinatorics and counting principles (permutations, combinations,
      the binomial theorem)
- [x] Bonus: Hilbert spaces and functional analysis basics (found while
      surveying for more gaps — zero functional-analysis content existed
      anywhere, despite it being the rigorous foundation under quantum
      mechanics' wavefunction space)

Phase MA3 complete: 57 mathematics concepts.

## Mathematics judged comprehensive — pivoting to chemistry

After three phases (MA1-MA3, 12 new concepts on top of the 45-concept
physics-support baseline) touching linear algebra, complex analysis,
ODEs/PDEs, Fourier analysis, probability/statistics, abstract algebra,
real analysis, topology, and functional analysis, mathematics is judged
comprehensive at the same taught-MSc/early-PhD depth target physics was
judged at (see `QUESTIONS.md` for both judgment calls). Existing baseline
in `content/chemistry/` is 35 concepts, `content/materials-science/` is 7 —
both checked before starting, per the user's instruction. Continuing now
into chemistry; see a new `CHEMISTRY_PLAN.md` for that phase's breakdown.

---
