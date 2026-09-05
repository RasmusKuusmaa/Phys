# Chemical engineering content plan

New subject, tenth item on `SCIENCE_ROADMAP.md`'s build order. Same
content model, same schema, same workflow as every prior subject.

Baseline: `content/chemical-engineering/` does not exist yet — greenfield.

## Scope and framing

"Chemical engineering" here means the standard chemical/process
engineering curriculum: mass and energy balances, reactor design,
separation processes, transport phenomena, process safety, and catalysis/
industrial processes. Checked overlap before drafting:

- Chemistry already has thorough reaction-kinetics content
  (`reaction-kinetics`, `reaction-rate-laws-and-order`,
  `arrhenius-equation-and-activation-energy`) — this subject's own
  `reactor-design-and-reaction-engineering` concept builds the
  process/reactor-design layer on top (batch/CSTR/PFR reactor types,
  residence time, conversion), not a restatement of chemical kinetics
  itself.
- `general-engineering` already has `engineering-fluid-mechanics`,
  `heat-exchanger-design-and-thermal-systems`, and `control-systems-and-
  feedback` — this subject's `transport-phenomena-momentum-heat-and-mass-
  transfer` concept covers the unified transport-phenomena theory
  chemical engineers use (the analogies between momentum/heat/mass
  transfer), a genuinely distinct course topic from those more
  applied-systems-level concepts, not a restatement.
- `general-engineering` already has `reliability-engineering-and-systems-
  safety` (general reliability/FMEA); this subject's own
  `process-safety-and-hazard-analysis` concept covers chemical-process-
  specific hazards (runaway reactions, toxic release, HAZOP methodology),
  a distinct professional angle.
- `general-engineering` already has `engineering-economics`; this subject
  does not re-cover general engineering economics.

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (mass/energy balance and reactor conversion are the
clearest candidates in this phase).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase ChemE1 — foundational (mass/energy balances, reactor design,
## separation processes, transport phenomena, process safety, and
## catalysis/industrial processes)

Single module for now (`chemical-engineering-fundamentals`), same
one-module-through-later-phases pattern every new subject on this site has
started with.

- [ ] Mass and energy balances in process engineering (the conservation-
      based accounting method every chemical process analysis starts
      from; no prerequisites — the foundational entry point the rest of
      this subject builds on; a genuine formula candidate)
- [ ] Reactor design and reaction engineering (batch, CSTR, and PFR
      reactor types, residence time, and conversion — the process-design
      layer built on top of chemistry's existing kinetics content, not a
      restatement of it; prerequisite: mass-and-energy-balances-in-
      process-engineering)
- [ ] Separation processes and distillation (distillation, extraction,
      and absorption as separation techniques based on phase
      equilibrium; no prerequisites)
- [ ] Transport phenomena: momentum, heat, and mass transfer (the unified
      transport-phenomena framework and the analogies between its three
      forms — distinct from general-engineering's more applied-systems-
      level fluid-mechanics/heat-exchanger concepts; no prerequisites)
- [ ] Process safety and hazard analysis (HAZOP methodology, and
      chemical-process-specific hazards — runaway reactions, toxic
      release — distinct from general-engineering's general reliability-
      engineering concept; no prerequisites)
- [ ] Catalysis and industrial chemical processes (heterogeneous vs.
      homogeneous catalysis, and 1-2 landmark industrial processes —
      e.g. the Haber-Bosch process — as concrete illustrations;
      prerequisite: reactor-design-and-reaction-engineering)

## Phase ChemE2 — not yet planned

To be scoped after ChemE1 lands.

---
