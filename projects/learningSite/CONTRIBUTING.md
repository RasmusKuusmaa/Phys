# Contributing content

This guide is about adding or editing **content** — concepts, formulas,
explanations, misconceptions, test items and resources. For how the app is
built, see [`README.md`](./README.md); for scope and policy decisions, see
[`DECISIONS.md`](./DECISIONS.md).

## The non-negotiable rule: both locales, every time

**No concept may exist with only one locale filled in.** English is the
source locale; Estonian is a required parallel locale, not a translation
pass done later. Author both in the same sitting — `npm run validate:content`
fails the build on any missing or stale translation, and CI runs it on every
push.

This applies to everything with an `en`/`et` pair: concept titles and
summaries, misconception text, quiz item stems and options, formula symbol
names. It does **not** apply to formula LaTeX, expressions, units, sample
ranges or IDs — those are language-neutral by design.

Resources are the one exception to "translate together": the English and
Estonian resource sets for a concept are curated **independently**, not
translated from one another — see [Resources](#resources) below.

## Content layout

All content lives under `content/<subject>/` (currently only `physics/`) as
JSON, plus MDX for prose explanations:

```
content/physics/
  concepts/            Concept.ts       — title, summary, prerequisites, level, module
  formulas/            Formula.ts       — LaTeX, symbols, units, solve-for expressions
  problem-templates/   ProblemTemplate.ts — variable ranges + constraints for one formula
  error-models/        ErrorModel.ts    — wrong-answer expressions per solve-for target
  misconceptions/      Misconception.ts — three-per-concept, hand-authored
  concept-items/       ConceptItem.ts   — multiple-choice / proportionality / formula-selection / ordering
  resources/           Resource.ts      — one EN + one ET curated link per concept, minimum
  explanations/        {conceptId}-{locale}.mdx — quick-explanation prose, one per locale
content/terminology/
  glossary.json         locked EN↔ET term pairs with a source citation each
  banned-variants.json  known-wrong Estonian renderings, flagged by the linter
```

Every JSON schema lives in `src/schema/` and is the source of truth for
required fields — read the schema before authoring a new file of that type.

## Adding a concept

**Start with the scaffold, not with an empty file:**

```bash
npm run content:new-concept -- --id quantum-tunneling --module quantum-mechanics \
  --level L3 --prerequisites wavefunctions-and-probability
```

That writes every file a concept needs at once — the concept, three
misconceptions, one concept item, a resource slot per locale, and an
explanation stub per locale — each pre-filled with obvious `TODO(en)` /
`TODO(et)` placeholders in both locales. Your job is then to *replace* text,
not to remember which seven file types exist. This exists because the
"author the concept now, add the rest later" path is what shipped 29
half-finished concepts in Phase 11b, and nothing caught it until deploy.

Then fill in, in this order:

1. `content/physics/concepts/{id}.json` — `title`, `summary`
   (both locales), `level` (`L0`–`L3`), `module`, and `prerequisites` (an
   array of existing concept IDs — this feeds the roadmap's topological
   sort, so don't hand-order it, and don't introduce a cycle).
2. If the concept has a canonical formula, add it under `formulas/` with a
   matching `problem-templates/` and `error-models/` entry (see below). The
   scaffold does *not* create these — not every concept is quantitative —
   but a formula without both of them fails validation.
3. `misconceptions/{id}-m1..m3.json` — at least three, hand-authored.
4. `concept-items/{id}-item1.json` — at least one (the item type doesn't
   matter; pick whichever fits the concept).
5. `resources/` — at least one per locale, and **delete the `-todo` slots**;
   they point at `https://example.invalid/…` precisely so a forgotten one
   fails `npm run check:links` (see [Resources](#resources)).
6. `explanations/{id}-en.mdx` and `explanations/{id}-et.mdx` — 2–3 short
   paragraphs building intuition beyond the one-line summary. Required in
   both locales: the *page* still degrades gracefully if one is absent
   (`loadExplanation` returns null and the section is skipped), but
   validation fails, so a concept can't ship without one.
7. Run `npm run validate:content && npm run lint:terminology && npm test`.

Not every concept needs a formula — purely qualitative concepts (Newton's
first law, wave-particle duality) ship without one.

### What "complete" means, and how it's enforced

`npm run validate:content` fails on a concept that has fewer than three
misconceptions, no concept item, no resource in either locale, no
explanation in either locale, a formula with no problem template or error
model, an item option pointing at a misconception that doesn't exist, or any
record pointing at a concept id that doesn't exist.

`npm run content:coverage` prints the same requirements as a per-concept
table (`-- --incomplete` to show only the gaps), which is the fastest way to
see what's left to author.

The waiver list in `src/content/coverageWaivers.ts` is currently **empty**,
so enforcement is unconditional. A concept that is knowingly mid-authoring
can be listed there to downgrade its coverage failures to warnings. Two
things make that safe rather than a rug to sweep work under:

- A concept **not** on the list must be complete, so a newly added concept
  fails immediately unless someone deliberately waives it.
- A waiver for a concept that is *already* complete is itself a build
  error, so the list can't rot — clearing the backlog forces it to empty.

## Formulas, problem templates and error models

A `Formula` declares its symbols, canonical units, and one evaluable
expression per solve-for target (see `src/lib/formula/expression.ts` for the
supported operators and functions — it's a small hand-rolled evaluator, not
`eval`, so unsupported functions like `asin`/`acos` will fail validation).

Every `Formula` needs a matching `ProblemTemplate` (variable sampling ranges
— pick pedagogically realistic magnitudes, not just "any number") and an
`ErrorModel` (plausible wrong-answer expressions, not random noise — each
should represent an actual conceptual slip, like forgetting a factor of two
or dividing instead of multiplying).

If a formula's expression references a unit not yet in the registry
(`src/lib/units/registry.ts`), add it there with a correct SI dimension
vector and, if it's not the coherent SI unit, the right `toBase` conversion
factor.

## Terminology

Estonian physics terminology is **locked in the glossary, not derived from
English by translation**. Before using a new physics term as a formula
symbol name:

1. Check `content/terminology/glossary.json` for an existing entry.
2. If it's missing, find the correct Estonian rendering from an
   authoritative source — an EKI Sõnaveeb entry
   (`https://sonaveeb.ee/search/unif/est/eki/{term}/1/est`) is the standard
   citation, but a general dictionary won't have every compound technical
   term; a specialised source (an Estonian physics textbook, a university
   course page) is fine too, cited in `source`.
3. Add the entry with a real, working source URL. `npm run lint:terminology`
   fails the build on any formula symbol name with no glossary entry.

If you find Estonian content using a known-wrong rendering of a locked term,
add it to `banned-variants.json` rather than just fixing the one instance —
the linter then catches every future recurrence.

Terminology rule of thumb from experience this project has already hit:
reusing a generic glossary term for a related-but-distinct quantity (e.g.
labelling both a formula's initial and final velocity symbols "velocity") is
fine and matches existing content; inventing new prose vocabulary in a
misconception or quiz-item description doesn't need a glossary entry at all
— the linter only checks formula `symbols[].name.en`, not arbitrary text.

## Resources

Resources are curated, not translated: find genuinely good material in each
language independently, rather than linking the English learner's source
again with a translated title. In practice for physics this has meant PhET
Interactive Simulations, Khan Academy, HyperPhysics and similar for English,
and `opik.fyysika.ee` (the Estonian physics e-textbook), TaskuTark or
NIST/university sources for Estonian.

Before adding a resource URL, verify it actually resolves (a quick
`curl -o /dev/null -w "%{http_code}"` is enough) — don't guess a URL from
memory or a plausible-looking pattern. A resource's `type` should reflect
what it actually is (`article`, `video`, `interactive`, `paper`, `book`);
prefer diversifying types across a concept's resource set rather than
stacking multiple articles.

## Before opening a PR

```bash
npm run validate:content
npm run lint:terminology
npm test
npx tsc --noEmit
npm run lint
npm run build
```

All six are required by CI. Running them locally first is faster than
waiting for a red check.
