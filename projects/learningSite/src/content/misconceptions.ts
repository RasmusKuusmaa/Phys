import path from "node:path";
import { MisconceptionSchema } from "@/schema";
import { CONTENT_ROOT, loadContentDir } from "./loader";

export function loadMisconceptions(subject: string) {
  return loadContentDir(
    path.join(CONTENT_ROOT, subject, "misconceptions"),
    MisconceptionSchema,
  ).map((r) => r.value);
}
