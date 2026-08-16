import type { Formula } from "@/schema";
import { evaluate } from "./expression";

/** Looks up the target's authored expression (see `FormulaSchema`) and evaluates it against the given scope. */
export function solve(formula: Formula, target: string, values: Record<string, number>): number {
  const expression = formula.expressions[target];
  if (!expression) {
    throw new Error(`Formula "${formula.id}" has no expression for solve-for target "${target}"`);
  }
  return evaluate(expression, values);
}
