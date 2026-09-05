# Earth science content plan

New subject, second item on `SCIENCE_ROADMAP.md`'s build order. Same
content model, same schema, same workflow as every prior subject.

Baseline: `content/earth-science/` does not exist yet — greenfield.

## Scope and framing

"Earth science" here means geology in the traditional sense: the solid
Earth's structure, composition, and dynamic processes — plate tectonics,
rocks and minerals, geologic time, seismology, and volcanism — at a
bachelor's-degree depth. Checked overlap before drafting: physics's
`planetary-physics` module already has a `plate-tectonics-and-earths-
interior` concept, but it is framed entirely as physics — Earth's interior
layered by density, mantle convection driven by buoyancy/pressure-gradient
physics — not the geological evidence, boundary classification, or surface
consequences. This subject's own `plate-tectonics-and-continental-drift`
concept (below) covers the geological angle instead: the three boundary
types (divergent/convergent/transform) and their distinct surface
expressions, and the historical evidence trail (matching coastlines and
fossil distributions across continents, seafloor magnetic striping,
paleomagnetism) that established the theory — genuinely distinct from the
physics concept's mantle-convection-mechanism framing, not a restatement of
it. Physics's `atmospheric-and-ocean-physics` concept is similarly a
physics-of-fluids framing that `meteorology` and `oceanography` (later
items on `SCIENCE_ROADMAP.md`) will need to differentiate against the same
way when their own turn comes — noting it here for that future plan file to
check. `environmental-science` (also later on the roadmap) will cover
biosphere-level systems layered on top of this subject's solid-Earth
foundation — this subject does not reach into ecology or biogeochemical
cycles, which belong there instead.

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (earthquake magnitude scales are the clearest
candidate in this phase).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase ES1 — foundational (plate tectonics, rocks and minerals, geologic
## time, seismology, volcanism)

Single module for now (`earth-science-fundamentals`), same one-module-
through-later-phases pattern every new subject on this site has started
with.

- [ ] Plate tectonics and continental drift (the geological angle: plate
      boundary types — divergent, convergent, transform — their distinct
      surface expressions, and the historical evidence trail that
      established the theory — matching coastlines/fossils, seafloor
      magnetic striping, paleomagnetism; distinct from physics's existing
      `plate-tectonics-and-earths-interior` concept, which covers the
      mantle-convection mechanism, not this evidence/classification angle;
      no prerequisites — the unifying framework the rest of this subject
      builds on)
- [ ] Rock cycle and rock classification (igneous, sedimentary, and
      metamorphic rock formation and how one rock type transforms into
      another; no prerequisites)
- [ ] Mineralogy and mineral identification (mineral crystal structure and
      the physical properties — hardness, cleavage, streak, luster — used
      to identify one; prerequisite: rock-cycle-and-rock-classification)
- [ ] Geologic time and stratigraphy (relative vs. absolute dating, the
      principle of superposition, the geologic time scale; no
      prerequisites)
- [ ] Seismology and earthquake mechanisms (fault types, seismic wave
      types, and earthquake magnitude scales — a genuine formula
      candidate; prerequisite: plate-tectonics-and-continental-drift)
- [ ] Volcanism and volcanic hazards (volcano types, how magma composition
      controls eruption style, volcanic hazards; prerequisite: plate-
      tectonics-and-continental-drift)

## Phase ES2 — not yet planned

To be scoped after ES1 lands.

---
