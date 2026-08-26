import path from "node:path";
import { z } from "zod";
import { CONTENT_ROOT, loadContentDir, loadJsonArrayFile } from "@/content/loader";
import { CourseSchema, ModuleSchema } from "./schema";
import type { Course, Module } from "./types";

const CURRICULUM_ROOT = path.join(CONTENT_ROOT, "curriculum");

export function loadModules(): Module[] {
  return loadJsonArrayFile(path.join(CURRICULUM_ROOT, "modules.json"), z.array(ModuleSchema));
}

export function loadCourses(): Course[] {
  return loadContentDir(path.join(CURRICULUM_ROOT, "courses"), CourseSchema).map((r) => r.value);
}

/** Every course whose mapping in `src/curriculum/mapping.ts` names this concept. */
export function coursesForConcept(conceptId: string, courses: Course[]): Course[] {
  return courses.filter((c) => c.conceptIds.includes(conceptId));
}

/**
 * `praktikum`/laboratory courses teach bench skills a static site can't
 * deliver. A course mapped to concepts here has its *theory* covered, never
 * the bench work — see `content/curriculum/README.md` for the exact
 * definition. Detected by name rather than a stored flag since the raw
 * scrape doesn't carry a structured course-type field.
 */
export function isPracticalCourse(course: Course): boolean {
  return /praktikum/i.test(course.name.et) || /practical|laboratory/i.test(course.name.en);
}
