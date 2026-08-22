"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Concept, ConceptItem, ErrorModel, Formula, Misconception, ProblemTemplate, TestConfig } from "@/schema";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import { buildRunnerItems } from "@/lib/test/buildRunnerItems";
import { gradeRunnerItem } from "@/lib/test/gradeRunnerItem";
import type { AnswerRecord, RunnerItem } from "@/lib/test/runnerItem";
import { computeConceptResults, computeMisconceptionCounts, isWeakConcept } from "@/lib/test/computeResults";
import { formatWorkedSolution } from "@/lib/formula/workedSolution";
import { getUnit } from "@/lib/units/registry";
import { FormulaDisplay } from "@/components/FormulaDisplay";
import { setConceptStatus, recordMisconceptionHits } from "@/lib/progress/store";

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
  dict: Pick<Messages, "workedSolution">;
  config: TestConfig;
  concepts: Concept[];
  formulas: Formula[];
  templates: ProblemTemplate[];
  errorModels: ErrorModel[];
  conceptItems: ConceptItem[];
  misconceptions: Misconception[];
}) {
  const items = useMemo(
    () => buildRunnerItems(config, { formulas, templates, errorModels, conceptItems }),
    [config, formulas, templates, errorModels, conceptItems],
  );

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [numericInput, setNumericInput] = useState("");
  const [feedback, setFeedback] = useState<AnswerRecord | null>(null);

  const conceptById = new Map(concepts.map((c) => [c.id, c]));

  if (items.length === 0) {
    return <p style={{ padding: "2rem" }}>No items available for this configuration yet.</p>;
  }

  if (index >= items.length) {
    return (
      <ResultsScreen
        answers={answers}
        total={items.length}
        concepts={concepts}
        misconceptions={misconceptions}
        locale={locale}
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
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <p>
        Question {index + 1} of {items.length}
      </p>
      {concept && <h2>{concept.title[locale]}</h2>}

      {feedback ? (
        <FeedbackPanel item={current} feedback={feedback} locale={locale} dict={dict} onNext={next} />
      ) : (
        <>
          {current.kind === "formula" && (
            <FormulaItemView
              item={current}
              locale={locale}
              numericInput={numericInput}
              setNumericInput={setNumericInput}
              onSubmit={submit}
            />
          )}
          {current.kind === "concept" && (
            <ConceptItemView item={current.item} locale={locale} onSubmit={submit} />
          )}
        </>
      )}
    </div>
  );
}

function ResultsScreen({
  answers,
  total,
  concepts,
  misconceptions,
  locale,
}: {
  answers: AnswerRecord[];
  total: number;
  concepts: Concept[];
  misconceptions: Misconception[];
  locale: Locale;
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
  useEffect(() => {
    for (const result of computeConceptResults(answers)) {
      setConceptStatus(result.conceptId, isWeakConcept(result) ? "learning" : "confident");
    }
    recordMisconceptionHits(computeMisconceptionCounts(answers));
  }, [answers]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Test complete</h1>
      <p>
        {correctCount} / {total} correct.
      </p>

      <h2>By concept</h2>
      <ul>
        {results.map((result) => {
          const concept = conceptById.get(result.conceptId);
          const weak = isWeakConcept(result);
          return (
            <li key={result.conceptId}>
              {concept?.title[locale] ?? result.conceptId}: {result.correct} / {result.total}
              {weak && (
                <>
                  {" — needs review. "}
                  <Link href={`/${locale}/practice?concepts=${result.conceptId}`}>Practise again</Link>
                </>
              )}
            </li>
          );
        })}
      </ul>

      {misconceptionCounts.length > 0 && (
        <>
          <h2>Repeated error patterns</h2>
          <ul>
            {misconceptionCounts.map(({ misconceptionId, count }) => (
              <li key={misconceptionId}>
                {(misconceptionById.get(misconceptionId)?.text[locale] ?? misconceptionId)} — {count} time
                {count === 1 ? "" : "s"}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function FeedbackPanel({
  item,
  feedback,
  locale,
  dict,
  onNext,
}: {
  item: RunnerItem;
  feedback: AnswerRecord;
  locale: Locale;
  dict: Pick<Messages, "workedSolution">;
  onNext: () => void;
}) {
  return (
    <div>
      <p>{feedback.correct ? "Correct" : "Incorrect"}</p>

      {item.kind === "formula" && (
        <pre>{formatWorkedSolution(item.workedSolution, dict).join("\n")}</pre>
      )}

      {item.kind === "concept" && !feedback.correct && (
        <CorrectAnswerHint item={item.item} locale={locale} />
      )}

      <button type="button" onClick={onNext}>
        Next
      </button>
    </div>
  );
}

function CorrectAnswerHint({ item, locale }: { item: ConceptItem; locale: Locale }) {
  if (item.type === "ordering") {
    const correctOrder = [...item.entries]
      .sort((a, b) => a.correctPosition - b.correctPosition)
      .map((e) => e.label[locale]);
    return <p>Correct order: {correctOrder.join(", ")}</p>;
  }
  if (item.type === "formula-selection") {
    const correctOption = item.options.find((o) => o.correct);
    return <p>Correct answer: {correctOption?.formulaId}</p>;
  }
  const correctOption = item.options.find((o) => o.correct);
  return <p>Correct answer: {correctOption?.label[locale]}</p>;
}

function FormulaItemView({
  item,
  locale,
  numericInput,
  setNumericInput,
  onSubmit,
}: {
  item: Extract<RunnerItem, { kind: "formula" }>;
  locale: Locale;
  numericInput: string;
  setNumericInput: (value: string) => void;
  onSubmit: (answer: Parameters<typeof gradeRunnerItem>[1]) => void;
}) {
  const targetSymbol = item.formula.symbols.find((s) => s.symbol === item.problem.solveFor)!;
  const targetUnit = getUnit(targetSymbol.unit);

  return (
    <div>
      <FormulaDisplay formula={item.formula} locale={locale} />
      <ul>
        {item.formula.symbols
          .filter((s) => s.symbol !== item.problem.solveFor)
          .map((s) => (
            <li key={s.symbol}>
              {s.name[locale]} ({s.symbol}) = {item.problem.values[s.symbol]} {s.unit}
            </li>
          ))}
      </ul>
      <p>
        Solve for {targetSymbol.name[locale]} ({item.problem.solveFor}), in {targetUnit.symbol}
      </p>

      {item.options ? (
        <ol type="A">
          {item.options.map((option, i) => (
            <li key={i}>
              <button type="button" onClick={() => onSubmit({ kind: "formula-option", index: i })}>
                {option.value} {targetUnit.symbol}
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <div>
          <input
            type="text"
            value={numericInput}
            onChange={(e) => setNumericInput(e.target.value)}
            placeholder={`answer in ${targetUnit.symbol}`}
          />
          <button type="button" onClick={() => onSubmit({ kind: "formula-numeric", raw: numericInput })}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

function ConceptItemView({
  item,
  locale,
  onSubmit,
}: {
  item: ConceptItem;
  locale: Locale;
  onSubmit: (answer: Parameters<typeof gradeRunnerItem>[1]) => void;
}) {
  const [order, setOrder] = useState<string[] | null>(null);

  return (
    <div>
      <p>{item.stem[locale]}</p>

      {item.type === "multiple-choice" || item.type === "proportionality" ? (
        <ol type="A">
          {item.options.map((option) => (
            <li key={option.id}>
              <button type="button" onClick={() => onSubmit({ kind: "concept-option", optionId: option.id })}>
                {option.label[locale]}
              </button>
            </li>
          ))}
        </ol>
      ) : null}

      {item.type === "formula-selection" ? (
        <ol type="A">
          {item.options.map((option) => (
            <li key={option.id}>
              <button type="button" onClick={() => onSubmit({ kind: "concept-option", optionId: option.id })}>
                {option.formulaId}
              </button>
            </li>
          ))}
        </ol>
      ) : null}

      {item.type === "ordering" ? (
        <div>
          {(order ?? item.entries.map((e) => e.id)).map((entryId, position) => {
            const entry = item.entries.find((e) => e.id === entryId)!;
            return (
              <div key={entryId}>
                <select
                  value={position}
                  onChange={(e) => {
                    const current = order ?? item.entries.map((entry) => entry.id);
                    const next = current.filter((id) => id !== entryId);
                    next.splice(Number(e.target.value), 0, entryId);
                    setOrder(next);
                  }}
                >
                  {item.entries.map((_, i) => (
                    <option key={i} value={i}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                {entry.label[locale]}
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => onSubmit({ kind: "ordering", order: order ?? item.entries.map((e) => e.id) })}
          >
            Submit
          </button>
        </div>
      ) : null}
    </div>
  );
}
