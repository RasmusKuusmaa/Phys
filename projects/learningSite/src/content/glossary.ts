import path from "node:path";
import { z } from "zod";
import { GlossaryEntrySchema, BannedVariantSchema } from "@/schema";
import { CONTENT_ROOT, loadJsonArrayFile } from "./loader";

const GLOSSARY_PATH = path.join(CONTENT_ROOT, "terminology", "glossary.json");
const BANNED_VARIANTS_PATH = path.join(
  CONTENT_ROOT,
  "terminology",
  "banned-variants.json",
);

export function loadGlossary() {
  return loadJsonArrayFile(GLOSSARY_PATH, z.array(GlossaryEntrySchema));
}

export function loadBannedVariants() {
  return loadJsonArrayFile(BANNED_VARIANTS_PATH, z.array(BannedVariantSchema));
}
