# Oceanography content plan

New subject, fifth item on `SCIENCE_ROADMAP.md`'s build order. Same
content model, same schema, same workflow as every prior subject.

Baseline: `content/oceanography/` does not exist yet — greenfield.

## Scope and framing

"Oceanography" here means ocean science at a bachelor's-degree depth:
seafloor structure, ocean circulation, tides, seawater chemistry, marine
ecosystems, and waves/coastal processes. Checked overlap before drafting:

- Physics's `atmospheric-and-ocean-physics` concept already covers ocean
  density stratification driven by temperature and salinity — read it
  first (`content/physics/concepts/atmospheric-and-ocean-physics.json`).
  This subject's own circulation concept (below) covers the large-scale
  circulation-pattern layer built on top of that stratification physics
  (surface gyres, thermohaline "conveyor belt" circulation), the same
  relationship `meteorology`'s circulation concept has to that same
  physics concept's atmospheric half.
- `earth-science` covers plate tectonics and the rock cycle generally;
  this subject's seafloor-topography concept covers ocean-basin-specific
  features (mid-ocean ridges, trenches, abyssal plains) as oceanographic
  mapping/features, not a restatement of the tectonic mechanism itself.
- `environmental-science`'s `climate-change-mechanisms-and-ecological-
  impacts` concept already mentions ocean acidification as an ecological
  consequence; this subject's own seawater-chemistry concept (below)
  covers the carbonate-buffering chemistry mechanism itself, a different
  angle (mechanism vs. consequence), not a restatement.
- `biology`'s ecology concepts stay organism/population-general; this
  subject's marine-ecosystems concept is the ocean-specific zonation
  (pelagic/benthic, photic/aphotic zones) built on top of that general
  ecological framework, not a restatement of it.
- No existing concept anywhere on the site covers ocean tides — a genuine,
  complete gap (checked; physics's `tidal-disruption-events` is an
  unrelated astrophysical phenomenon, not ocean tides).

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (this phase is mostly systems/descriptive content, so
it's plausible none of it gets one — don't force it).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase Ocean1 — foundational (seafloor structure, circulation, tides,
## seawater chemistry, marine ecosystems, and waves/coastal processes)

Single module for now (`oceanography-fundamentals`), same one-module-
through-later-phases pattern every new subject on this site has started
with.

- [ ] Ocean basin structure and seafloor topography (mid-ocean ridges,
      abyssal plains, ocean trenches, the continental shelf/slope/rise —
      the oceanographic-mapping/features angle; no prerequisites)
- [ ] Ocean circulation and currents (wind-driven surface gyres, and
      thermohaline "conveyor belt" deep circulation — the large-scale
      circulation-pattern layer, distinct from physics's existing
      density-stratification concept; no prerequisites)
- [ ] Tides and tidal mechanisms (the tide-generating forces from the
      Moon and Sun, spring vs. neap tides, and the different tidal
      patterns coastlines actually show — an entire topic absent from
      every existing subject; no prerequisites)
- [ ] Ocean chemistry and seawater composition (salinity, dissolved
      gases, and the carbonate-buffering system behind ocean
      acidification — the chemistry-mechanism angle, distinct from
      environmental-science's ecological-consequence framing of the same
      phenomenon; no prerequisites)
- [ ] Marine ecosystems and biological zonation (pelagic vs. benthic
      zones, the photic/aphotic zone boundary, and marine food-web
      structure — the ocean-specific zonation layer on top of biology's
      general ecology; no prerequisites)
- [ ] Waves and coastal processes (wind-wave formation and mechanics, and
      coastal erosion/deposition processes; no prerequisites)

## Phase Ocean2 — not yet planned

To be scoped after Ocean1 lands.

---
