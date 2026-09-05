# Civil engineering content plan

New subject, ninth item on `SCIENCE_ROADMAP.md`'s build order. Same
content model, same schema, same workflow as every prior subject.

Baseline: `content/civil-engineering/` does not exist yet — greenfield.

## Scope and framing

"Civil engineering" here means the standard civil-engineering curriculum
built on top of `general-engineering`'s existing statics/mechanics-of-
materials/FEA foundation — structural design, reinforced concrete,
geotechnical engineering, transportation engineering, water resources
engineering, and bridge engineering. Checked overlap before drafting:

- `general-engineering` already has `statics-and-equilibrium-of-
  structures`, `mechanics-of-materials`, and
  `finite-element-analysis-fundamentals` — the generic structural-
  mechanics foundation. This subject's own `structural-design-and-load-
  analysis` concept (below) builds the civil-specific load-analysis layer
  on top (dead/live/wind/seismic loads, load combinations, code-driven
  safety factors), not a restatement of basic stress/strain.
- `materials-science` covers materials generically; this subject's
  `reinforced-concrete-design-principles` concept covers the
  composite-behavior engineering application (why concrete needs steel
  reinforcement, how the two materials share load), not materials
  science itself.
- `earth-science` covers geology generically (rocks, minerals, plate
  tectonics); this subject's `geotechnical-engineering-and-soil-
  mechanics` concept is the applied foundation-engineering layer
  (soil classification for bearing capacity, foundation types), a
  distinct professional discipline from geology itself.
- `general-engineering`'s `engineering-fluid-mechanics` concept covers
  generic pipe-flow/pump-system fluid mechanics; this subject's own
  `water-resources-and-hydraulic-engineering` concept covers hydrology
  and civil hydraulic structures (dams, culverts, stormwater) instead,
  not a restatement of pipe-flow fundamentals.

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (this phase is mostly design-reasoning content, so
it's plausible little of it gets one — don't force it).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase CE1 — foundational (structural load analysis, reinforced
## concrete, geotechnical engineering, transportation engineering, water
## resources, and bridge engineering)

Single module for now (`civil-engineering-fundamentals`), same one-module-
through-later-phases pattern every new subject on this site has started
with.

- [x] Structural design and load analysis (dead, live, wind, and seismic
      loads; load combinations and code-driven safety factors — the
      civil-specific load-analysis layer, distinct from
      `general-engineering`'s generic stress/strain treatment;
      prerequisite: none — will reference the same concepts
      `general-engineering`'s `mechanics-of-materials` covers, but the
      architecture has no cross-subject prerequisites so this stands
      alone; kept conceptual)
- [x] Reinforced concrete design principles (why concrete needs steel
      reinforcement, and how the two materials share tensile/compressive
      load; no prerequisites; kept conceptual)
- [x] Geotechnical engineering and soil mechanics (soil classification
      for bearing-capacity purposes, and the major foundation types —
      shallow vs. deep; no prerequisites; kept conceptual)
- [x] Transportation engineering and highway design (traffic-flow
      fundamentals, pavement design at an overview level, and highway
      geometric design principles; no prerequisites; kept conceptual)
- [x] Water resources and hydraulic engineering (hydrology basics,
      stormwater management, and hydraulic structures — dams, culverts —
      distinct from general-engineering's pipe-flow-focused fluid
      mechanics; no prerequisites; kept conceptual)
- [x] Structural systems in bridge engineering (truss, beam, arch, and
      suspension bridge types and the distinct structural mechanism each
      relies on; no prerequisites; kept conceptual)

Phase CE1 complete: 6 civil-engineering concepts. Authored directly (not
via a dispatched fork — this directive was executed as a worker fork of
the coordinating session directly). None got a formula — every concept's
real content is a design-reasoning distinction (load-combination logic,
tension/compression material partnership, soil-driven foundation choice,
nonlinear traffic-flow/layered-pavement design, peak-flow-managing
stormwater strategy, and four genuinely different bridge load paths), not
a single clean numeric relationship. One terminology fix needed: the
structural-design concept's Estonian text originally used "kaal" (weight)
for "self-weight," which trips the banned-variant linter regardless of
correct usage (the same false-positive class prior phases on other
subjects have hit) — rephrased to "raskus." All 12 resource URLs
individually curl-verified live, including several exact-title Estonian
matches (Koormus, Raudbetoon, Sild) and three honest adjacent matches
(Ehitusgeoloogia for geotechnical engineering, Maantee for transportation
engineering, Vesiehitus for hydraulic engineering — none has a dedicated
Estonian article at the concept's exact scope). `npm run validate:content`
(18 subjects, 705 concepts), `npm run lint:terminology` (276 glossary
terms, no new terms needed), and `npm run typecheck` all pass.

## Phase CE2 — not yet planned

To be scoped after CE1 lands.

---
