import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { listSubjects } from "@/content/loader";
import { loadConcepts } from "@/content/concepts";
import { topologicalSort } from "@/lib/roadmap/topologicalSort";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found / Lehte ei leitud",
  description: "The page you are looking for does not exist.",
};

/**
 * Handles URLs that match no route at all (typos, dead links) — the app has
 * no top-level app/layout.tsx (see DECISIONS.md), so this bypasses it
 * entirely and must be fully self-contained, including its own <html>/<body>
 * and global styles. `[lang]/not-found.tsx` still covers the separate case
 * of an explicit `notFound()` thrown from inside an already-matched locale
 * segment (e.g. an unknown concept id), where locale context is available.
 */
export default function GlobalNotFound() {
  const concepts = listSubjects().flatMap((subject) => loadConcepts(subject));
  const startingPoints = topologicalSort(concepts).slice(0, 4);

  return (
    <html
      lang="en"
      className="antialiased"
      style={{ "--font-sans": "system-ui, sans-serif" } as CSSProperties}
    >
      <body className="min-h-full">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold">Page not found</h1>
          <p className="mt-2 text-lg text-muted">Lehte ei leitud</p>
          <p className="mt-4 text-muted">
            That page doesn&rsquo;t exist, or has moved.
            <br />
            Seda lehte ei ole olemas või on see teisaldatud.
          </p>

          {startingPoints.length > 0 && (
            <ul className="mt-8 space-y-3 text-left">
              {startingPoints.map((concept) => (
                <li key={concept.id} className="rounded-lg border border-border px-4 py-3">
                  <Link href={`/en/concepts/${concept.id}`} className="underline">
                    {concept.title.en}
                  </Link>
                  <span className="text-muted"> / </span>
                  <Link href={`/et/concepts/${concept.id}`} className="underline">
                    {concept.title.et}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/en"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent"
            >
              English home
            </Link>
            <Link
              href="/et"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent"
            >
              Eesti avaleht
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
