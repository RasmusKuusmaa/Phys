import type { Formula, ProblemTemplate } from "@/schema";
import { parseExpression } from "./expression";

export type Difficulty = "easy" | "medium" | "hard";

function expressionDepth(node: ReturnType<typeof parseExpression>): number {
  switch (node.type) {
    case "number":
    case "identifier":
      return 0;
    case "unary":
      return 1 + expressionDepth(node.operand);
    case "binary":
      return 1 + Math.max(expressionDepth(node.left), expressionDepth(node.right));
    case "call":
      return 1 + Math.max(0, ...node.args.map(expressionDepth));
  }
}

/** How many operations the target's authored expression takes to compute — a proxy for how far it is from the formula's natural form. */
export function rearrangementDepth(formula: Formula, target: string): number {
  const expression = formula.expressions[target];
  if (!expression) {
    throw new Error(`Formula "${formula.id}" has no expression for solve-for target "${target}"`);
  }
  return expressionDepth(parseExpression(expression));
}

/** How many sampled variables are declared in a unit other than the formula's symbol unit, each requiring a conversion before solving. */
export function unitConversionCount(formula: Formula, template: ProblemTemplate): number {
  let count = 0;
  for (const variable of template.variables) {
    const symbolDef = formula.symbols.find((s) => s.symbol === variable.symbol);
    if (symbolDef && symbolDef.unit !== variable.unit) count++;
  }
  return count;
}

export function difficultyTier(formula: Formula, template: ProblemTemplate): Difficulty {
  const score = rearrangementDepth(formula, template.solveFor) + unitConversionCount(formula, template);
  if (score <= 1) return "easy";
  if (score <= 3) return "medium";
  return "hard";
}
