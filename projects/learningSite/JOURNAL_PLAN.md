# Study journal — build plan

Turns the site from "content + self-graded tests" into a full study system:
log daily study time per topic, rate your own understanding, see it trended
over time, and take a test per topic to check the rating against reality.
This file is the plan; `todo.md` is untouched — the journal is an
orthogonal feature the same way the account system (`DECISIONS.md` §
Notes and highlights, § Reference data) was, not another curriculum phase.

## Commit discipline — read before starting any phase

- **One checklist item = one commit**, made immediately after that item is
  done, before starting the next one. Do not batch several checklist items
  into one commit. If an item turns out too big to land in one commit,
  split it into smaller items in this file first, then commit each.
- **Every commit message is a single line.** No body, no bullet list, no
  blank-line-separated description. `type: imperative summary`, same as
  every commit already in this repo's history.
- **No signature or trailer on any commit.** No `Co-Authored-By`, no
  `Generated with`, no session/agent identifiers. This is already the
  repo-wide rule in `CLAUDE.md`; it is restated here because this file's
  entire point is commit hygiene.
- Suggested commit message for each item is given in backticks under it.
  Use it verbatim unless the implementation diverged, in which case write
  what actually happened.
- Run `npm run typecheck`, the relevant `vitest` file, and `eslint` on
  touched files before each commit — small commits only stay easy to
  bisect if each one leaves the tree green.

## Scope

**In scope:** a per-topic study log (time + self-rated understanding +
notes), written daily, with history, streaks, per-topic aggregation, a
test-yourself loop tied to each topic, and full account sync — same
sync-or-local-only pattern the account system already established for
notes and progress.

**Out of scope for this plan** (see Stretch section at the end for ideas
not being scheduled now): spaced-repetition scheduling, email reminders,
PDF/CSV export, a mobile app, social/sharing features.

## Design decisions

These will move into `DECISIONS.md` once the feature ships (Phase J6);
recorded here first since they're load-bearing for every phase below.

- **A "topic" is a concept id.** The site already has exactly one
  fine-grained, id-stable unit that time, tests, and progress all already
  key on — `src/schema/concept.ts`'s `Concept.id`. The journal reuses it
  rather than inventing a second taxonomy or supporting formula/glossary
  targets the way `NoteLink` does; a formula or glossary term always
  belongs to a concept, so time and understanding are tracked at the
  concept, not the sub-thing.
- **Session vs. day are two different records.** A `StudySession` is one
  logged block of work on one topic (minutes, understanding rating,
  optional note, timestamp). A `JournalDay` is at most one freeform
  reflection per calendar date, independent of how many sessions happened
  that day. Collapsing these into one shape would force a day with three
  topics studied into three reflections or one reflection awkwardly
  split three ways.
- **Understanding is a 1–5 self-rating, logged per session, not a new
  parallel status field.** The existing `ConceptStatus` (`unseen` /
  `learning` / `confident` in `src/lib/progress/schema.ts`) stays the
  single field the rest of the app reads (roadmap overlay, concept page
  badge). A session's rating derives it: `>=4` → `confident`, `>=2` →
  `learning`, else left alone — same "only ever moves forward on evidence"
  posture `mergeProgress` already has for status. This avoids two
  competing "how well do I know this" numbers.
- **Test attempts get their own persisted history**, separate from journal
  sessions. Today a finished test only ever updates the aggregate
  `conceptStatus` and cumulative `misconceptionHits` (see
  `TestRunner.tsx`); no individual attempt survives. The journal needs
  attempt history to plot "does my self-rating match my scores", so this
  plan adds it once, and the journal timeline reads it rather than
  duplicating it as a session.
- **Everything syncs the same way notes and progress already do**: a
  versioned blob in `localStorage`, validated with the same Zod schema
  going out to `/api/sync/[kind]` and coming back, merged server-side
  inside one transaction so two devices syncing at once can't clobber each
  other. No new sync mechanism, just a third `kind`.

## Data model

```
StudySession = {
  id: string
  conceptId: string
  date: string            // YYYY-MM-DD, the journal day this belongs to
  minutes: number          // positive int
  understanding: 1|2|3|4|5
  note: string             // optional, default ""
  createdAt: string        // ISO
  updatedAt: string        // ISO
}

JournalDay = {
  date: string              // YYYY-MM-DD, primary key
  reflection: string
  updatedAt: string
}

TestAttempt = {
  id: string
  conceptIds: string[]      // the test could cover more than one concept
  percent: number           // 0-100
  itemCount: number
  takenAt: string           // ISO
}

Journal = {
  version: 1
  sessions: Record<string, StudySession>
  days: Record<string, JournalDay>          // keyed by date
  deletedSessions: Record<string, string>   // id -> ISO deletion time, tombstones like notes
}

TestHistory = {
  version: 1
  attempts: Record<string, TestAttempt>
}
```

