"use client";

import { useState } from "react";
import Link from "next/link";
import { fuzzyMatch } from "@/lib/search/fuzzyMatch";

export type SearchRow = {
  id: string;
  type: "concept" | "formula" | "glossary";
  title: string;
  subtitle?: string;
  href: string;
  /** Built once per locale server-side, from that locale's text only — search never crosses locales. */
  searchText: string;
};

export function GlobalSearchList({
  rows,
  placeholder,
  noResultsLabel,
  typeLabels,
}: {
  rows: SearchRow[];
  placeholder: string;
  noResultsLabel: string;
  typeLabels: Record<SearchRow["type"], string>;
}) {
  const [query, setQuery] = useState("");
  const filtered = query.trim() === "" ? rows : rows.filter((row) => fuzzyMatch(query, row.searchText));

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
