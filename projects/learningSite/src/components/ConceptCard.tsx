import Link from "next/link";
import type { Concept } from "@/schema";
import type { Locale } from "@/i18n/locales";
import { LevelBadge } from "./LevelBadge";

/** Used on the roadmap (Phase 7) and in search results (Phase 9's formula index reuses the same card shape for consistency). */
export function ConceptCard({
  concept,
  locale,
  href,
}: {
  concept: Concept;
  locale: Locale;
  /** Phase 8 adds concept detail pages; until then this defaults to a practice session scoped to the concept. */
  href?: string;
}) {
  return (
    <Link
      href={href ?? `/${locale}/practice?concepts=${concept.id}`}
      className="block rounded-lg border border-border p-4 hover:border-accent"
    >
      <div className="flex items-center gap-2">
        <LevelBadge level={concept.level} />
        <h3 className="font-semibold">{concept.title[locale]}</h3>
      </div>
      <p className="mt-2 text-sm text-muted">{concept.summary[locale]}</p>
    </Link>
  );
}
