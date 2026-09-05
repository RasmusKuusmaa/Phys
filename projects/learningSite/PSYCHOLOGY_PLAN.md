# Psychology content plan

New subject, eleventh item on `SCIENCE_ROADMAP.md`'s build order. Same
content model, same schema, same workflow as every prior subject.

Baseline: `content/psychology/` does not exist yet — greenfield.

## Scope and framing

"Psychology" here means general psychological science at a bachelor's-
degree depth: research methods, cognition and memory, developmental
psychology, social psychology, personality, and learning theory. Checked
overlap before drafting: medicine's `psychiatry-and-behavioral-medicine`
module (`mood-disorder-mechanisms`, `anxiety-disorder-mechanisms`,
`psychotic-disorder-mechanisms`, `substance-use-disorder-mechanisms`,
`stress-the-hpa-axis-and-psychosomatic-mechanisms`, `sleep-and-circadian-
disorders-in-a-clinical-context`) covers clinical/neurobiological disorder
mechanisms specifically — this subject stays at the general psychological-
science level (normal cognition, development, social behavior, learning),
not clinical disorder mechanism, and does not restate any of medicine's
neurobiological framing. `statistics-and-data-science`'s hypothesis-
testing/experimental-design content is domain-agnostic; this subject's own
`research-methods-in-psychology` concept (below) covers the
psychology-specific methodological issues (operationalizing constructs,
WEIRD-sample generalizability, demand characteristics), not a restatement
of general statistical methodology.

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (this phase is mostly conceptual/theory content, so
it's plausible none of it gets one — don't force it).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase Psych1 — foundational (research methods, cognition and memory,
## developmental psychology, social psychology, personality, and learning
## theory)

Single module for now (`psychology-fundamentals`), same one-module-
through-later-phases pattern every new subject on this site has started
with.

- [x] Research methods in psychology (experimental vs. correlational
      research, operationalizing psychological constructs, and the
      specific methodological issues psychology faces — demand
      characteristics, generalizability from unrepresentative samples;
      no prerequisites — the methodological framework the rest of this
      subject's own findings should be read through; kept conceptual)
- [x] Cognitive psychology and memory (the sensory/short-term/long-term
      memory model, encoding and retrieval processes, and forgetting
      mechanisms; no prerequisites; kept conceptual)
- [x] Developmental psychology and lifespan development (major
      developmental-stage theories — e.g. Piaget's cognitive stages —
      and attachment theory; no prerequisites; kept conceptual)
- [x] Social psychology and group behavior (conformity, obedience, group
      dynamics, and attribution theory — the classic social-psychology
      phenomena; no prerequisites; kept conceptual)
- [x] Personality psychology and individual differences (trait theories —
      the Big Five — and the nature-vs-nurture debate in personality; no
      prerequisites; kept conceptual)
- [x] Learning theory and behaviorism (classical and operant
      conditioning — distinct from medicine's neurobiological reward-
      circuit framing of substance use, this is the behavioral/learning-
      theory level; no prerequisites; kept conceptual)

Phase Psych1 complete: 6 psychology concepts. None got a formula — this
phase is conceptual/theory content throughout (research-design reasoning,
memory-systems distinctions, developmental-stage qualitative differences,
classic social-psychology phenomena, trait-vs-type personality framing,
and the classical/operant conditioning distinction), matching the balance
the plan anticipated. No new glossary terms needed. All 12 resource URLs
individually curl-verified live; several initial guessed titles 404'd and
needed a second lookup (final: "Meetod" for research methods, "Atkinson–
Shiffrin memory model" for the EN memory concept, "Kiindumussuhe" for
attachment theory, "Isiksus" for the general personality article — none of
these four topics has a dedicated Estonian/English article at the exact
guessed title, but each of the four found is a genuine, directly relevant
match). `npm run validate:content` (20 subjects, 719 concepts — includes a
sibling `economics` subject landing concurrently, untouched by this
directive), `npm run lint:terminology` (280 glossary terms), and `npm run
typecheck` all pass; working tree clean except that sibling subject's own
in-flight files.

## Phase Psych2 — not yet planned

To be scoped after Psych1 lands.

---
