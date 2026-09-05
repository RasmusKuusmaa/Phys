# Economics content plan

New subject, twelfth and final item on `SCIENCE_ROADMAP.md`'s current
build order. Same content model, same schema, same workflow as every
prior subject.

Baseline: `content/economics/` does not exist yet — greenfield.

## Scope and framing

"Economics" here means core micro- and macroeconomic theory at a
bachelor's-degree depth: supply and demand, elasticity and consumer
behavior, market structures, macroeconomic indicators, monetary/fiscal
policy, and international trade. Checked overlap before drafting:
`general-engineering`'s `engineering-economics` concept covers time value
of money, net present value, and payback-period analysis for engineering
investment decisions — a specific applied-finance tool, not micro/
macroeconomic theory; this subject does not restate it and covers genuinely
distinct territory (market behavior, national economic measurement, policy
mechanisms).

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (price elasticity of demand is the clearest candidate
in this phase).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase Econ1 — foundational (supply/demand, elasticity, market
## structures, macroeconomic indicators, monetary/fiscal policy, and
## international trade)

Single module for now (`economics-fundamentals`), same one-module-through-
later-phases pattern every new subject on this site has started with.

- [ ] Supply and demand and market equilibrium (the supply and demand
      curves, and how their intersection determines market-clearing
      price and quantity; no prerequisites — the unifying framework the
      rest of this subject's microeconomic content builds on)
- [ ] Elasticity and consumer behavior (price elasticity of demand, and
      consumer-choice theory at an overview level; prerequisite: supply-
      and-demand-and-market-equilibrium; a genuine formula candidate)
- [ ] Market structures and competition (perfect competition, monopoly,
      and oligopoly as distinct market structures with different pricing
      behavior; prerequisite: supply-and-demand-and-market-equilibrium)
- [ ] Macroeconomic indicators and national income (GDP, inflation, and
      unemployment as the core measured macroeconomic indicators, and
      what each actually captures; no prerequisites)
- [ ] Monetary and fiscal policy (central-bank monetary-policy tools, and
      government fiscal policy — spending and taxation — and how each
      is meant to affect the economy; prerequisite: macroeconomic-
      indicators-and-national-income)
- [ ] International trade and comparative advantage (the theory of
      comparative advantage, and exchange-rate basics; no prerequisites)

## Phase Econ2 — not yet planned

To be scoped after Econ1 lands.

---
