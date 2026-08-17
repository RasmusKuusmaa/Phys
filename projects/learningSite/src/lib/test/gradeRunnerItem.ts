import { evaluate } from "@/lib/formula/expression";
import { grade } from "@/lib/formula/grade";
import { parseNumericInput } from "@/lib/formula/parseAnswer";
import { gradeMultipleChoice } from "@/lib/conceptItems/multipleChoice";
import { gradeProportionality } from "@/lib/conceptItems/proportionality";
import { gradeFormulaSelection } from "@/lib/conceptItems/formulaSelection";
import { gradeOrdering } from "@/lib/conceptItems/ordering";
import type { AnswerRecord, RunnerItem } from "./runnerItem";

export type RunnerAnswer =
  | { kind: "formula-option"; index: number }
  | { kind: "formula-numeric"; raw: string }
  | { kind: "concept-option"; optionId: string }
  | { kind: "ordering"; order: string[] };

export function gradeRunnerItem(item: RunnerItem, answer: RunnerAnswer): AnswerRecord {
  if (item.kind === "formula") {
    if (answer.kind === "formula-option") {
      const option = item.options?.[answer.index];
      if (!option) throw new Error(`No option at index ${answer.index}`);
      return { conceptId: item.conceptId, correct: option.isCorrect, misconceptionId: option.misconceptionId };
    }
    if (answer.kind === "formula-numeric") {
      const given = parseNumericInput(answer.raw);
      if (given === null) return { conceptId: item.conceptId, correct: false };

      const result = grade(given, item.correctValue);
      if (result.correct) return { conceptId: item.conceptId, correct: true };

      // Wrong, but does it match a known mistake? Surface that misconception
      // even though free entry has no discrete options to tag.
      let misconceptionId: string | undefined;
      if (item.errorModel) {
        for (const mistake of item.errorModel.mistakes) {
          const mistakeValue = evaluate(mistake.expression, item.problem.values);
          if (grade(given, mistakeValue).correct) {
            misconceptionId = mistake.misconceptionId;
            break;
          }
        }
      }
      return { conceptId: item.conceptId, correct: false, misconceptionId };
    }
    throw new Error(`Answer kind "${answer.kind}" does not match a formula item`);
  }

  if (answer.kind === "concept-option") {
    if (item.item.type === "multiple-choice") {
      const result = gradeMultipleChoice(item.item, answer.optionId);
      return { conceptId: item.conceptId, ...result };
    }
    if (item.item.type === "proportionality") {
      const result = gradeProportionality(item.item, answer.optionId);
      return { conceptId: item.conceptId, ...result };
    }
    if (item.item.type === "formula-selection") {
      const result = gradeFormulaSelection(item.item, answer.optionId);
      return { conceptId: item.conceptId, ...result };
    }
  }
  if (answer.kind === "ordering" && item.item.type === "ordering") {
    const result = gradeOrdering(item.item, answer.order);
    return { conceptId: item.conceptId, correct: result.correct };
  }

  throw new Error(`Answer kind "${answer.kind}" does not match item type "${item.item.type}"`);
}
