"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { searchScore } from "@/lib/search/fuzzyMatch";

export type SearchRow = {
  id: string;
  type: "concept" | "formula" | "glossary";
  title: string;
  /** Pre-rendered server-side (e.g. `<Math>` for formulas) so no math library ships to the client. */
  subtitle?: ReactNode;
  href: string;
  /** Built once per locale server-side, from that locale's text only — search never crosses locales. */
  searchText: string;
};

// Concept pages are the "go learn this" destination, so they rank above a
// formula or glossary entry that merely mentions the same term.
const TYPE_RANK: Record<SearchRow["type"], number> = { concept: 0, formula: 1, glossary: 2 };

export function GlobalSearchList({
  rows,
  initialQuery = "",
  placeholder,
  noResultsLabel,
  typeLabels,
}: {
  rows: SearchRow[];
  initialQuery?: string;
  placeholder: string;
  noResultsLabel: string;
  typeLabels: Record<SearchRow["type"], string>;
}) {
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    if (query.trim() === "") return rows;
    return rows
      .map((row) => ({ row, score: searchScore(query, row.title, row.searchText) }))
      .filter((entry): entry is { row: SearchRow; score: number } => entry.score !== null)
      .sort((a, b) => b.score - a.score || TYPE_RANK[a.row.type] - TYPE_RANK[b.row.type])
      .map((entry) => entry.row);
  }, [query, rows]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoFocus
        className="mt-6 w-full rounded-lg border border-border px-3 py-2 text-sm"
      />

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-muted">{noResultsLabel}</p>
      ) : (
        <ul className="mt-6 divide-y divide-border">
          {filtered.slice(0, 100).map((row) => (
            <li key={row.id} className="py-3">
              <Link href={row.href} className="block">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted uppercase">
                    {typeLabels[row.type]}
                  </span>
                  <span className="underline">{row.title}</span>
                </div>
                {row.subtitle && <p className="mt-1 text-sm text-muted">{row.subtitle}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
