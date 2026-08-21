import Link from "next/link";
import type { Concept } from "@/schema";
import type { Locale } from "@/i18n/locales";
import { LevelBadge } from "./LevelBadge";

/** Used on the roadmap (Phase 7) and in search results (Phase 9's formula index reuses the same card shape for consistency). */
export function ConceptCard({
  concept,
  locale,
  href,
  prerequisites,
}: {
  concept: Concept;
  locale: Locale;
  /** Phase 8 adds concept detail pages; until then this defaults to a practice session scoped to the concept. */
  href?: string;
  /** Resolved prerequisite concepts (the roadmap passes these; other callers can omit them). Rendered outside the main link since an anchor can't nest inside another. */
  prerequisites?: Concept[];
}) {
  return (
    <div className="rounded-lg border border-border p-4 hover:border-accent">
      <Link href={href ?? `/${locale}/practice?concepts=${concept.id}`} className="block">
        <div className="flex items-center gap-2">
          <LevelBadge level={concept.level} />
          <h3 className="font-semibold">{concept.title[locale]}</h3>
        </div>
        <p className="mt-2 text-sm text-muted">{concept.summary[locale]}</p>
      </Link>
      {prerequisites && prerequisites.length > 0 && (
        <p className="mt-2 text-xs text-muted">
          Requires:{" "}
          {prerequisites.map((prereq, i) => (
            <span key={prereq.id}>
              {i > 0 && ", "}
              <Link href={`/${locale}/practice?concepts=${prereq.id}`} className="underline">
                {prereq.title[locale]}
              </Link>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
