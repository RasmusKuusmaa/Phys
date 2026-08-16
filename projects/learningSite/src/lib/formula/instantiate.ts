import type { ProblemTemplate } from "@/schema";
import { createRng, hashSeed, randomInRange } from "./rng";

export type InstantiatedProblem = {
  templateId: string;
  formulaId: string;
  seed: string;
  values: Record<string, number>;
  solveFor: string;
};

const MAX_ATTEMPTS = 200;

/** Same seed -> same sampled values, since `createRng` is deterministic. */
export function instantiateProblem(
  template: ProblemTemplate,
  seed: string,
): InstantiatedProblem {
  const rng = createRng(hashSeed(seed));

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const values: Record<string, number> = {};
    for (const variable of template.variables) {
      values[variable.symbol] = randomInRange(rng, variable.min, variable.max);
    }
    if (satisfiesConstraints(template.constraints, values)) {
      return {
        templateId: template.id,
        formulaId: template.formulaId,
        seed,
        values,
        solveFor: template.solveFor,
      };
    }
  }

  throw new Error(
    `Could not sample values satisfying constraints for template "${template.id}" after ${MAX_ATTEMPTS} attempts`,
  );
}

function satisfiesConstraints(
  constraints: ProblemTemplate["constraints"],
  values: Record<string, number>,
): boolean {
  return constraints.every((constraint) => {
    const left = values[constraint.left];
    const right = typeof constraint.right === "number" ? constraint.right : values[constraint.right];
    switch (constraint.op) {
      case "gt":
        return left > right;
      case "gte":
        return left >= right;
      case "lt":
        return left < right;
      case "lte":
        return left <= right;
      case "neq":
        return left !== right;
    }
  });
}