Two localStorage keys (`journal`, `testHistory`), two sync `kind`s,
mirroring how notes and progress are already two independent keys/kinds
rather than one combined blob.

---

## Phase J0 — Schema and local storage

- [x] Add `StudySession`/`JournalDay`/`Journal` Zod schemas and
      `createEmptyJournal()` in `src/lib/journal/schema.ts`
      `feat: add study journal schema`
- [x] Add the migration registry scaffold in `src/lib/journal/migrations.ts`
      (empty registry, version 1 — same shape as
      `src/lib/progress/migrations.ts`)
      `feat: add journal storage migration scaffold`
- [x] Add `src/lib/journal/store.ts`: `readJournal`/`writeJournal` over
      `localStorage`, dispatching the manual `storage` event the same way
      `src/lib/notes/store.ts` and `src/lib/progress/store.ts` do
      `feat: add journal localStorage store`
- [x] Add `src/lib/journal/useJournal.ts` (`useSyncExternalStore` hook,
      mirroring `useNotes`/`useProgress`)
      `feat: add useJournal hook`
- [x] Add `TestAttempt`/`TestHistory` Zod schema, empty-state constructor,
      migration scaffold, store and hook in `src/lib/testHistory/`
      (same four files as above, one commit since it's one small mirrored
      module)
      `feat: add test attempt history storage`
- [x] Unit tests: schema validation, migration chain fallback-to-empty on
      garbage input, for both `journal` and `testHistory`
      `test: add journal and test history schema tests`

## Phase J1 — Logging a session (the core daily loop)

- [x] Add `src/lib/journal/store.ts` helpers: `logSession(conceptId,
      minutes, understanding, note?)`, `updateSession`, `deleteSession`
      (tombstoning into `deletedSessions`, not removing outright — same
      reasoning as `mergeNotebooks`)
      `feat: add session logging helpers`
- [x] Add `logSession` → `setConceptStatus` derivation per the
      understanding-rating rule above, called from the same helper so
      every call site gets it for free
      `feat: derive concept status from journal understanding rating`
- [x] Build `JournalEntryForm`: topic picker (reuse the concept
      search/select pattern from `TestBuilderForm.tsx`), minutes number
      input, 1–5 understanding rating control, optional note textarea
      `feat: add study session entry form`
- [x] Add a start/stop study timer widget that fills the minutes field;
      persist the running timer's start time to `localStorage` so a
      reload or accidental tab close doesn't lose elapsed time
      `feat: add study timer widget`
- [x] Add `/[lang]/journal/page.tsx` wiring today's entry form plus
      today's already-logged sessions
      `feat: add journal page`
- [x] Add `nav.journal` EN/ET strings and the header nav link (same
      `NotesNavLink`-style pattern — badge with today's logged-minutes
      count once non-zero)
      `feat: add journal nav link`

## Phase J2 — History, editing, streaks

- [x] Build `JournalTimeline`: days newest-first, each showing its
      sessions and its reflection if any, paginated by month
      `feat: add journal daily timeline`
- [x] Add the per-day freeform reflection editor (one `JournalDay` per
      date, upserted)
      `feat: add daily reflection note`
- [x] Add edit and delete on a logged session from the timeline
      `feat: add edit and delete for journal sessions`
- [x] Add a streak calculator (consecutive days with >=1 session,
      pure function, unit tested) and a calendar strip showing it
      (landed as two commits: `feat: add journal streak calculator` then
      `feat: add journal streak calendar`)
      `feat: add journal streak calendar`

## Phase J3 — Per-topic aggregation and dashboards

- [x] Add pure aggregation functions in `src/lib/journal/stats.ts`: total
      minutes per concept (all-time / last 7 / last 30 days), understanding
      trend (ordered list of ratings over time) — unit tested in isolation
      before anything renders them
      `feat: add per-topic time and understanding aggregation`
- [x] Add a "Study" section to the concept page (`concepts/[id]/page.tsx`):
      total time spent, latest understanding rating, last-studied date
      `feat: show study stats on concept page`
- [x] Add a journal overview dashboard: top topics by time this week,
      topics not touched in >14 days, understanding spread across the
      roadmap's modules
      `feat: add journal overview dashboard`

## Phase J4 — Closing the loop with tests

- [x] Add a "Test yourself" call-to-action linking to
      `/practice?concepts=<id>` from the concept page's Study section and
      from the journal overview's per-topic rows (the practice/test system
      already exists — this phase only wires entry points into it)
      `feat: add test-yourself links from journal and concept pages`
