import Link from "next/link";
import type { Concept } from "@/schema";
import type { Locale } from "@/i18n/locales";
import { LevelBadge } from "./LevelBadge";

function ConceptLinkList({
  label,
  concepts,
  locale,
}: {
  label: string;
  concepts: Concept[];
  locale: Locale;
}) {
  if (concepts.length === 0) return null;
  return (
    <p className="mt-2 text-xs text-muted">
      {label}:{" "}
      {concepts.map((concept, i) => (
        <span key={concept.id}>
          {i > 0 && ", "}
          <Link href={`/${locale}/concepts/${concept.id}`} className="underline">
            {concept.title[locale]}
          </Link>
        </span>
      ))}
    </p>
  );
}

/** Used on the roadmap (Phase 7) and in search results (Phase 9's formula index reuses the same card shape for consistency). */
export function ConceptCard({
  concept,
  locale,
  href,
  prerequisites,
  unlocks,
}: {
  concept: Concept;
  locale: Locale;
  /** Defaults to the concept's detail page; callers that want a different destination (e.g. straight into practice) can override. */
  href?: string;
  /** Resolved prerequisite concepts (the roadmap passes these; other callers can omit them). Rendered outside the main link since an anchor can't nest inside another. */
  prerequisites?: Concept[];
  /** The reverse edge — concepts that list this one as a prerequisite. */
  unlocks?: Concept[];
}) {
  return (
    <div className="rounded-lg border border-border p-4 hover:border-accent">
      <Link href={href ?? `/${locale}/concepts/${concept.id}`} className="block">
        <div className="flex items-center gap-2">
          <LevelBadge level={concept.level} />
          <h3 className="font-semibold">{concept.title[locale]}</h3>
        </div>
        <p className="mt-2 text-sm text-muted">{concept.summary[locale]}</p>
      </Link>
      {prerequisites && (
        <ConceptLinkList label="Requires" concepts={prerequisites} locale={locale} />
      )}
      {unlocks && <ConceptLinkList label="Unlocks" concepts={unlocks} locale={locale} />}
    </div>
  );
}
