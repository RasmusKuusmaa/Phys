# Meteorology content plan

New subject, fourth item on `SCIENCE_ROADMAP.md`'s build order. Same
content model, same schema, same workflow as every prior subject.

Baseline: `content/meteorology/` does not exist yet — greenfield.

## Scope and framing

"Meteorology" here means atmospheric science at the synoptic/applied
level: weather systems, atmospheric circulation, cloud/precipitation
processes, severe weather, forecasting, and climate classification, at a
bachelor's-degree depth. Checked overlap before drafting: physics's
`atmospheric-and-ocean-physics` concept already covers the fundamental
physics — hydrostatic balance, adiabatic cooling of a rising air parcel,
why the troposphere cools with altitude — read it first
(`content/physics/concepts/atmospheric-and-ocean-physics.json`). This
subject does not restate that parcel-level physics; it covers the
synoptic/systems layer built on top of it (air masses, fronts, circulation
cells, storm systems, forecasting) the way `general-engineering` builds on
physics's mechanics rather than restating it. `environmental-science`'s
`climate-change-mechanisms-and-ecological-impacts` concept covers
human-driven climate change's ecological consequences; this subject's own
climate-classification concept (below) covers natural regional climate
patterns and variability (Köppen classification, ENSO), a different angle
entirely — not human-driven change. `oceanography` (a later
`SCIENCE_ROADMAP.md` item) will need the same differentiation check
against the physics concept's ocean-density-stratification half when its
own turn comes.

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (this phase is mostly systems/classification content,
so it's plausible none of it gets one — don't force it).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase Met1 — foundational (air masses and fronts, atmospheric
## circulation, clouds and precipitation, storms, forecasting, and climate
## classification)

Single module for now (`meteorology-fundamentals`), same one-module-
through-later-phases pattern every new subject on this site has started
with.

- [x] Air masses and weather fronts (air mass classification by source
      region, and the four front types — cold, warm, occluded, stationary —
      and the weather each produces; no prerequisites; kept conceptual)
- [x] Atmospheric circulation and global wind patterns (the Hadley/Ferrel/
      polar circulation cells, the jet stream, and the Coriolis effect's
      role in wind direction — the planetary-circulation-pattern angle,
      distinct from physics's existing parcel-level adiabatic-cooling
      concept; no prerequisites; kept conceptual)
- [x] Cloud formation and precipitation mechanisms (condensation nuclei,
      the major cloud classification types, and precipitation-formation
      processes — collision-coalescence and the Bergeron process; no
      prerequisites; kept conceptual)
- [x] Cyclones, anticyclones, and severe weather (extratropical cyclone
      structure, hurricane/typhoon formation and structure, tornado
      formation; prerequisite: air-masses-and-weather-fronts; kept
      conceptual)
- [x] Weather forecasting and atmospheric predictability (numerical
      weather prediction at a conceptual level, synoptic analysis, and
      the chaos-theory-driven limits on forecast predictability; no
      prerequisites; kept conceptual)
- [x] Climate classification and regional climate patterns (the Köppen
      climate classification system, monsoon systems, and the El Niño-
      Southern Oscillation — natural climate variability, distinct from
      `environmental-science`'s human-driven climate-change concept; no
      prerequisites; kept conceptual)

Phase Met1 complete: 6 meteorology concepts. None got a formula — this
phase is systems/classification content throughout, and no clean single
numeric relationship stood out at this synoptic depth (consistent with the
plan's own prediction). No new glossary terms needed. All 12 resource URLs
(6 concepts × EN/ET) individually curl-verified live. One Estonian resource
is an honest close match rather than an exact-topic match: `air-masses-
and-weather-fronts` links to the general "Front" (front) article since
Estonian Wikipedia has no dedicated "weather front" article combining both
front types and air-mass classification at this concept's exact scope.
`npm run validate:content` (13 subjects, 671 concepts — includes sibling
`environmental-science` and other subjects that landed concurrently),
`npm run lint:terminology` (272 glossary terms), and `npm run typecheck`
all pass; working tree clean.

## Phase Met2 — not yet planned

To be scoped after Met1 lands.

---