- [x] Record a `TestAttempt` when `TestRunner` finishes scoring, alongside
      the existing `setConceptStatus`/`recordMisconceptionHits` calls
      (landed bundled with the runner's UI rewrite, since the two touched
      the same lines throughout)
      `feat: redesign the practice builder and test runner, recording attempts to history`
- [x] Show test score history next to the understanding rating on the
      concept page's Study section
      `feat: show recent test scores on the concept page`
- [x] Flag the gap when a self-rating and recent test scores disagree
      (e.g. rated "confident" but last attempt <60%) — a plain inline
      notice, not a blocking one
      `feat: flag mismatch between self-rating and test performance`
- [x] Fold test attempts into the journal timeline as read-only entries
      alongside manually logged sessions
      `feat: include test attempts in journal timeline`

## Phase J5 — Account sync

- [x] Add `'journal'` and `'testHistory'` to the `user_data.kind` CHECK
      constraint in `src/db/schema.sql` (an `ALTER TABLE ... DROP
      CONSTRAINT ... ADD CONSTRAINT` statement guarded the same
      idempotent way the rest of the file is, so `db:migrate` stays safe
      to rerun)
      `feat: add journal kinds to user_data schema`
- [x] Add `mergeJournal` to `src/lib/sync/merge.ts`: sessions merged
      by `updatedAt`-wins same as notes, `deletedSessions` merged as
      tombstones same as notes, days merged by `updatedAt`-wins
      `feat: add journal merge logic for sync`
- [x] Add `mergeTestHistory`: attempts are immutable once taken, so this
      is a plain union by id, no conflict possible
      `feat: add test history merge logic for sync`
- [x] Add `journal` and `testHistory` to `KINDS` and `schemaFor` in
      `src/app/api/sync/[kind]/route.ts`
      `feat: sync journal and test history through the sync endpoint`
- [x] Add both kinds to `syncAll()` in `src/lib/sync/client.ts`
      `feat: include journal in account sync`
- [x] Unit tests for both merge functions, mirroring
      `src/lib/sync/merge.test.ts`'s existing cases (concurrent edit,
      concurrent delete-vs-edit, one-sided history)
      `test: add journal and test history merge tests`

## Phase J6 — Polish, i18n, docs

- [x] Localise every new string into Estonian in the same pass as it's
      written, not batched at the end — per the bilingual policy in
      `DECISIONS.md`
      `content: localise study journal strings`
      (done as each string was written throughout J0-J5, not as a
      separate commit — en.json/et.json stayed in parity the whole way)
- [x] Empty states (`no sessions logged yet`, `no attempts yet`) and
      loading states for the timer, timeline, and dashboard; ARIA labels
      on the rating control and timer buttons
      (empty/loading states already existed for every list — timer/rating
      ARIA was the actual gap, fixed separately)
      `fix: add ARIA grouping to journal rating control and quiet the timer's ticking label`
- [x] Record the Design decisions section above into `DECISIONS.md`
      `docs: record study journal decisions`
- [ ] Manual QA pass, no commit needed unless it turns up a bug: full
      loop signed out (local-only, confirm nothing calls the sync
      endpoints), then signed in on two browser profiles confirming a
      session logged on one appears on the other after Sync now
      (signed-out half done: journal/account/concept pages render clean
      with no sync calls and no errors. The signed-in, two-device half
      needs a reachable Postgres — none is reachable from this sandbox,
      `db:migrate` itself times out connecting to `DATABASE_URL` — so
      still needs doing against a real database.)

## How to resume this on another machine

```bash
git log --oneline -- 'src/lib/journal/**' 'src/lib/testHistory/**'   # what's already landed
grep -c '^- \[ \]' JOURNAL_PLAN.md                                    # items remaining
```

Work phases in order — J1 depends on J0's schema, J3 depends on J1/J2
having real data to aggregate, J4 depends on the existing practice/test
system (already shipped, untouched by this plan) plus J0's `testHistory`
module, J5 depends on every schema in J0 being final since the sync
`kind` CHECK constraint and merge functions are shaped by it.

## Stretch (not scheduled)

Ideas that came up while designing this but are staying out, so they
don't silently creep into the phases above:

- Spaced-repetition scheduling driven by understanding rating + time
  since last session (would want its own decision on an algorithm first).
- A daily reminder email — `AUTH_EMAIL_SERVER` already exists for magic
  links, but a scheduled sender is new infrastructure this plan doesn't
  touch.
- Exporting the journal as PDF/CSV, alongside the existing progress
  export-as-code.
