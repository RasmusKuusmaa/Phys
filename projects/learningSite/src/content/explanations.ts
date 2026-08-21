import type { ComponentType } from "react";
import type { Locale } from "@/i18n/locales";

type MDXModule = { default: ComponentType };

/**
 * Quick explanations are hand-written MDX per concept per locale, not
 * validated JSON — a missing file just means the section doesn't render,
 * the same graceful-skip as an empty misconceptions or resources list.
 */
export async function loadExplanation(
  subject: string,
  conceptId: string,
  locale: Locale,
): Promise<ComponentType | null> {
  try {
    const mod = (await import(
      `@content/${subject}/explanations/${conceptId}-${locale}.mdx`
    )) as MDXModule;
    return mod.default;
  } catch {
    return null;
  }
}
