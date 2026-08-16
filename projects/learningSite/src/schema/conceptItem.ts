import { z } from "zod";
import { LocalisedStringSchema } from "./localisedString";

/** A wrong option names the misconception it represents, so results (Phase 5) can summarise which misconceptions a learner keeps hitting. */
export const ConceptItemOptionSchema = z.object({
  id: z.string().min(1),
  label: LocalisedStringSchema,
  correct: z.boolean(),
  misconceptionId: z.string().min(1).optional(),
});

export const ConceptItemBaseSchema = z.object({
  id: z.string().min(1),
  conceptId: z.string().min(1),
  stem: LocalisedStringSchema,
});

export type ConceptItemOption = z.infer<typeof ConceptItemOptionSchema>;
export type ConceptItemBase = z.infer<typeof ConceptItemBaseSchema>;

export const MultipleChoiceItemSchema = ConceptItemBaseSchema.extend({
  type: z.literal("multiple-choice"),
  options: z.array(ConceptItemOptionSchema).min(2),
}).refine((item) => item.options.filter((o) => o.correct).length === 1, {
  message: "exactly one option must be marked correct",
  path: ["options"],
});

export type MultipleChoiceItem = z.infer<typeof MultipleChoiceItemSchema>;

/**
 * Tests whether a learner can reason about how one quantity responds when
 * another changes by `changeFactor`, given the declared proportionality
 * `relationship` (e.g. doubling `a` at constant `m` doubles `F` — direct).
 * Options are still author-written full strings per the locked
 * `changeFactor` (never interpolated), matching the noun-interpolation
 * policy in DECISIONS.md.
 */
export const ProportionalityItemSchema = ConceptItemBaseSchema.extend({
  type: z.literal("proportionality"),
  relationship: z.enum(["direct", "inverse", "direct-square", "inverse-square"]),
  changeFactor: z.number().positive(),
  options: z.array(ConceptItemOptionSchema).min(2),
}).refine((item) => item.options.filter((o) => o.correct).length === 1, {
  message: "exactly one option must be marked correct",
  path: ["options"],
});

export type ProportionalityItem = z.infer<typeof ProportionalityItemSchema>;
