import type { ErrorModel } from "@/schema";
import { evaluate } from "./expression";

export type Distractor = {
  mistakeId: string;
  value: number;
  misconceptionId?: string;
};

/** Evaluates each mistake's expression against the same variable scope as the correct solve, producing one distractor per mistake. */
export function generateDistractors(
  errorModel: ErrorModel,
  values: Record<string, number>,
): Distractor[] {
  return errorModel.mistakes.map((mistake) => ({
    mistakeId: mistake.id,
    value: evaluate(mistake.expression, values),
    misconceptionId: mistake.misconceptionId,
  }));
}
