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
