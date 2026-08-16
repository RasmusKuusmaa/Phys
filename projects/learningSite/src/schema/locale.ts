import { z } from "zod";
import { locales } from "@/i18n/locales";

/** Derived from the single locale list in `@/i18n/locales` so schema and routing never drift. */
export const LocaleSchema = z.enum(locales);
