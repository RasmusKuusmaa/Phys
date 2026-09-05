# Science roadmap

Master index of every scientific subject this site covers or intends to
cover, per the user's instruction to list all important scientific areas
and implement them one by one. Each subject gets its own `<SUBJECT>_PLAN.md`
file (same pattern as every subject built so far) tracking its own phases,
module roadmap, and eventual "judged comprehensive" call. This file is
just the top-level index — do not duplicate phase-level detail here, link
to the subject's own plan file instead.

Scope bar for every subject: the same one every subject so far has used —
"foundational through graduate, every genuine standard-textbook topic,"
translated into whatever that field's own curriculum shape actually is
(taught-MSc/early-PhD depth for the hard sciences; the applied/professional
equivalent for engineering and clinical fields). See `QUESTIONS.md` for the
judgment-call reasoning behind this bar, repeated for every subject.

## Already judged comprehensive

| Subject | Concepts | Plan file |
| --- | --- | --- |
| Physics | 341 | `MSC_PHYSICS_PLAN.md` (+ `todo.md` for the original bachelor build) |
| Mathematics | 59 | `MATH_PLAN.md` |
| Chemistry | 47 | `CHEMISTRY_PLAN.md` |
| Materials science | 21 | `MATERIALS_SCIENCE_PLAN.md` |
| Aerospace engineering | 18 | `AEROSPACE_ENGINEERING_PLAN.md` |
| General engineering | 17 | `GENERAL_ENGINEERING_PLAN.md` |
| Biohacking | 15 | `BIOHACKING_PLAN.md` |
| Medicine | 125 | `MEDICINE_PLAN.md` |

## Existing but incomplete

- **Computing** (4 concepts: algorithms-and-program-structure, control-flow,
  data-structures-and-algorithms, numerical-methods-in-computing) — a thin,
  pre-existing stub from before this content-building effort started,
  never brought to the same depth bar as everything else. Renamed in scope
  below to **Computer science** and slotted into the build order — its
  existing 4 concepts stay as-is and get built around rather than redone.

## Not yet started — build order

Grouped by the standard science-taxonomy branches, prioritized roughly by
how foundational/broadly load-bearing each is, and checked against what
already exists elsewhere on the site to avoid overlap before each one's own
`_PLAN.md` does the detailed check.

### Life sciences

1. **Biology** — general/foundational biology: evolution and natural
   selection, ecology and ecosystems, taxonomy and biodiversity, botany,
   zoology, population/organismal genetics. Distinct from `medicine`
   (human-body-specific) and `chemistry`'s `biochemistry` module
   (molecular structure/kinetics) — this is the field itself, at the scope
   a bachelor's biology degree covers before specializing into medicine,
   biochemistry, or ecology as their own careers.

### Earth and environmental sciences

2. **Earth science / geology** — plate tectonics, mineralogy, the rock
   cycle, geologic time, seismology, volcanology.
3. **Environmental science and ecology** — ecosystem dynamics, biodiversity
   and conservation, biogeochemical cycles, environmental impact and
   sustainability — the applied/systems layer on top of `biology`'s
   ecology foundations.
4. **Meteorology and climate science** — atmospheric structure and
   dynamics, weather systems, climate forcing and feedback mechanisms,
   distinct from physics's existing thermodynamics/fluid-mechanics content
   (which stays general-physics, not atmosphere-specific).
5. **Oceanography** — ocean circulation, marine chemistry, marine
   ecosystems, tides and waves at an oceanographic (not pure-physics) depth.

### Formal and computational sciences

6. **Computer science** (upgrade of the existing `computing` stub) —
   algorithms and complexity, data structures, programming-language
   theory, operating systems, databases, computer architecture, networks,
   software engineering principles.
7. **Statistics and data science** — checked overlap first: mathematics
   already has probability distributions, Bayes' theorem, Markov chain
   Monte Carlo, and other machinery; this subject is the applied,
   inference-and-methodology layer built on top of it (hypothesis testing
   as its own discipline, experimental design, machine learning
   foundations, data science practice) — the same kind of relationship
   `general-engineering` has to `physics`.

### Additional engineering disciplines

8. **Electrical engineering** — checked overlap first: physics already
   covers circuit theory (Kirchhoff's laws, RC/RL/AC circuits,
   Thevenin/Norton) fairly thoroughly; this subject is the
   engineering-design layer (digital logic, signal processing,
   power systems, electronics/semiconductor devices at a design level)
   rather than re-deriving circuit physics.
9. **Civil engineering** — structural engineering (building on
   `general-engineering`'s mechanics-of-materials), geotechnical
   engineering, transportation engineering, water resources engineering —
   an entire standard engineering discipline absent from the site.
10. **Chemical engineering** — process engineering, reaction engineering,
    separation processes, transport phenomena — checked overlap with
    `chemistry` and `general-engineering`'s fluid-mechanics/thermodynamics
    content first in that subject's own plan file.

### Behavioral and social sciences

11. **Psychology** — checked overlap first: `medicine`'s
    `psychiatry-and-behavioral-medicine` module covers clinical/mechanistic
    psychiatric conditions; this subject is general psychological science
    (cognitive psychology, developmental psychology, social psychology,
    research methodology) rather than clinical mechanism.
12. **Economics** — microeconomics, macroeconomics, econometrics —
    checked overlap with mathematics/statistics first in that subject's
    own plan file.

## Build discipline

Identical to every subject so far: one `<SUBJECT>_PLAN.md` per subject
(same structure as `MEDICINE_PLAN.md` — scope/framing, commit discipline,
phased module roadmap), one commit per concept, single-line messages, the
full concept/misconceptions/item/resource/explanation set gated by
`npm run validate:content && npm run lint:terminology` before every commit.
Update this file's checklist as each subject lands and gets its own
comprehensiveness judgment, logged in `QUESTIONS.md` same as always.
