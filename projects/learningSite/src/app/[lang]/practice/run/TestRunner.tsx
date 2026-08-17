"use client";

import { useMemo, useState } from "react";
import type { Concept, ConceptItem, ErrorModel, Formula, ProblemTemplate, TestConfig } from "@/schema";
import type { Locale } from "@/i18n/locales";
import { buildRunnerItems } from "@/lib/test/buildRunnerItems";
import { gradeRunnerItem } from "@/lib/test/gradeRunnerItem";
import type { AnswerRecord, RunnerItem } from "@/lib/test/runnerItem";
import { getUnit } from "@/lib/units/registry";

export function TestRunner({
  locale,
  config,
  concepts,
  formulas,
  templates,
  errorModels,
  conceptItems,
}: {
  locale: Locale;
  config: TestConfig;
  concepts: Concept[];
  formulas: Formula[];
  templates: ProblemTemplate[];
  errorModels: ErrorModel[];
  conceptItems: ConceptItem[];
}) {
  const items = useMemo(
    () => buildRunnerItems(config, { formulas, templates, errorModels, conceptItems }),
    [config, formulas, templates, errorModels, conceptItems],
  );

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [numericInput, setNumericInput] = useState("");

  const conceptById = new Map(concepts.map((c) => [c.id, c]));

  if (items.length === 0) {
    return <p style={{ padding: "2rem" }}>No items available for this configuration yet.</p>;
  }

  if (index >= items.length) {
    const correctCount = answers.filter((a) => a.correct).length;
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Test complete</h1>
        <p>
          {correctCount} / {items.length} correct.
        </p>
      </div>
    );
  }

  const current = items[index];
  const concept = conceptById.get(current.conceptId);

  function submit(answer: Parameters<typeof gradeRunnerItem>[1]) {
    const record = gradeRunnerItem(current, answer);
    setAnswers((prev) => [...prev, record]);
    setNumericInput("");
    setIndex((prev) => prev + 1);
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <p>
        Question {index + 1} of {items.length}
      </p>
      {concept && <h2>{concept.title[locale]}</h2>}

      {current.kind === "formula" && (
        <FormulaItemView item={current} locale={locale} numericInput={numericInput} setNumericInput={setNumericInput} onSubmit={submit} />
      )}
      {current.kind === "concept" && (
        <ConceptItemView item={current.item} locale={locale} onSubmit={submit} />
      )}
    </div>
  );
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
