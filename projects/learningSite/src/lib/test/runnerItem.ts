import type { ConceptItem, ErrorModel, Formula } from "@/schema";
import type { InstantiatedProblem } from "@/lib/formula/instantiate";
import type { Option } from "@/lib/formula/distractors";
import type { WorkedSolution } from "@/lib/formula/workedSolution";

export type FormulaOption = Option & { misconceptionId?: string };

export type FormulaRunnerItem = {
  kind: "formula";
  conceptId: string;
  formula: Formula;
  problem: InstantiatedProblem;
  correctValue: number;
  /** Present only when the test's answer format is multiple-choice. */
  options?: FormulaOption[];
  /** Kept so free-entry answers can be reverse-matched against a mistake's value to surface a misconception even without discrete options. */
  errorModel?: ErrorModel;
  workedSolution: WorkedSolution;
};

export type ConceptRunnerItem = {
  kind: "concept";
  conceptId: string;
  item: ConceptItem;
};

export type RunnerItem = FormulaRunnerItem | ConceptRunnerItem;

export type AnswerRecord = {
  conceptId: string;
  correct: boolean;
  misconceptionId?: string;
};
