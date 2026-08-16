import { z } from "zod";
import { LevelSchema } from "./level";
import { LocalisedStringSchema } from "./localisedString";

/**
 * `subject` is a free-form string, not an enum — the schema is
 * subject-agnostic from day one (physics first, then maths/chemistry/
 * materials in Phase 14). `prerequisites` are language-neutral edges,
 * ordered into a roadmap by topological sort, never hand-sorted.
 */
export const ConceptSchema = z.object({
  id: z.string().min(1),
  subject: z.string().min(1),
  level: LevelSchema,
  module: z.string().min(1),
  title: LocalisedStringSchema,
  summary: LocalisedStringSchema,
  prerequisites: z.array(z.string().min(1)).default([]),
});

export type Concept = z.infer<typeof ConceptSchema>;
