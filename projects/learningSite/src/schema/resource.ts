import { z } from "zod";
import { LocaleSchema } from "./locale";

export const ResourceTypeSchema = z.enum([
  "article",
  "video",
  "interactive",
  "paper",
  "book",
]);

/**
 * `locale` makes a Resource single-locale by construction — the EN and ET
 * resource sets for a concept are curated independently, never a
 * translation of one another. Every concept needs at least one Resource
 * per locale, not one Resource with both locales filled in.
 */
export const ResourceSchema = z.object({
  id: z.string().min(1),
  conceptId: z.string().min(1),
  locale: LocaleSchema,
  type: ResourceTypeSchema,
  title: z.string().min(1),
  url: z.url(),
});

export type Resource = z.infer<typeof ResourceSchema>;
