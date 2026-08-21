import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { loadAllConcepts } from "@/content/concepts";
import { LevelBadge } from "@/components/LevelBadge";

export async function generateStaticParams() {
  return loadAllConcepts().map((concept) => ({ id: concept.id }));
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();

  const { id } = await params;
  const concept = loadAllConcepts().find((c) => c.id === id);
  if (!concept) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="flex items-center gap-2">
        <LevelBadge level={concept.level} />
        <h1 className="text-3xl font-semibold">{concept.title[locale]}</h1>
      </div>
      <p className="mt-4 text-muted">{concept.summary[locale]}</p>
    </div>
  );
}
