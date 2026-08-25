# Curriculum — the degree, as data

This folder is the machine-readable version of the University of Tartu BSc
**Füüsika, keemia ja materjaliteadus** (Physics, Chemistry and Materials
Science). It exists so one question has a checkable answer:

> Could someone acquire everything this degree teaches, from this site alone,
> without ever showing up?

Today the answer is *no, not yet* — and the point of this folder is to say
exactly how far off it is, per track, per module, per course.

## Everything here is generated. Do not hand-edit it.

```
content/actual_ut_course/   ← raw scraped ÕIS text. THE SOURCE. Never modified.
        │
        │  npm run curriculum:build
        ▼
content/curriculum/         ← this folder. Regenerated wholesale on every run.
        modules.json          26 modules: number, track, requirement, ECTS, course codes
        courses/{CODE}.json   104 courses: names, ECTS, syllabus topics, outcomes,
                              prerequisites, per-track status, mapped concepts
```

If something here looks wrong, fix the parser in
`scripts/build-curriculum.ts` or the tables in `src/curriculum/translations.ts`
— never the JSON, which the next build overwrites.

The two hand-authored inputs are:

| File | What it holds | Why by hand |
| --- | --- | --- |
| `src/curriculum/translations.ts` | English names for every course and module; the eight uncoded course headings | The source is Estonian-only, and four headings carry no course code |
| `src/curriculum/mapping.ts` | Which platform concepts cover which course | "Does this content actually teach that syllabus" is a judgement, not a string match |

## What is mandatory, what is not

The degree is 180 ECTS. Requirement is **per track**, so every course record
carries a `status` for each of the three:

| Status | Meaning |
| --- | --- |
| `mandatory-all` | Required of every student on the programme, whichever track — the two foundation modules |
| `mandatory` | Required of this track specifically |
| `elective` | Offered to this track as a free choice |
| `minor-only` | Reachable only by taking this subject as a *minor* (kõrvaleriala) |
| `not-in-track` | Not part of this track at all |

Module groups, in the order a student meets them:

| Group | ECTS | Who it binds |
| --- | --- | --- |
| **1. Alusmoodulid** (foundation) | 48 | Everyone, both modules, no choice |
| **2. Suunamoodulid** (direction) | 48 | First module mandatory for your track; second is elective |
| **3. Erialamoodulid** (specialisation) | 48 | Same pattern — first mandatory, second elective |
| **4. Valikmoodulid** (electives) | 12 | Must take 12 ECTS from somewhere |

The foundation modules are why a physics student still has to pass
*Foundations of chemistry* and *Survey course in materials science*, and why a
chemistry student still has to pass *The physical world view*. **The 11
`mandatory-all` courses are the shared spine of all three degrees** and are the
highest-value thing to cover first.

## Course, module, concept — three different things

- A **course** is a unit of the degree (`LOFY.01.007`, 6 EAP). It comes from
  the university and this project does not invent or rename them.
- A **concept** is a unit of the site (`maxwells-equations`). It comes from
  `content/physics/` and is what a learner actually reads and is tested on.
- The **mapping** between them is many-to-many and lives in
  `src/curriculum/mapping.ts`. One concept legitimately serves several courses
  (mechanics appears in the survey course, the mechanics course *and* the lab),
  and one course needs many concepts.

A concept mapped to **no** course is not an error — it is **enrichment**:
material this site teaches that the degree does not require. The coverage
report lists it separately so that stays visible rather than being quietly
counted as progress.

## Reading the coverage report

```bash
npm run curriculum:coverage                      # all three tracks
npm run curriculum:coverage -- --track physics   # one track
npm run curriculum:coverage -- --gaps            # only what is missing
npm run curriculum:coverage -- --extra           # only enrichment
```

```
   *  10 cpt  12t  LOFY.01.007   6 EAP  Electricity and magnetism  [required]
   │   │      │
   │   │      └── syllabus topics parsed from the university's own course page
   │   │          ('--' means no syllabus page was captured for this course)
   │   └────────── platform concepts mapped to it ('none' = not covered at all)
   └────────────── required for this track
```

The report also fails loudly if the mapping names a concept that does not
exist, since a broken join would silently inflate every number in it.

## Where it stands

Physics is the only subject with authored content, so the other two tracks
start from near zero — their share comes entirely from the shared foundation
courses.

| Track | Required courses covered | Required ECTS covered |
| --- | --- | --- |
| Physics | 9 / 20 | 49 / 102 |
| Chemistry | 2 / 21 | 9 / 102 |
| Materials science | 3 / 18 | 15 / 102 |

The plan for closing that is Phases 25–33 in [`todo.md`](../../todo.md). The
short version: physics content already exists and needs finishing (Phases
15–24); chemistry and materials science need building from nothing, and both
need their own subject directories, terminology glossaries and unit registries
before a single concept can be authored.

## Known limits of the parse

- **45 of 104 courses have no syllabus page** in the raw scrape — they appear
  in the module lists with a name and ECTS but nothing more. Their records are
  still generated, marked `hasSyllabus: false`, and shown as `--` in the
  report. All but one are electives; the single exception is
  **`LOKT.07.010` Foundations of chemistry (6 EAP)**, which is required of all
  three tracks and has no captured syllabus — see `todo.md` Phase 25.
- Some courses list prerequisite codes (`LOFY.01.121`, `LOFY.01.091`) that are
  not themselves in the curriculum — older or replaced course versions. They
  are recorded verbatim rather than dropped.
- Two distinct courses share the name *Globaalfüüsika* and two share
  *Laboritöö praktikum*; they are kept apart by code, and their English names
  are disambiguated in the translation table.
- Practical/laboratory courses (`praktikum`) teach bench skills that a static
  site cannot deliver. They are mapped to the concepts underlying the
  experiments, which covers the theory but honestly not the pipetting.
