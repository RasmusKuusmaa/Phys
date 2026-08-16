import { z } from "zod";
import { LocalisedStringSchema } from "./localisedString";
import { expressionIdentifiers, parseExpression } from "@/lib/formula/expression";

/**
 * `unit` is a canonical symbol key into the unit registry (Phase 3), not a
 * localised label — unit symbols stay canonical, only unit *names* are
 * localised, and that localisation lives in the registry, not here.
 */
export const FormulaSymbolSchema = z.object({
  symbol: z.string().min(1),
  name: LocalisedStringSchema,
  unit: z.string().min(1),
});

/**
 * `expressions` holds one evaluable rearrangement per solve-for target
 * (e.g. `{ F: "m * a", a: "F / m" }`) — the solver looks up the target's
 * expression rather than deriving a rearrangement algebraically, so every
 * solvable form is authored explicitly and validated at build time.
 */
export const FormulaSchema = z
  .object({
    id: z.string().min(1),
    conceptId: z.string().min(1),
    latex: z.string().min(1),
    symbols: z.array(FormulaSymbolSchema).min(1),
    solveFor: z.array(z.string().min(1)).min(1),
    expressions: z.record(z.string(), z.string().min(1)),
  })
  .superRefine((formula, ctx) => {
    const symbolNames = new Set(formula.symbols.map((s) => s.symbol));

    for (const target of formula.solveFor) {
      if (!symbolNames.has(target)) {
        ctx.addIssue({
          code: "custom",
          path: ["solveFor"],
          message: `solveFor target "${target}" is not a declared symbol`,
        });
      }
      const expression = formula.expressions[target];
      if (!expression) {
        ctx.addIssue({
          code: "custom",
          path: ["expressions", target],
          message: `missing expression for solveFor target "${target}"`,
        });
        continue;
      }
      let identifiers: string[];
      try {
        identifiers = expressionIdentifiers(expression);
        parseExpression(expression);
      } catch (err) {
        ctx.addIssue({
          code: "custom",
          path: ["expressions", target],
          message: `expression for "${target}" does not parse: ${(err as Error).message}`,
        });
        continue;
      }
      for (const id of identifiers) {
        if (id === target) {
          ctx.addIssue({
            code: "custom",
            path: ["expressions", target],
            message: `expression for "${target}" cannot reference the symbol it solves for`,
          });
        } else if (!symbolNames.has(id)) {
          ctx.addIssue({
            code: "custom",
            path: ["expressions", target],
            message: `expression for "${target}" references undeclared symbol "${id}"`,
          });
        }
      }
    }
  });

export type FormulaSymbol = z.infer<typeof FormulaSymbolSchema>;
export type Formula = z.infer<typeof FormulaSchema>;
