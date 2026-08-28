import Link from "next/link";
import type { Locale } from "@/i18n/locales";

/**
 * `subjects` comes from `listSubjects()` at the call site rather than being
 * hardcoded, so this needs no changes as subjects are added or removed.
 */
export function SubjectSwitcher({
  subjects,
  currentSubject,
  locale,
}: {
  subjects: string[];
  /** Unset outside subject-scoped routes (e.g. the home page) — nothing renders as active. */
  currentSubject?: string;
  locale: Locale;
}) {
  return (
    <nav aria-label="Subject" className="flex gap-2 text-sm">
      {subjects.map((subject) => (
        <Link
          key={subject}
          href={`/${locale}/roadmap?subject=${subject}`}
          aria-current={subject === currentSubject ? "true" : undefined}
          className={
            subject === currentSubject
              ? "font-semibold underline capitalize"
              : "text-muted hover:text-foreground capitalize"
          }
        >
          {subject}
        </Link>
      ))}
    </nav>
  );
}
