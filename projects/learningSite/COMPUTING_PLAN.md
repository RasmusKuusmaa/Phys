# Computing (computer science) content plan

Sixth item on `SCIENCE_ROADMAP.md`'s build order, but unlike every other
item this is an *upgrade* of an existing, pre-dating-this-effort subject
rather than a greenfield one — `content/computing/` already has 4 thin
concepts (`algorithms-and-program-structure`, `control-flow`,
`data-structures-and-algorithms`, `numerical-methods-in-computing`) never
brought to the same depth bar as everything else. This plan builds a full
computer-science curriculum around them rather than redoing them.

## Scope and framing

"Computing" (framed in prose as computer science, subject slug stays
`computing` to match the existing directory and not break any existing
routes/links) means the standard bachelor's-degree computer-science
curriculum: algorithms and complexity, computer architecture, theory of
computation, operating systems, databases, networks, and software
engineering principles. Checked overlap before drafting: nothing in
mathematics or physics covers algorithmic complexity/Big-O notation,
Turing machines/computability, automata theory, binary number
representation, or the von Neumann architecture — genuine complete gaps.
The existing 4 concepts stay as-is; new concepts either extend the
existing `programming-fundamentals`/`numerical-methods` modules or start
new ones (`computer-architecture`, `theory-of-computation`, and more as
later phases are scoped).

## Commit discipline

Identical rule to every other plan file: one commit per concept, single-line
message (`content: add <concept-id>`), no body, no trailer/signature. Every
concept gets the full set — concept, >=3 misconceptions, >=1 item, a
resource per locale, EN+ET explanations. Gate before each commit:
`npm run validate:content && npm run lint:terminology`. Verify every
resource URL with a live check before committing. Formula + problem-
template + error-model only where a concept has one clean, well-defined
numeric relationship (Big-O growth-rate comparison is the clearest
candidate in this phase).

## How to resume this on another machine

```bash
npm run content:coverage -- --incomplete   # any half-finished concept
git log --oneline | grep '^content: add '   # concepts already landed
```

---

## Phase CS1 — algorithmic complexity and recursion (extending the
## existing programming-fundamentals module), plus a new computer-
## architecture module

- [x] Algorithmic complexity and Big-O notation (module
      `programming-fundamentals`, prerequisite:
      data-structures-and-algorithms — asymptotic growth rates, why
      constant factors are dropped, comparing common complexity classes;
      kept conceptual — a growth-rate comparison item covers the
      quantitative intuition without forcing an algebraic formula onto a
      fundamentally comparative/asymptotic concept)
- [x] Recursion and recursive algorithms (module `programming-fundamentals`,
      prerequisite: control-flow — the call stack, base case and
      recursive case, classic recursive problems; kept conceptual)
- [x] Binary representation and number systems (module
      `computer-architecture`, no prerequisites — binary/hexadecimal,
      two's complement for negative integers, floating-point
      representation at an overview level; the new module's foundational
      entry point; kept conceptual)
- [x] Computer architecture and the von Neumann model (module
      `computer-architecture`, prerequisite: binary-representation-and-
      number-systems — the fetch-decode-execute cycle, the memory
      hierarchy from registers to disk; kept conceptual)
- [x] Automata and formal languages (module `theory-of-computation`, no
      prerequisites — finite automata, regular languages, the
      Chomsky-hierarchy framing at an overview level; kept conceptual)
- [x] Computability and Turing machines (module `theory-of-computation`,
      prerequisite: automata-and-formal-languages — the Turing machine as
      a model of computation, the halting problem, what "computable"
      actually means; kept conceptual)

Phase CS1 complete: 10 computing concepts total (6 new Phase-CS1 concepts
on top of the 4 pre-existing thin concepts, which were left untouched).
None got a formula — Big-O was the only real quantitative candidate, and
its actual content is an asymptotic-comparison/reasoning skill better
served by a well-designed multiple-choice item than a forced algebraic
formula, same discretion every prior subject's first phase has used. No
new glossary terms needed (no formula symbols introduced). All 12 resource
URLs (6 concepts × EN/ET) individually curl-verified live, including four
exact-title Estonian matches (Rekursioon, Kahendarv, Von Neumanni
arhitektuur, Turingi masin) and two honest close matches (Algoritmiline
keerukus for Big-O, since Estonian Wikipedia has no dedicated "Big-O"
article; Lõplik olekumasin — finite state machine — for automata theory,
since no dedicated Estonian automata-theory article exists either). `npm
run validate:content` (14 subjects, 683 concepts), `npm run
lint:terminology` (272 glossary terms), and `npm run typecheck` all pass;
working tree clean except for a sibling `oceanography` subject still in
flight, untouched by this phase.

## Phase CS2 — not yet planned

To be scoped after CS1 lands. Candidates already surveyed: operating
systems (processes/threads, memory management, file systems), databases
(the relational model, SQL basics, normalization, ACID transactions),
computer networks (the OSI/TCP-IP model, routing, DNS), and software
engineering principles (version control concepts, testing methodology,
design patterns overview).

---
