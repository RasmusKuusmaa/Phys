# Statistics and data science content plan

New subject, seventh item on `SCIENCE_ROADMAP.md`'s build order. Same
content model, same schema, same workflow as every prior subject.

Baseline: `content/statistics-and-data-science/` does not exist yet —
greenfield.

## Scope and framing

"Statistics and data science" here means the applied, inferential and
methodological layer built on top of mathematics's existing probability
foundation — hypothesis testing, confidence intervals, experimental
design, regression as a modeling/inference tool, and data-science practice
(exploratory analysis, machine learning foundations). Checked overlap
before drafting:

- Mathematics already has `probability`, `random-variables-and-
  distributions`, `common-probability-distributions`, `bayes-theorem-and-
  bayesian-inference`, and `markov-chain-monte-carlo-methods` — the pure
  probability-theory foundation. This subject builds the inferential
  methodology on top of it rather than restating probability theory
  itself.
- Physics's `least-squares-fitting-and-linear-regression` concept
  (module `measurement`) covers curve-fitting for experimental
  measurement uncertainty — this subject's own regression concept (below)
  covers regression as a general inferential/predictive modeling tool
  (coefficients, R², residuals, overfitting), a different framing, not a
  restatement.
- Medicine's `biostatistics-and-epidemiology` module (`study-design-in-
  clinical-research`, `clinical-trial-design-and-statistical-
  significance`, `measures-of-disease-frequency-and-association`,
  `sensitivity-specificity-and-diagnostic-testing`, `bias-and-confounding-
  in-epidemiological-studies`, `outbreak-investigation-and-disease-
  surveillance`) already covers hypothesis testing, experimental design,
  and bias/confounding specifically in a medical/clinical-trial context —
  this subject covers the same underlying statistical methodology at its
  general, domain-agnostic depth instead, since the architecture has no
  cross-subject prerequisites and medicine's versions are all framed
  around a medical example throughout, not a general one.
- No existing subject covers data-science practice (exploratory data
  analysis, machine learning foundations) at all — a genuine complete gap.

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (confidence-interval width and the coefficient of
determination R² are the clearest candidates in this phase).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase Stats1 — foundational (hypothesis testing, confidence intervals,
## experimental design, regression modeling, exploratory data analysis, and
## machine learning foundations)

Single module for now (`statistics-fundamentals`), same one-module-
through-later-phases pattern every new subject on this site has started
with.

- [ ] Hypothesis testing and p-values (null vs. alternative hypotheses,
      the p-value, significance level, and Type I/II errors — the
      general statistical-inference framework, distinct from medicine's
      clinical-trial-specific framing of the same machinery; no
      prerequisites — the unifying framework the rest of this subject
      builds on; kept conceptual)
- [x] Confidence intervals and estimation (point vs. interval estimation,
      and what a confidence interval actually means — the correct
      frequentist interpretation vs. the common misinterpretation; no
      prerequisites; formalised the margin-of-error relationship,
      E = z * sigma / sqrt(n), as a formula + problem template + error
      model, reusing three pre-existing but previously-unused glossary
      terms — confidence-interval-half-width, standard-deviation,
      sample-size — plus one new term, critical-value)
- [x] Analysis of variance and experimental design (ANOVA for comparing
      more than two groups, and general experimental-design principles —
      randomization, replication, blocking; prerequisite: hypothesis-
      testing-and-p-values; kept conceptual)
- [x] Regression modeling and statistical inference (regression as a
      predictive/inferential modeling tool — coefficients, the
      coefficient of determination R², residuals, overfitting — distinct
      from physics's measurement-uncertainty curve-fitting framing; no
      prerequisites; formalised R^2 = 1 - SS_res/SS_tot as a formula +
      problem template + error model, three new glossary terms)
- [x] Exploratory data analysis and data visualization (summary
      statistics, distribution shape, and visualization principles for
      understanding data before modeling; no prerequisites; kept
      conceptual)
- [x] Machine learning foundations: supervised and unsupervised learning
      (the supervised/unsupervised distinction, training/test splits,
      overfitting/underfitting, the bias-variance tradeoff at a
      conceptual level; no prerequisites; kept conceptual)

Phase Stats1 complete: 6 statistics-and-data-science concepts. Two of six
got a formula (confidence-interval margin of error; R²). Four new glossary
terms added (`critical-value`, `coefficient-of-determination`,
`residual-sum-of-squares`, `total-sum-of-squares`); the confidence-interval
formula also reused three pre-existing, previously-unused glossary entries
(`confidence-interval-half-width`, `sample-size`, `standard-deviation`) —
apparently coined for an earlier concept that was never actually built,
now finally used. `npm run validate:content` (16 subjects, 695 concepts —
sibling subjects landed concurrently), `npm run lint:terminology` (276
glossary terms), and `npm run typecheck` all pass; every resource URL
verified live with `curl`. Three Estonian resources are honest adjacent
matches rather than exact-topic matches, since Estonian Wikipedia has no
dedicated article at these exact scopes: `hypothesis-testing-and-p-values`
links to "Alternatiivne hüpotees" (alternative hypothesis), `confidence-
intervals-and-estimation` links to the general "Statistika" article, and
`regression-modeling-and-statistical-inference` links to
"Regressioonanalüüs" (regression analysis generally, not R² specifically).

## Phase Stats2 — not yet planned

To be scoped after Stats1 lands.

---
