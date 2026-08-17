import path from "node:path";
import { ConceptItemSchema } from "@/schema";
import { CONTENT_ROOT, loadContentDir } from "./loader";

export function loadConceptItems(subject: string) {
  return loadContentDir(
    path.join(CONTENT_ROOT, subject, "concept-items"),
    ConceptItemSchema,
  ).map((r) => r.value);
}
