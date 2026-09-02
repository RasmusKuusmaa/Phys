import { z } from "zod";

/**
 * Pedagogical groupings, not IUPAC categories — IUPAC only defines a few
 * of these formally. They exist to colour the table the way a textbook
 * does. Elements 109-118 are `unknown`: too few atoms have ever been made
 * to establish their chemistry, and claiming otherwise would be a lie a
 * learner might repeat in an exam.
 */
export const ElementCategorySchema = z.enum([
  "alkali-metal",
  "alkaline-earth-metal",
  "transition-metal",
  "post-transition-metal",
  "metalloid",
  "reactive-nonmetal",
  "noble-gas",
  "lanthanide",
  "actinide",
  "unknown",
]);
export type ElementCategory = z.infer<typeof ElementCategorySchema>;

/**
 * Element names are a fixed international nomenclature, not authored prose,
 * so they use a plain both-locales-required pair rather than
 * `LocalisedString` — there is no English source text that can drift out
 * from under the Estonian, which is the only thing `sourceHash`/`stale`
 * exist to track.
 */
export const ElementNameSchema = z.object({
  en: z.string().min(1),
  et: z.string().min(1),
});

export const ElementSchema = z.object({
  /** Atomic number. Also the element's identity — symbols are unique too, but Z is the ordering. */
  z: z.number().int().min(1).max(118),
  symbol: z.string().min(1).max(3),
  name: ElementNameSchema,
  /** Standard atomic weight, or the mass number of the most stable isotope for elements with no stable form. */
  mass: z.number().positive(),
  category: ElementCategorySchema,
  /**
   * IUPAC group 1-18, or null for the f-block. Lanthanides and actinides
   * sit outside the 18-column grid and are rendered in their own two rows,
   * which is exactly why they have no group number here.
   */
  group: z.number().int().min(1).max(18).nullable(),
  period: z.number().int().min(1).max(7),
  block: z.enum(["s", "p", "d", "f"]),
});
export type Element = z.infer<typeof ElementSchema>;
