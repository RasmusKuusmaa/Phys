import { z } from "zod";

export const VariableRangeSchema = z
  .object({
    symbol: z.string().min(1),
    min: z.number(),
    max: z.number(),
    unit: z.string().min(1),
    sigFigs: z.number().int().positive().default(3),
  })
  .refine((v) => v.min < v.max, { message: "min must be less than max", path: ["min"] });

/**
 * A minimal constraint language (no `eval`): compares a sampled symbol
 * against either a literal or another sampled symbol. Enough to reject
 * unphysical combinations (`m > 0`, `v < c`) without a general expression
 * evaluator in the schema layer.
 */
export const ConstraintSchema = z.object({
  op: z.enum(["gt", "gte", "lt", "lte", "neq"]),
  left: z.string().min(1),
  right: z.union([z.number(), z.string().min(1)]),
});

export const ProblemTemplateSchema = z
  .object({
    id: z.string().min(1),
    formulaId: z.string().min(1),
    variables: z.array(VariableRangeSchema).min(1),
    constraints: z.array(ConstraintSchema).default([]),
    solveFor: z.string().min(1),
  })
  .superRefine((template, ctx) => {
    const symbolNames = new Set(template.variables.map((v) => v.symbol));
    if (symbolNames.has(template.solveFor)) {
      ctx.addIssue({
        code: "custom",
        path: ["solveFor"],
        message: `solveFor "${template.solveFor}" must not be one of the sampled variables`,
      });
    }
    for (const constraint of template.constraints) {
      if (!symbolNames.has(constraint.left)) {
        ctx.addIssue({
          code: "custom",
          path: ["constraints"],
          message: `constraint references undeclared variable "${constraint.left}"`,
        });
      }
      if (typeof constraint.right === "string" && !symbolNames.has(constraint.right)) {
        ctx.addIssue({
          code: "custom",
          path: ["constraints"],
          message: `constraint references undeclared variable "${constraint.right}"`,
        });
      }
    }
  });

export type VariableRange = z.infer<typeof VariableRangeSchema>;
export type Constraint = z.infer<typeof ConstraintSchema>;
export type ProblemTemplate = z.infer<typeof ProblemTemplateSchema>;
