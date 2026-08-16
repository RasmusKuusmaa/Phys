import { z } from "zod";
import { LocalisedStringSchema } from "./localisedString";
import { parseExpression } from "@/lib/formula/expression";

/**
 * `expression` is evaluated against the same variable scope as the correct
 * solve, producing the distractor value — e.g. forgetting to square time in
 * `s = ½at²` becomes `expression: "0.5 * a * t"`. Whether its identifiers
 * are actually a subset of the formula's declared symbols is a cross-file
 * concern, checked by the content loader once both files are loaded, not
 * here.
 */
export const MistakeSchema = z.object({
  id: z.string().min(1),
  description: LocalisedStringSchema,
  misconceptionId: z.string().min(1).optional(),
  expression: z.string().min(1),
});

export const ErrorModelSchema = z
  .object({
    id: z.string().min(1),
    formulaId: z.string().min(1),
    solveFor: z.string().min(1),
    mistakes: z.array(MistakeSchema).min(1),
  })
  .superRefine((errorModel, ctx) => {
    errorModel.mistakes.forEach((mistake, i) => {
      try {
        parseExpression(mistake.expression);
      } catch (err) {
        ctx.addIssue({
          code: "custom",
          path: ["mistakes", i, "expression"],
          message: `does not parse: ${(err as Error).message}`,
        });
      }
    });
  });

export type Mistake = z.infer<typeof MistakeSchema>;
export type ErrorModel = z.infer<typeof ErrorModelSchema>;
