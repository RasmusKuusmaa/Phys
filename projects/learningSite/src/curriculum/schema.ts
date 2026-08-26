import { z } from "zod";

/**
 * Runtime validation for the generated `content/curriculum/` dataset,
 * mirroring `types.ts`. `npm run curriculum:build` is the only writer of
 * this data, but it's still read the same way every other content
 * directory is (`loadContentDir`/`loadJsonArrayFile`) so a shape drift
 * between the generator and a reader fails loudly instead of silently.
 */

export const LocalisedNameSchema = z.object({
  et: z.string(),
  en: z.string(),
});

export const CourseStatusSchema = z.enum([
  "mandatory-all",
  "mandatory",
  "elective",
  "minor-only",
  "not-in-track",
]);

export const ModuleSchema = z.object({
  number: z.string(),
  group: z.string(),
  name: LocalisedNameSchema,
  requirementEt: z.string().nullable(),
  requirement: z.enum(["mandatory", "elective", "minor-only"]),
  track: z.enum(["physics", "chemistry", "materials-science", "all"]).nullable(),
  minorOnly: z.boolean(),
  eap: z.number().nullable(),
  courseCodes: z.array(z.string()),
});

export const CourseTopicSchema = z.object({
  title: z.string(),
  hours: z.string().nullable(),
  keywords: z.string(),
});

export const CourseSchema = z.object({
  code: z.string(),
  name: LocalisedNameSchema,
  eap: z.number().nullable(),
  modules: z.array(z.string()),
  status: z.object({
    physics: CourseStatusSchema,
    chemistry: CourseStatusSchema,
    "materials-science": CourseStatusSchema,
  }),
  prerequisiteCodes: z.array(z.string()),
  aims: z.string(),
  outcomes: z.array(z.string()),
  summary: z.string(),
  topics: z.array(CourseTopicSchema),
  conceptIds: z.array(z.string()),
  sourceFiles: z.array(z.string()),
  hasSyllabus: z.boolean(),
});
