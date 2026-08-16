import type { Formula } from "@/schema";
import { evaluate, expressionIdentifiers } from "./expression";

export type WorkedSolution = {
  expression: string;
  substituted: string;
  result: number;
};

/** Shows the formula's authored expression with each symbol substituted by its sampled value — the "rearrangement path" is the expression string itself, since the solver looks up a pre-rearranged form per target rather than deriving one algebraically. */
export function generateWorkedSolution(
  formula: Formula,
  target: string,
  values: Record<string, number>,
): WorkedSolution {
  const expression = formula.expressions[target];
  if (!expression) {
    throw new Error(`Formula "${formula.id}" has no expression for solve-for target "${target}"`);
  }

  const identifiers = [...expressionIdentifiers(expression)].sort((a, b) => b.length - a.length);
  let substituted = expression;
  for (const id of identifiers) {
    const pattern = new RegExp(`\\b${id}\\b`, "g");
    substituted = substituted.replace(pattern, String(values[id]));
  }

  return { expression, substituted, result: evaluate(expression, values) };
}
