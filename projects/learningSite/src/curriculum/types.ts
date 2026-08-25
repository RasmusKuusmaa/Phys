/**
 * Types for the parsed University of Tartu "Füüsika, keemia ja materjaliteadus"
 * BSc curriculum. The raw scraped text in `content/actual_ut_course/` is the
 * source of truth and is never edited; everything here is generated from it by
 * `npm run curriculum:build`.
 *
 * These are deliberately separate from the learning content in `src/schema/`.
 * A `Course` is a unit of the degree; a `Concept` is a unit of the site. The
 * mapping between them is explicit (`Course.conceptIds`) so that "what does
 * this degree require" and "what does the site teach" stay answerable
 * independently, and the gap between them is measurable.
 */

export type Track = "physics" | "chemistry" | "materials-science";

export const TRACKS: readonly Track[] = ["physics", "chemistry", "materials-science"];

/**
 * A course's standing in one track:
 * - `mandatory-all`  — required of every student on the programme, whichever
 *                      track they take (the two foundation modules)
 * - `mandatory`      — required of this track specifically
 * - `elective`       — offered to this track as a free choice
 * - `minor-only`     — reachable only by taking this subject as a minor
 * - `not-in-track`   — not part of this track at all
 */
export type CourseStatus = "mandatory-all" | "mandatory" | "elective" | "minor-only" | "not-in-track";

export type LocalisedName = { et: string; en: string };

export type Module = {
  /** Numbering from the curriculum itself, e.g. "2.1". Stable across rebuilds. */
  number: string;
  /** The module group heading it sits under, e.g. "Suunamoodulid". */
  group: string;
  name: LocalisedName;
  /** The requirement phrase exactly as the curriculum states it, for display. */
  requirementEt: string | null;
  requirement: "mandatory" | "elective" | "minor-only";
  /** `all` for the foundation modules every track shares; null when unclassifiable. */
  track: Track | "all" | null;
  minorOnly: boolean;
  eap: number | null;
  courseCodes: string[];
};

export type CourseTopic = {
  title: string;
  /** Contact hours as stated, e.g. "8 h" — null when the source doesn't give them. */
  hours: string | null;
  /** The keyword paragraph under a topic heading; empty for session-style schedules. */
  keywords: string;
};

export type Course = {
  /** UT course code, e.g. "LOFY.01.007". The stable identity across modules. */
  code: string;
  name: LocalisedName;
  eap: number | null;
  /** Module numbers that list this course. */
  modules: string[];
  status: Record<Track, CourseStatus>;
  prerequisiteCodes: string[];
  aims: string;
  outcomes: string[];
  summary: string;
  topics: CourseTopic[];
  /**
   * Platform concept ids that together cover this course. Authored in
   * `src/curriculum/mapping.ts`, not scraped — the parser always writes what
   * the mapping declares, so a rebuild never loses it.
   */
  conceptIds: string[];
  sourceFiles: string[];
  /** False when the curriculum lists the course but no syllabus page was captured. */
  hasSyllabus: boolean;
};
