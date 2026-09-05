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

- [x] Supply and demand and market equilibrium (the supply and demand
      curves, and how their intersection determines market-clearing
      price and quantity; no prerequisites — the unifying framework the
      rest of this subject's microeconomic content builds on; kept
      conceptual)
- [x] Elasticity and consumer behavior (price elasticity of demand, and
      consumer-choice theory at an overview level; prerequisite: supply-
      and-demand-and-market-equilibrium; formalised price elasticity of
      demand, E_d = %ΔQd / %ΔP, as a formula + problem template + error
      model)
- [x] Market structures and competition (perfect competition, monopoly,
      and oligopoly as distinct market structures with different pricing
      behavior; prerequisite: supply-and-demand-and-market-equilibrium;
      kept conceptual)
- [x] Macroeconomic indicators and national income (GDP, inflation, and
      unemployment as the core measured macroeconomic indicators, and
      what each actually captures; no prerequisites; kept conceptual)
- [x] Monetary and fiscal policy (central-bank monetary-policy tools, and
      government fiscal policy — spending and taxation — and how each
      is meant to affect the economy; prerequisite: macroeconomic-
      indicators-and-national-income; kept conceptual)
- [x] International trade and comparative advantage (the theory of
      comparative advantage, and exchange-rate basics; no prerequisites;
      kept conceptual)

Phase Econ1 complete: 6 economics concepts. Authored directly by the
coordinator (a dispatched fork for this same directive did not return a
background handle, so the coordinator executed it directly instead). Only
the elasticity concept got a formula; the rest are conceptual/theory
content (equilibrium reasoning, market-structure distinctions, indicator
measurement caveats, policy-channel differences, comparative-advantage
logic), the same balance most subjects' first phase has struck. Four new
glossary terms added (`price`, `percentage-change-in-quantity-demanded`,
`percentage-change-in-price`, `price-elasticity-of-demand`, domain
`economics`) — the two percentage-change symbols use unit `1` (plain
decimal ratios, e.g. 0.05 for 5%) rather than a `%` unit, since no `%`
unit exists in the unit registry and adding one is a code change outside
a content-only phase's scope, the same kind of adjustment prior phases
have made for other missing units. `npm run validate:content` (20
subjects, 719 concepts), `npm run lint:terminology` (280 glossary terms),
and `npm run typecheck` all pass; every resource URL verified live with
`curl` — several initial guessed Estonian titles 404'd and needed a
second lookup (final: "Pakkumine ja nõudlus", reversed word order from
the natural English-order guess).

## Phase Econ2 — not yet planned

To be scoped after Econ1 lands.

---
