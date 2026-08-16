import { z } from "zod";

/**
 * Both locales are mandatory — a concept may not exist with only one
 * filled in. `sourceHash` is a hash of `en` (the source locale) taken when
 * `et` was last synced; the staleness script recomputes it at build time
 * and flips `stale` when `en` has since drifted without `et` following.
 */
export const LocalisedStringSchema = z.object({
  en: z.string().min(1, "English text is required"),
  et: z.string().min(1, "Estonian text is required"),
  sourceHash: z.string(),
  stale: z.boolean().default(false),
});

export type LocalisedString = z.infer<typeof LocalisedStringSchema>;
