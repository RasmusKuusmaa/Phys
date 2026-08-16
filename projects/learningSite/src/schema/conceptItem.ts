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
