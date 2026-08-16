import { z } from "zod";

/**
 * A locked EN<->ET term pair. `source` cites where the Estonian rendering
 * was verified (e.g. an EKI Sõnaveeb entry) — Estonian physics terminology
 * is established and not derivable from English, so every entry needs a
 * citation rather than a guessed translation.
 */
export const GlossaryEntrySchema = z.object({
  id: z.string().min(1),
  en: z.string().min(1),
  et: z.string().min(1),
  domain: z.string().min(1),
  source: z.url(),
});

export type GlossaryEntry = z.infer<typeof GlossaryEntrySchema>;
