import { lang } from "next/root-params";
import { getDictionary } from "@/i18n/dictionaries";
import { loadGlossary } from "@/content/glossary";

export default async function GlossaryPage() {
  const locale = await lang();
  const dict = await getDictionary();
  const glossary = loadGlossary();

  const byDomain = new Map<string, typeof glossary>();
  for (const entry of glossary) {
    if (!byDomain.has(entry.domain)) byDomain.set(entry.domain, []);
    byDomain.get(entry.domain)!.push(entry);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{dict.nav.glossary}</h1>
      <div className="mt-10 space-y-10">
        {[...byDomain.entries()].map(([domain, entries]) => (
          <section key={domain}>
            <h2 className="text-xl font-semibold capitalize">
              {domain.replace(/-/g, " ")}
            </h2>
            <table className="mt-3 w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pr-4 font-medium">English</th>
                  <th className="py-2 pr-4 font-medium">Eesti</th>
                </tr>
              </thead>
              <tbody>
                {entries
                  .slice()
                  .sort((a, b) =>
                    (locale === "et" ? a.et : a.en).localeCompare(
                      locale === "et" ? b.et : b.en,
                    ),
                  )
                  .map((entry) => (
                    <tr key={entry.id} className="border-b border-border">
                      <td className="py-2 pr-4">{entry.en}</td>
                      <td className="py-2 pr-4">
                        <a
                          href={entry.source}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-dotted hover:decoration-solid"
                        >
                          {entry.et}
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </div>
  );
}
