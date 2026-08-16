import { readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { GlossaryEntrySchema, BannedVariantSchema } from "@/schema";

const TERMINOLOGY_DIR = path.join(process.cwd(), "content", "terminology");
const GLOSSARY_PATH = path.join(TERMINOLOGY_DIR, "glossary.json");
const BANNED_VARIANTS_PATH = path.join(TERMINOLOGY_DIR, "banned-variants.json");

export function loadGlossary() {
  const raw = readFileSync(GLOSSARY_PATH, "utf8");
  return z.array(GlossaryEntrySchema).parse(JSON.parse(raw));
}

export function loadBannedVariants() {
  const raw = readFileSync(BANNED_VARIANTS_PATH, "utf8");
  return z.array(BannedVariantSchema).parse(JSON.parse(raw));
}
