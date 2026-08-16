import { z } from "zod";

/**
 * A common wrong Estonian rendering of a locked term. `correct` is a
 * `GlossaryEntry.id`, not a raw string, so the linter can't drift from the
 * glossary itself.
 */
export const BannedVariantSchema = z.object({
  wrong: z.string().min(1),
  correct: z.string().min(1),
  note: z.string().min(1),
});

export type BannedVariant = z.infer<typeof BannedVariantSchema>;
