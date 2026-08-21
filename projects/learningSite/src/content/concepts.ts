import path from "node:path";
import { ConceptSchema } from "@/schema";
import { CONTENT_ROOT, loadContentDir, listSubjects } from "./loader";

export function loadConcepts(subject: string) {
  return loadContentDir(
    path.join(CONTENT_ROOT, subject, "concepts"),
    ConceptSchema,
  ).map((r) => r.value);
}

/** Concept ids are unique across subjects (Formula/Misconception/Resource all key off `conceptId` with no subject qualifier), so lookups by id search every subject. */
export function loadAllConcepts() {
  return listSubjects().flatMap((subject) => loadConcepts(subject));
}
