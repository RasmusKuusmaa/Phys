"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnswerFormat, Concept, Level, TestMode } from "@/schema";
import { levelOrder } from "@/schema";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import { encodeTestConfig } from "@/lib/test/testConfigUrl";
import { LevelBadge } from "@/components/LevelBadge";

const ITEM_COUNT_PRESETS = [5, 10, 20];
const MAX_ITEM_COUNT = 50;

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function TestBuilderForm({
  subject,
  concepts,
  locale,
  strings,
  initialConceptIds,
}: {
  subject: string;
  concepts: Concept[];
  locale: Locale;
  strings: Messages["practice"];
  /** Pre-selects concepts, e.g. from the results screen's "practise again" link for a weak concept. */
  initialConceptIds?: string[];
}) {
  const router = useRouter();
  const [levels, setLevels] = useState<Level[]>([...levelOrder]);
  const [conceptIds, setConceptIds] = useState<string[]>(
    initialConceptIds ?? concepts.map((c) => c.id),
  );
  const [itemCount, setItemCount] = useState(5);
  const [mode, setMode] = useState<TestMode>("mixed");
  const [answerFormat, setAnswerFormat] = useState<AnswerFormat>("multiple-choice");
  const [filter, setFilter] = useState("");

  // A subject can carry 200+ concepts, so the list is filtered rather than
  // dumped in full: by the level toggles above it (a concept at an excluded
  // level can't contribute questions anyway) and by a free-text filter.
  const visible = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    return concepts.filter(
      (concept) =>
        levels.includes(concept.level) &&
        (needle === "" || concept.title[locale].toLowerCase().includes(needle)),
    );
  }, [concepts, levels, filter, locale]);

  const selectedCount = conceptIds.length;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = encodeTestConfig({
      subject,
      levels,
      conceptIds,
      itemCount,
      mode,
      answerFormat,
      // Random per submission — the resulting URL is what makes the exact
      // same test shareable and retakeable afterwards.
      seed: String(Date.now()),
    });
    router.push(`/${locale}/practice/run?${params.toString()}`);
  }

  const canStart = conceptIds.length > 0 && levels.length > 0;

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <Section title={strings.levelsLabel}>
        <div className="flex flex-wrap gap-2">
          {levelOrder.map((level) => (
            <Chip
              key={level}
              pressed={levels.includes(level)}
              onClick={() => setLevels((prev) => toggle(prev, level))}
            >
              <LevelBadge level={level} />
            </Chip>
          ))}
        </div>
      </Section>

      <Section title={strings.conceptsLabel}>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder={strings.conceptFilterPlaceholder}
            aria-label={strings.conceptFilterPlaceholder}
            className="min-w-0 flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() =>
              setConceptIds((prev) => [
                ...new Set([...prev, ...visible.map((concept) => concept.id)]),
              ])
            }
            className="rounded-lg border border-border px-3 py-2 text-xs hover:border-accent"
          >
            {strings.selectAll}
          </button>
          <button
            type="button"
            onClick={() => {
              const hidden = new Set(visible.map((concept) => concept.id));
              setConceptIds((prev) => prev.filter((id) => !hidden.has(id)));
            }}
            className="rounded-lg border border-border px-3 py-2 text-xs hover:border-accent"
          >
            {strings.selectNone}
          </button>
        </div>

        <p className="mt-2 text-xs text-muted">
          {selectedCount} / {concepts.length} {strings.selected}
        </p>

        {visible.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{strings.noConceptsMatch}</p>
        ) : (
          <ul className="mt-3 max-h-72 divide-y divide-border overflow-y-auto rounded-xl border border-border">
            {visible.map((concept) => {
              const checked = conceptIds.includes(concept.id);
              return (
                <li key={concept.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-border/40">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setConceptIds((prev) => toggle(prev, concept.id))}
                      className="accent-[var(--accent)]"
                    />
                    <LevelBadge level={concept.level} />
                    <span className="truncate">{concept.title[locale]}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <div className="grid gap-6 sm:grid-cols-2">
        <Section title={strings.modeLabel}>
          <div className="flex flex-wrap gap-2">
            {(["concept", "formula", "mixed"] as const).map((option) => (
              <Chip key={option} pressed={mode === option} onClick={() => setMode(option)}>
                {strings.mode[option]}
              </Chip>
            ))}
          </div>
        </Section>

        <Section title={strings.answerFormatLabel}>
          <div className="flex flex-wrap gap-2">
            {(["multiple-choice", "free-entry"] as const).map((option) => (
              <Chip
                key={option}
                pressed={answerFormat === option}
                onClick={() => setAnswerFormat(option)}
              >
                {strings.format[option]}
              </Chip>
            ))}
          </div>
        </Section>
      </div>

      <Section title={strings.itemCountLabel}>
        <div className="flex flex-wrap items-center gap-2">
          {ITEM_COUNT_PRESETS.map((preset) => (
            <Chip key={preset} pressed={itemCount === preset} onClick={() => setItemCount(preset)}>
              {preset}
            </Chip>
          ))}
          <input
            type="number"
            min={1}
            max={MAX_ITEM_COUNT}
            value={itemCount}
            onChange={(event) =>
              setItemCount(
                Math.min(MAX_ITEM_COUNT, Math.max(1, Math.round(Number(event.target.value) || 1))),
              )
            }
            aria-label={strings.itemCountLabel}
            className="w-20 rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!canStart}
          // `enabled:` guard — a bare hover: would still darken the button
          // while it's disabled, implying it can be clicked.
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white enabled:hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {strings.start}
        </button>
        {!canStart && <span className="text-xs text-muted">{strings.needSelection}</span>}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Chip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
        pressed
          ? "border border-accent bg-accent/10 font-medium"
          : "border border-border text-muted hover:border-accent hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
