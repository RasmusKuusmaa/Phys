import { lang } from "next/root-params";
import { loadFormulas } from "@/content/formulas";
import { loadProblemTemplates } from "@/content/problemTemplates";
import { loadErrorModels } from "@/content/errorModels";
import { getDictionary } from "@/i18n/dictionaries";
import { instantiateProblem } from "@/lib/formula/instantiate";
import { solve } from "@/lib/formula/solve";
import { generateDistractors, buildOptions } from "@/lib/formula/distractors";
import { generateWorkedSolution, formatWorkedSolution } from "@/lib/formula/workedSolution";
import { difficultyTier } from "@/lib/formula/difficulty";
import { createRng, hashSeed } from "@/lib/formula/rng";
import { formatUnitName, getUnit } from "@/lib/units/registry";

/**
 * Deliberately unstyled — this exists to prove the formula engine works
 * end to end (instantiate -> solve -> distractors -> worked solution)
 * before any Phase 6 UI polish, per the build-order note in todo.md.
 */
export default async function DrillDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ seed?: string }>;
}) {
  const locale = await lang();
  const dict = await getDictionary();
  const { seed = "demo-1" } = await searchParams;

  const [formula] = loadFormulas("physics");
  const [template] = loadProblemTemplates("physics");
  const [errorModel] = loadErrorModels("physics");

  const problem = instantiateProblem(template, seed);
  const correctValue = solve(formula, problem.solveFor, problem.values);
  const distractors = generateDistractors(errorModel, problem.values);
  const options = buildOptions(correctValue, distractors, createRng(hashSeed(`${seed}-options`)));
  const workedSolution = generateWorkedSolution(formula, problem.solveFor, problem.values);
  const tier = difficultyTier(formula, template);
  const targetSymbol = formula.symbols.find((s) => s.symbol === problem.solveFor)!;
  const targetUnit = getUnit(targetSymbol.unit);

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Formula engine demo (seed: {seed})</h1>

      <h2>Given</h2>
      <ul>
        {formula.symbols
          .filter((s) => s.symbol !== problem.solveFor)
          .map((s) => (
            <li key={s.symbol}>
              {s.name[locale as "en" | "et"]} ({s.symbol}) = {problem.values[s.symbol]}{" "}
              {formatUnitName(s.unit, locale as "en" | "et")} ({s.unit})
            </li>
          ))}
      </ul>

      <h2>
        Solve for {targetSymbol.name[locale as "en" | "et"]} ({problem.solveFor}), in{" "}
        {targetUnit.symbol} — difficulty: {tier}
      </h2>

      <h3>Options</h3>
      <ol type="A">
        {options.map((option, i) => (
          <li key={i}>
            {option.value} {targetUnit.symbol}
            {option.isCorrect ? " (correct)" : option.mistakeId ? ` (mistake: ${option.mistakeId})` : ""}
          </li>
        ))}
      </ol>

      <h3>Worked solution</h3>
      <pre>{formatWorkedSolution(workedSolution, dict).join("\n")}</pre>
    </div>
  );
}
