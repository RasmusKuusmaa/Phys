# Environmental science content plan

New subject, third item on `SCIENCE_ROADMAP.md`'s build order. Same content
model, same schema, same workflow as every prior subject.

Baseline: `content/environmental-science/` does not exist yet — greenfield.

## Scope and framing

"Environmental science" here means the applied, systems-level, and
biosphere-facing layer that sits on top of `biology` (organismal/
population/community ecology) and `earth-science` (the solid-Earth
foundation) — biogeochemical cycles, pollution, conservation, resource
management, and human environmental impact. Checked overlap before
drafting:

- `biology`'s Phase Bio1 already covers population ecology and community
  ecology (competition, predation, mutualism) at the organismal/population
  level; this subject does not restate those, and biodiversity/
  conservation biology was deliberately reassigned here (not left in
  `biology`) rather than risk both subjects independently covering it —
  see `BIOLOGY_PLAN.md`'s own note.
- `earth-science` covers the solid-Earth foundation (rocks, plate
  tectonics, geologic time) this subject builds on but does not restate.
- Physics's `the-greenhouse-effect-and-planetary-energy-balance` concept
  covers the radiative physics of the greenhouse effect; this subject's
  own climate concept (below) covers ecological/environmental
  consequences and feedback loops from a systems/impact perspective, not
  the radiative-transfer mechanism itself.
- `meteorology`/`oceanography` (later `SCIENCE_ROADMAP.md` items) will own
  atmospheric dynamics and ocean physics/chemistry specifically — this
  subject does not reach into weather systems or ocean circulation.

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (ecological footprint / carrying capacity and
bioaccumulation are plausible candidates in this phase).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase EnvSci1 — foundational (biogeochemical cycles, pollution,
## conservation biology, resource management, climate impacts, and human
## environmental footprint)

Single module for now (`environmental-science-fundamentals`), same
one-module-through-later-phases pattern every new subject on this site has
started with.

- [ ] Biogeochemical cycles (the carbon, nitrogen, water, and phosphorus
      cycles as biosphere-level systems; no prerequisites — the unifying
      systems framework the rest of this subject builds on)
- [ ] Pollution and environmental contamination (air, water, and soil
      pollution mechanisms, and bioaccumulation/biomagnification through
      a food web; no prerequisites)
- [ ] Conservation biology and extinction mechanisms (habitat
      fragmentation, the mechanisms driving species extinction, and
      conservation strategies; no prerequisites)
- [ ] Natural resource management and sustainability (renewable vs.
      non-renewable resources, the sustainable-yield concept; no
      prerequisites)
- [ ] Climate change mechanisms and ecological impacts (feedback loops,
      sea-level rise, species range shifts, ocean acidification — the
      ecological/systems consequences layer, distinct from physics's
      existing greenhouse-effect radiative-physics concept; no
      prerequisites)
- [ ] Environmental impact assessment and ecological footprint (EIA
      methodology, the ecological-footprint concept applied to human
      populations — a genuine formula candidate; no prerequisites)

## Phase EnvSci2 — not yet planned

To be scoped after EnvSci1 lands.

---
