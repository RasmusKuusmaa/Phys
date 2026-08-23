import Link from "next/link";
import { lang } from "next/root-params";
import { isLocale, defaultLocale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { topologicalSort } from "@/lib/roadmap/topologicalSort";
import { LevelBadge } from "@/components/LevelBadge";

/**
 * Rendered inside `[lang]/layout.tsx` for any unmatched route once the
 * locale-prefix proxy has already run, so `lang()` still resolves here even
 * though the requested path itself doesn't exist — falls back to the
 * default locale only if that resolution somehow fails.
 */
export default async function NotFound() {
  const rawLocale = await lang();
  const locale = rawLocale && isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary();

  const concepts = listSubjects().flatMap((subject) => loadConcepts(subject));
  const startingPoints = topologicalSort(concepts).slice(0, 4);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold">{dict.notFound.heading}</h1>
      <p className="mt-4 text-muted">{dict.notFound.message}</p>

      {startingPoints.length > 0 && (
        <ul className="mt-8 space-y-3 text-left">
          {startingPoints.map((concept) => (
            <li
              key={concept.id}
              className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
            >
              <LevelBadge level={concept.level} />
              <Link href={`/${locale}/concepts/${concept.id}`} className="underline">
                {concept.title[locale]}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={`/${locale}/roadmap`}
        className="mt-8 inline-block rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent"
      >
        {dict.notFound.roadmapCta}
      </Link>
    </div>
  );
}
