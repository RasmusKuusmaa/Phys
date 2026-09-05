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

## Phase 1 built, not yet judged comprehensive

All twelve subjects originally listed below under "not yet started" now
have a foundational first phase built and committed — the initial sweep
this roadmap set out to do is complete. None of these twelve has had a
second phase scoped yet, let alone been judged comprehensive; each one's
own `_PLAN.md` has a "Phase 2 — not yet planned" placeholder (or, for
`computing`, "Phase CS2") ready for whenever that subject's turn comes
around again.

| Subject | Concepts | Plan file |
| --- | --- | --- |
| Biology | 6 | `BIOLOGY_PLAN.md` |
| Earth science | 6 | `EARTH_SCIENCE_PLAN.md` |
| Environmental science | 6 | `ENVIRONMENTAL_SCIENCE_PLAN.md` |
| Meteorology | 6 | `METEOROLOGY_PLAN.md` |
| Oceanography | 6 | `OCEANOGRAPHY_PLAN.md` |
| Computer science (subject slug `computing`) | 10 (4 pre-existing + 6 new) | `COMPUTING_PLAN.md` |
| Statistics and data science | 6 | `STATISTICS_AND_DATA_SCIENCE_PLAN.md` |
| Electrical engineering | 6 | `ELECTRICAL_ENGINEERING_PLAN.md` |
| Civil engineering | 6 | `CIVIL_ENGINEERING_PLAN.md` |
| Chemical engineering | 6 | `CHEMICAL_ENGINEERING_PLAN.md` |
| Psychology | 6 | `PSYCHOLOGY_PLAN.md` |
| Economics | 6 | `ECONOMICS_PLAN.md` |

Cross-subject overlap was checked before each one's Phase 1 was drafted —
see each subject's own "Scope and framing" section for the specific
differentiation against whatever existing subject sat closest to it
(mostly physics, general-engineering, medicine, and each other — e.g.
earth-science vs. physics's planetary-physics module, meteorology vs.
earth-science, oceanography vs. both, electrical/civil/chemical
engineering vs. general-engineering and the relevant science subject).

Site total as of this milestone: 20 subjects, 719 concepts
(`npm run validate:content`), 280 glossary terms (`npm run
lint:terminology`); `npm run typecheck` and the full test suite (150/150)
both pass.

## Build discipline

Identical to every subject so far: one `<SUBJECT>_PLAN.md` per subject
(same structure as `MEDICINE_PLAN.md` — scope/framing, commit discipline,
phased module roadmap), one commit per concept, single-line messages, the
full concept/misconceptions/item/resource/explanation set gated by
`npm run validate:content && npm run lint:terminology` before every commit.
Update this file's table as each subject's later phases land and it
eventually gets its own comprehensiveness judgment, logged in
`QUESTIONS.md` same as always.

## Next steps (not yet started)

With every listed area's Phase 1 in place, continuing this effort means
picking up each subject's own "Phase 2 — not yet planned" section one at a
time (same content-generation workflow, just scoped fresh per subject
based on what Phase 1 actually covered) — there is no more top-level
"first area to pick" decision left to make here; it is now twelve parallel
"which subject's Phase 2 next" decisions, each one local to that subject's
own plan file.
