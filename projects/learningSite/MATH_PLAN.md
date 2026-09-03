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

- [ ] The Fourier transform
- [ ] Calculus of variations and the Euler-Lagrange equation
- [ ] Differential forms and exterior calculus
- [ ] Numerical methods for ODEs (Euler's method and Runge-Kutta)

---
