"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type {
  Concept,
  ConceptItem,
  ErrorModel,
  Formula,
  Misconception,
  OrderingItem,
  ProblemTemplate,
  TestConfig,
} from "@/schema";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import { buildRunnerItems } from "@/lib/test/buildRunnerItems";
import { gradeRunnerItem } from "@/lib/test/gradeRunnerItem";
import type { AnswerRecord, RunnerItem } from "@/lib/test/runnerItem";
import {
  computeConceptResults,
  computeMisconceptionCounts,
  isWeakConcept,
} from "@/lib/test/computeResults";
import { formatWorkedSolution } from "@/lib/formula/workedSolution";
import { getUnit } from "@/lib/units/registry";
import { FormulaDisplay } from "@/components/FormulaDisplay";
// Aliased: the component is named `Math`, which would shadow the global
// `Math` this file also uses for rounding.
import { Math as MathTex } from "@/components/Math";
import { setConceptStatus, recordMisconceptionHits } from "@/lib/progress/store";
import { recordAttempt } from "@/lib/testHistory/store";

type Strings = Messages["practice"];
const OPTION_LETTERS = "ABCDEFGH";

export function TestRunner({
  locale,
  dict,
  config,
  concepts,
  formulas,
  templates,
  errorModels,
  conceptItems,
  misconceptions,
}: {
  locale: Locale;
  dict: Pick<Messages, "workedSolution" | "practice">;
  config: TestConfig;
  concepts: Concept[];
  formulas: Formula[];
  templates: ProblemTemplate[];
  errorModels: ErrorModel[];
  conceptItems: ConceptItem[];
  misconceptions: Misconception[];
}) {
  const strings = dict.practice;
  const items = useMemo(
    () => buildRunnerItems(config, { formulas, templates, errorModels, conceptItems }),
    [config, formulas, templates, errorModels, conceptItems],
  );

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [numericInput, setNumericInput] = useState("");
  const [feedback, setFeedback] = useState<AnswerRecord | null>(null);

  const conceptById = new Map(concepts.map((c) => [c.id, c]));
  // Options on a formula-selection item carry a formula *id*, not its
  // LaTeX — the item schema deliberately doesn't duplicate formula content.
  // Resolving it here is what turns an internal id into something a learner
  // can actually read.
  const formulaById = new Map(formulas.map((f) => [f.id, f]));

  if (items.length === 0) {
    return (
      <Shell>
        <p className="text-sm text-muted">{strings.noItems}</p>
        <Link
          href={`/${locale}/practice`}
          className="mt-4 inline-block rounded-lg border border-border px-4 py-2 text-sm hover:border-accent"
        >
          {strings.backToBuilder}
        </Link>
      </Shell>
    );
  }

  if (index >= items.length) {
    return (
      <ResultsScreen
        answers={answers}
        total={items.length}
        concepts={concepts}
        misconceptions={misconceptions}
        locale={locale}
        strings={strings}
      />
    );
  }

  const current = items[index];
  const concept = conceptById.get(current.conceptId);

  function submit(answer: Parameters<typeof gradeRunnerItem>[1]) {
    const record = gradeRunnerItem(current, answer);
    setAnswers((prev) => [...prev, record]);
    setFeedback(record);
  }

  function next() {
    setFeedback(null);
    setNumericInput("");
    setIndex((prev) => prev + 1);
  }

  return (
    <Shell>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="text-muted">
          {strings.questionLabel} {index + 1} / {items.length}
        </span>
        {concept && (
          <Link
            href={`/${locale}/concepts/${concept.id}`}
            className="truncate text-muted underline hover:text-foreground"
          >
            {concept.title[locale]}
          </Link>
        )}
      </div>

      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={index}
        aria-valuemin={0}
        aria-valuemax={items.length}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width]"
          style={{ width: `${(index / items.length) * 100}%` }}
        />
      </div>

      <div className="mt-6">
        {feedback ? (
          <FeedbackPanel
            item={current}
            feedback={feedback}
            locale={locale}
            dict={dict}
            strings={strings}
            formulaById={formulaById}
            onNext={next}
          />
        ) : current.kind === "formula" ? (
          <FormulaItemView
            item={current}
            locale={locale}
            strings={strings}
            numericInput={numericInput}
            setNumericInput={setNumericInput}
            onSubmit={submit}
          />
        ) : (
          <ConceptItemView
            item={current.item}
            locale={locale}
            strings={strings}
            formulaById={formulaById}
            onSubmit={submit}
          />
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-2xl px-4 py-16">{children}</div>;
}

/** Lettered answer button — the shared affordance for every choice-style question. */
function OptionButton({
  letter,
  onClick,
  children,
}: {
  letter: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left text-sm transition-colors hover:border-accent hover:bg-accent/5"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium">
        {letter}
      </span>
      <span className="min-w-0">{children}</span>
    </button>
  );
}

function ResultsScreen({
  answers,
  total,
  concepts,
  misconceptions,
  locale,
  strings,
}: {
  answers: AnswerRecord[];
  total: number;
  concepts: Concept[];
  misconceptions: Misconception[];
  locale: Locale;
  strings: Strings;
}) {
  const correctCount = answers.filter((a) => a.correct).length;
  const results = computeConceptResults(answers);
  const conceptById = new Map(concepts.map((c) => [c.id, c]));
  const misconceptionCounts = computeMisconceptionCounts(answers);
  const misconceptionById = new Map(misconceptions.map((m) => [m.id, m]));

  // Runs once when the results screen mounts (answers don't change after
  // that) — a concept holding accuracy above the weak threshold graduates
  // to "confident", otherwise "learning", overriding whatever manual
  // status (Phase 10's ConceptStatusControl) was set before this attempt.
  // Guarded against the same `answers` reference re-running the body:
  // recordMisconceptionHits accumulates rather than replacing, so without
  // this guard React's dev-mode double-invoke of effects (StrictMode)
  // double-counts every hit.
  const recordedAnswersRef = useRef<AnswerRecord[] | null>(null);
  useEffect(() => {
    if (recordedAnswersRef.current === answers) return;
    recordedAnswersRef.current = answers;

    for (const result of computeConceptResults(answers)) {
      setConceptStatus(result.conceptId, isWeakConcept(result) ? "learning" : "confident");
    }
    recordMisconceptionHits(computeMisconceptionCounts(answers));

    if (results.length > 0) {
      recordAttempt({
        conceptIds: results.map((r) => r.conceptId),
        percent: total === 0 ? 0 : Math.round((correctCount / total) * 100),
        itemCount: total,
      });
    }
  }, [answers, results, total, correctCount]);

  const percent = total === 0 ? 0 : Math.round((correctCount / total) * 100);

  return (
    <Shell>
      <h1 className="text-3xl font-semibold">{strings.complete}</h1>

      <div className="mt-6 rounded-2xl border border-border p-6 text-center">
        <p className="text-4xl font-semibold">
          {correctCount} / {total}
        </p>
        <p className="mt-1 text-sm text-muted">
          {percent}% {strings.scoreLabel}
        </p>
      </div>

      <h2 className="mt-8 text-lg font-semibold">{strings.byConcept}</h2>
      <ul className="mt-3 space-y-2">
        {results.map((result) => {
          const concept = conceptById.get(result.conceptId);
          const weak = isWeakConcept(result);
          return (
            <li
              key={result.conceptId}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl border border-border px-4 py-3 text-sm"
            >
              <span className="min-w-0 flex-1 truncate">
                {concept?.title[locale] ?? result.conceptId}
              </span>
              <span className="shrink-0 tabular-nums text-muted">
                {result.correct} / {result.total}
              </span>
              {weak && (
                <Link
                  href={`/${locale}/practice?concepts=${result.conceptId}`}
                  className="shrink-0 rounded-full border border-accent px-2 py-0.5 text-xs hover:bg-accent/10"
                >
                  {strings.practiseAgain}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {misconceptionCounts.length > 0 && (
        <>
          <h2 className="mt-8 text-lg font-semibold">{strings.errorPatterns}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {misconceptionCounts.map(({ misconceptionId, count }) => (
              <li
                key={misconceptionId}
                className="flex items-start justify-between gap-4 rounded-xl border border-border px-4 py-3"
              >
                <span>{misconceptionById.get(misconceptionId)?.text[locale] ?? misconceptionId}</span>
                {/* "× 3" rather than a pluralised phrase — no grammar to get
                    wrong in either locale. */}
                <span className="shrink-0 tabular-nums text-muted">× {count}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          {strings.retake}
        </button>
        <Link
          href={`/${locale}/practice`}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:border-accent"
        >
          {strings.newSet}
        </Link>
      </div>
    </Shell>
  );
}

function FeedbackPanel({
  item,
  feedback,
  locale,
  dict,
  strings,
  formulaById,
  onNext,
}: {
  item: RunnerItem;
  feedback: AnswerRecord;
  locale: Locale;
  dict: Pick<Messages, "workedSolution">;
  strings: Strings;
  formulaById: Map<string, Formula>;
  onNext: () => void;
}) {
  return (
    <div>
      <div
        className={`rounded-xl border px-4 py-3 text-sm font-medium ${
          feedback.correct
            ? "border-[var(--level-l0)] bg-[color-mix(in_srgb,var(--level-l0)_12%,transparent)]"
            : "border-[var(--level-l3)] bg-[color-mix(in_srgb,var(--level-l3)_12%,transparent)]"
        }`}
        role="status"
      >
        {feedback.correct ? strings.correct : strings.incorrect}
      </div>

      {item.kind === "formula" && (
        <pre className="mt-4 overflow-x-auto rounded-xl border border-border p-4 font-mono text-xs">
          {formatWorkedSolution(item.workedSolution, dict).join("\n")}
        </pre>
      )}

      {item.kind === "concept" && !feedback.correct && (
        <CorrectAnswerHint
          item={item.item}
          locale={locale}
          strings={strings}
          formulaById={formulaById}
        />
      )}

      <button
        type="button"
        onClick={onNext}
        autoFocus
        className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
      >
        {strings.next}
      </button>
    </div>
  );
}

function CorrectAnswerHint({
  item,
  locale,
  strings,
  formulaById,
}: {
  item: ConceptItem;
  locale: Locale;
  strings: Strings;
  formulaById: Map<string, Formula>;
}) {
  if (item.type === "ordering") {
    const correctOrder = [...item.entries]
      .sort((a, b) => a.correctPosition - b.correctPosition)
      .map((e) => e.label[locale]);
    return (
      <p className="mt-4 text-sm">
        <span className="text-muted">{strings.correctOrder}: </span>
        {correctOrder.join(" → ")}
      </p>
    );
  }

  if (item.type === "formula-selection") {
    const correct = item.options.find((o) => o.correct);
    const formula = correct ? formulaById.get(correct.formulaId) : undefined;
    return (
      <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted">{strings.correctAnswer}:</span>
        {formula ? <MathTex tex={formula.latex} /> : <span>{correct?.formulaId}</span>}
      </p>
    );
  }

  const correctOption = item.options.find((o) => o.correct);
  return (
    <p className="mt-4 text-sm">
      <span className="text-muted">{strings.correctAnswer}: </span>
      {correctOption?.label[locale]}
    </p>
  );
}

function FormulaItemView({
  item,
  locale,
  strings,
  numericInput,
  setNumericInput,
  onSubmit,
}: {
  item: Extract<RunnerItem, { kind: "formula" }>;
  locale: Locale;
  strings: Strings;
  numericInput: string;
  setNumericInput: (value: string) => void;
  onSubmit: (answer: Parameters<typeof gradeRunnerItem>[1]) => void;
}) {
  const targetSymbol = item.formula.symbols.find((s) => s.symbol === item.problem.solveFor)!;
  const targetUnit = getUnit(targetSymbol.unit);

  return (
    <div>
      <div className="rounded-2xl border border-border p-4">
        <FormulaDisplay formula={item.formula} locale={locale} />
      </div>

      <h3 className="mt-6 text-xs font-medium text-muted">{strings.given}</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {item.formula.symbols
          .filter((s) => s.symbol !== item.problem.solveFor)
          .map((s) => (
            <li key={s.symbol} className="flex flex-wrap gap-x-2">
              <span className="text-muted">{s.name[locale]}</span>
              <span className="font-mono">
                {s.symbol} = {item.problem.values[s.symbol]} {s.unit}
              </span>
            </li>
          ))}
      </ul>

      <p className="mt-4 text-sm">
        <span className="text-muted">{strings.solveFor}: </span>
        <span className="font-medium">
          {targetSymbol.name[locale]} ({item.problem.solveFor})
        </span>
        <span className="text-muted"> — {targetUnit.symbol}</span>
      </p>

      {item.options ? (
        <div className="mt-6 space-y-2">
          {item.options.map((option, i) => (
            <OptionButton
              key={i}
              letter={OPTION_LETTERS[i] ?? String(i + 1)}
              onClick={() => onSubmit({ kind: "formula-option", index: i })}
            >
              <span className="font-mono">
                {option.value} {targetUnit.symbol}
              </span>
            </OptionButton>
          ))}
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({ kind: "formula-numeric", raw: numericInput });
          }}
          className="mt-6 flex flex-wrap gap-2"
        >
          <input
            type="text"
            inputMode="decimal"
            value={numericInput}
            onChange={(e) => setNumericInput(e.target.value)}
            placeholder={strings.answerPlaceholder}
            aria-label={strings.answerPlaceholder}
            autoFocus
            className="min-w-0 flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          />
          <span className="self-center text-sm text-muted">{targetUnit.symbol}</span>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            {strings.submit}
          </button>
        </form>
      )}
    </div>
  );
}

function ConceptItemView({
  item,
  locale,
  strings,
  formulaById,
  onSubmit,
}: {
  item: ConceptItem;
  locale: Locale;
  strings: Strings;
  formulaById: Map<string, Formula>;
  onSubmit: (answer: Parameters<typeof gradeRunnerItem>[1]) => void;
}) {
  return (
    <div>
      <p className="text-base">{item.stem[locale]}</p>

      {(item.type === "multiple-choice" || item.type === "proportionality") && (
        <div className="mt-6 space-y-2">
          {item.options.map((option, i) => (
            <OptionButton
              key={option.id}
              letter={OPTION_LETTERS[i] ?? String(i + 1)}
              onClick={() => onSubmit({ kind: "concept-option", optionId: option.id })}
            >
              {option.label[locale]}
            </OptionButton>
          ))}
        </div>
      )}

      {item.type === "formula-selection" && (
        <div className="mt-6 space-y-2">
          {item.options.map((option, i) => {
            const formula = formulaById.get(option.formulaId);
            return (
              <OptionButton
                key={option.id}
                letter={OPTION_LETTERS[i] ?? String(i + 1)}
                onClick={() => onSubmit({ kind: "concept-option", optionId: option.id })}
              >
                {/* Render the formula itself; the id is an internal key the
                    learner should never be asked to choose between. */}
                {formula ? <MathTex tex={formula.latex} /> : option.formulaId}
              </OptionButton>
            );
          })}
        </div>
      )}

      {item.type === "ordering" && (
        <OrderingItemView item={item} locale={locale} strings={strings} onSubmit={onSubmit} />
      )}
    </div>
  );
}

/**
 * Split out so `entries` is reached only on the variant that has it — the
 * other three item types carry no such field, and its own `useState` then
 * exists only for the question that actually needs it.
 */
function OrderingItemView({
  item,
  locale,
  strings,
  onSubmit,
}: {
  item: OrderingItem;
  locale: Locale;
  strings: Strings;
  onSubmit: (answer: Parameters<typeof gradeRunnerItem>[1]) => void;
}) {
  const [order, setOrder] = useState<string[] | null>(null);
  const currentOrder = order ?? item.entries.map((e) => e.id);

  function move(from: number, to: number) {
    if (to < 0 || to >= currentOrder.length) return;
    const next = [...currentOrder];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    setOrder(next);
  }

  return (
    <div className="mt-6">
      <ul className="space-y-2">
        {currentOrder.map((entryId, position) => {
          const entry = item.entries.find((e) => e.id === entryId)!;
          return (
            <li
              key={entryId}
              className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm"
            >
              <span className="w-5 shrink-0 tabular-nums text-muted">{position + 1}</span>
              <span className="min-w-0 flex-1">{entry.label[locale]}</span>
              {/* Arrows rather than a per-row position dropdown: moving one
                  item is a single click and the list re-numbers itself,
                  instead of every row needing to be re-picked. */}
              <span className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => move(position, position - 1)}
                  disabled={position === 0}
                  aria-label={strings.moveUp}
                  className="rounded border border-border px-2 py-0.5 text-xs enabled:hover:border-accent disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(position, position + 1)}
                  disabled={position === currentOrder.length - 1}
                  aria-label={strings.moveDown}
                  className="rounded border border-border px-2 py-0.5 text-xs enabled:hover:border-accent disabled:opacity-30"
                >
                  ↓
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={() => onSubmit({ kind: "ordering", order: currentOrder })}
        className="mt-4 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
      >
        {strings.submit}
      </button>
    </div>
  );
}
