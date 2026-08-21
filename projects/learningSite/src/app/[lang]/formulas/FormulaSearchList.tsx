"use client";

import { useState } from "react";
import Link from "next/link";
import type { Concept, Formula, Level } from "@/schema";
import { levelOrder } from "@/schema";
import type { Locale } from "@/i18n/locales";
import { LevelBadge } from "@/components/LevelBadge";
import { Math } from "@/components/Math";
import { fuzzyMatch } from "@/lib/search/fuzzyMatch";

export type FormulaRow = {
  formula: Formula;
  concept: Concept;
  /** Concept title plus every symbol and symbol name, pre-joined so search doesn't rebuild it on every keystroke. */
  searchText: string;
};

export function FormulaSearchList({ rows, locale }: { rows: FormulaRow[]; locale: Locale }) {
  const [query, setQuery] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<Level[]>([...levelOrder]);

  function toggleLevel(level: Level) {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  }

  const filtered = rows.filter(
    (row) => selectedLevels.includes(row.concept.level) && fuzzyMatch(query, row.searchText),
  );

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, symbol or concept"
        aria-label="Search formulas"
        className="mt-6 w-full rounded-lg border border-border px-3 py-2 text-sm"
      />

      <fieldset className="mt-4">
        <legend>Levels</legend>
        {levelOrder.map((level) => (
          <label key={level} style={{ display: "inline-block", marginRight: "1rem" }}>
            <input
              type="checkbox"
              checked={selectedLevels.includes(level)}
              onChange={() => toggleLevel(level)}
            />
            {level}
          </label>
        ))}
      </fieldset>

      {filtered.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No formulas match &ldquo;{query}&rdquo;.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border">
          {filtered.map(({ formula, concept }) => (
            <li key={formula.id} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <LevelBadge level={concept.level} />
                <Link href={`/${locale}/concepts/${concept.id}`} className="underline">
                  {concept.title[locale]}
                </Link>
              </div>
              <Math tex={formula.latex} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
