import Link from "next/link";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import type { Course, CourseStatus } from "@/curriculum/types";
import type { Concept } from "@/schema";

// Deliberately not reusing the L0-L3 level-badge colours — a course's
// requirement status (mandatory vs elective) is an unrelated axis from a
// concept's difficulty level, and sharing the palette would visually imply
// a connection that doesn't exist.
const STATUS_CLASSES: Record<CourseStatus, string> = {
  "mandatory-all": "bg-rose-600",
  mandatory: "bg-blue-600",
  elective: "bg-slate-500",
  "minor-only": "bg-slate-400",
  "not-in-track": "bg-slate-300",
};

/** One course within a module section on the curriculum page — status, EAP, coverage, and links to its mapped concepts. */
export function CourseRow({
  course,
  status,
  locale,
  dict,
  isPractical,
  conceptById,
}: {
  course: Course;
  status: CourseStatus;
  locale: Locale;
  dict: Messages;
  isPractical: boolean;
  /** Built once on the page and passed down — avoids re-loading all content for every row. */
  conceptById: Map<string, Concept>;
}) {
  const covered = course.conceptIds.length > 0;

  return (
    <div id={course.code} className="rounded-lg border border-border p-4 scroll-mt-20">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${STATUS_CLASSES[status]}`}
        >
          {dict.curriculum.statusLabel[status]}
        </span>
        <h3 className="font-semibold">{course.name[locale]}</h3>
        <span className="text-xs text-muted">{course.code}</span>
        {course.eap !== null && (
          <span className="ml-auto text-xs text-muted">
            {course.eap} {dict.curriculum.eapUnit}
          </span>
        )}
      </div>

      <p className="mt-2 text-xs">
        {covered ? (
          <span className="text-emerald-600 font-medium">
            {dict.curriculum.covered}
            {isPractical && ` — ${dict.curriculum.practicalNote}`}
          </span>
        ) : (
          <span className="text-muted">{dict.curriculum.notCovered}</span>
        )}
      </p>

      {covered && (
        <p className="mt-2 text-xs text-muted">
          {dict.curriculum.mappedConceptsLabel}:{" "}
          {course.conceptIds.map((id, i) => {
            const concept = conceptById.get(id);
            if (!concept) return null;
            return (
              <span key={id}>
                {i > 0 && ", "}
                <Link href={`/${locale}/concepts/${id}`} className="underline">
                  {concept.title[locale]}
                </Link>
              </span>
            );
          })}
        </p>
      )}

      {!course.hasSyllabus && (
        <p className="mt-2 text-xs text-muted italic">{dict.curriculum.noSyllabus}</p>
      )}
    </div>
  );
}
