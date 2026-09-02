"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import type { Element, ElementCategory } from "@/schema";
import { ElementCategorySchema } from "@/schema";
import { elementPlacement, F_BLOCK_PLACEHOLDERS, FIRST_F_BLOCK_COLUMN } from "@/lib/periodicTable/layout";

type Strings = Messages["periodicTable"];

/**
 * Elements with no stable isotope carry a mass *number* rather than a
 * measured standard atomic weight. Brackets are the convention that says
 * so, and the distinction is exactly the kind a chemistry exam asks about.
 */
function formatMass(element: Element, locale: Locale): string {
  const isMassNumber = Number.isInteger(element.mass);
  const shown = element.mass.toLocaleString(locale, {
    minimumFractionDigits: isMassNumber ? 0 : 2,
    maximumFractionDigits: isMassNumber ? 0 : 4,
  });
  return isMassNumber ? `(${shown})` : shown;
}

function matches(element: Element, query: string, locale: Locale): boolean {
  const q = query.trim().toLowerCase();
  if (q === "") return true;
  return (
    element.symbol.toLowerCase() === q ||
    element.symbol.toLowerCase().startsWith(q) ||
    element.name[locale].toLowerCase().includes(q) ||
    String(element.z) === q
  );
}

export function PeriodicTable({
  elements,
  locale,
  strings,
}: {
  elements: Element[];
  locale: Locale;
  strings: Strings;
}) {
  const [selectedZ, setSelectedZ] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () => elements.find((element) => element.z === selectedZ) ?? null,
    [elements, selectedZ],
  );

  const matchCount = useMemo(
    () => elements.filter((element) => matches(element, query, locale)).length,
    [elements, query, locale],
  );

  return (
    <div className="mt-8">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={strings.searchPlaceholder}
        aria-label={strings.searchPlaceholder}
        className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm sm:max-w-md"
      />

      <ElementDetail element={selected} locale={locale} strings={strings} />

      {matchCount === 0 && <p className="mt-4 text-sm text-muted">{strings.noMatches}</p>}

      {/* The table has a hard minimum width — 18 columns can't usefully
          reflow — so it scrolls inside its own box rather than forcing the
          whole page sideways. */}
      <div className="mt-6 overflow-x-auto pb-2">
        <div
          role="grid"
          aria-label={strings.heading}
          // 18 columns at 4rem each: wide enough that a name like
          // "Hydrogen" fits rather than truncating to an unreadable stub.
          className="grid min-w-[72rem] gap-1"
          style={{
            gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
            gridTemplateRows: "repeat(7, auto) 0.75rem auto auto",
          }}
        >
          {elements.map((element) => {
            const { column, row } = elementPlacement(element);
            const isSelected = element.z === selectedZ;
            return (
              <button
                key={element.z}
                type="button"
                onClick={() => setSelectedZ(isSelected ? null : element.z)}
                aria-pressed={isSelected}
                aria-label={`${element.name[locale]} (${element.symbol}), ${strings.atomicNumber} ${element.z}`}
                // The longest names still truncate at this cell width;
                // hovering gives the full one without a click.
                title={element.name[locale]}
                data-match={matches(element, query, locale)}
                style={
                  {
                    gridColumn: column,
                    gridRow: row,
                    "--el-hue": `var(--el-${element.category})`,
                  } as React.CSSProperties
                }
                className="element-cell rounded p-1 text-center transition-opacity"
              >
                <span className="block text-[0.5rem] leading-none text-muted">{element.z}</span>
                <span className="block text-sm leading-tight font-semibold">{element.symbol}</span>
                <span className="block truncate text-[0.55rem] leading-none text-muted">
                  {element.name[locale]}
                </span>
              </button>
            );
          })}

          {F_BLOCK_PLACEHOLDERS.map((placeholder) => (
            <div
              key={placeholder.label}
              aria-hidden
              style={{ gridColumn: FIRST_F_BLOCK_COLUMN, gridRow: placeholder.row }}
              className="flex items-center justify-center rounded border border-dashed border-border p-1 text-[0.55rem] text-muted"
            >
              {placeholder.label}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">{strings.fBlockNote}</p>
      <p className="mt-1 text-xs text-muted">{strings.massNote}</p>

      <Legend strings={strings} />
    </div>
  );
}

function ElementDetail({
  element,
  locale,
  strings,
}: {
  element: Element | null;
  locale: Locale;
  strings: Strings;
}) {
  if (!element) {
    return (
      <div className="mt-4 rounded-2xl border border-border p-4 text-sm text-muted">
        {strings.selectPrompt}
      </div>
    );
  }

  return (
    <div
      className="mt-4 rounded-2xl border border-border p-4"
      style={{ "--el-hue": `var(--el-${element.category})` } as React.CSSProperties}
      aria-live="polite"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-3xl font-semibold">{element.symbol}</span>
        <span className="text-lg">{element.name[locale]}</span>
        <span
          className="rounded-full px-2 py-0.5 text-xs"
          style={{ background: "color-mix(in srgb, var(--el-hue) 20%, transparent)" }}
        >
          {strings.category[element.category]}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-5">
        <Fact label={strings.atomicNumber} value={String(element.z)} />
        <Fact label={strings.mass} value={formatMass(element, locale)} />
        <Fact label={strings.group} value={element.group === null ? "—" : String(element.group)} />
        <Fact label={strings.period} value={String(element.period)} />
        <Fact label={strings.block} value={element.block} />
      </dl>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function Legend({ strings }: { strings: Strings }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs">
      {ElementCategorySchema.options.map((category: ElementCategory) => (
        <li key={category} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-3 w-3 rounded-sm"
            style={{ background: `color-mix(in srgb, var(--el-${category}) 45%, transparent)` }}
          />
          {strings.category[category]}
        </li>
      ))}
    </ul>
  );
}
