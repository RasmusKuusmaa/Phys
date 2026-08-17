import type { ConceptItem, ErrorModel, Formula, ProblemTemplate, TestConfig } from "@/schema";
import { instantiateProblem } from "@/lib/formula/instantiate";
import { solve } from "@/lib/formula/solve";
import { generateDistractors, buildOptions } from "@/lib/formula/distractors";
import { generateWorkedSolution } from "@/lib/formula/workedSolution";
import { createRng, hashSeed, shuffle } from "@/lib/formula/rng";
import { selectItems } from "@/lib/conceptItems/selectItems";
import type { RunnerItem } from "./runnerItem";

export function buildRunnerItems(
  config: TestConfig,
  content: {
    formulas: Formula[];
    templates: ProblemTemplate[];
    errorModels: ErrorModel[];
    conceptItems: ConceptItem[];
  },
): RunnerItem[] {
  const items: RunnerItem[] = [];

  if (config.mode === "formula" || config.mode === "mixed") {
    for (const template of content.templates) {
      const formula = content.formulas.find((f) => f.id === template.formulaId);
      if (!formula || !config.conceptIds.includes(formula.conceptId)) continue;

      const seed = `${config.seed}-formula-${template.id}`;
      const problem = instantiateProblem(template, seed);
      const correctValue = solve(formula, problem.solveFor, problem.values);
      const workedSolution = generateWorkedSolution(formula, problem.solveFor, problem.values);

      const errorModel = content.errorModels.find(
        (em) => em.formulaId === formula.id && em.solveFor === problem.solveFor,
      );

      let options;
      if (config.answerFormat === "multiple-choice" && errorModel) {
        const distractors = generateDistractors(errorModel, problem.values);
        const built = buildOptions(correctValue, distractors, createRng(hashSeed(`${seed}-options`)));
        options = built.map((option) => ({
          ...option,
          misconceptionId: errorModel.mistakes.find((m) => m.id === option.mistakeId)?.misconceptionId,
        }));
      }

      items.push({
        kind: "formula",
        conceptId: formula.conceptId,
        formula,
        problem,
        correctValue,
        options,
        errorModel,
        workedSolution,
      });
    }
  }

  if (config.mode === "concept" || config.mode === "mixed") {
    const selected = selectItems(
      content.conceptItems,
      config.conceptIds,
      config.itemCount,
      `${config.seed}-concept`,
    );
    for (const item of selected) {
      items.push({ kind: "concept", conceptId: item.conceptId, item });
    }
  }

  const order = createRng(hashSeed(`${config.seed}-order`));
  return shuffle(items, order).slice(0, config.itemCount);
}
