"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/locales";

/**
 * Swaps only the leading /en or /et segment. Once concept pages have
 * per-locale slugs (Phase 8), this needs a slug translation lookup instead
 * of a bare prefix swap.
 */
function withLocale(pathname: string, locale: Locale): string {
  const rest = pathname.split("/").slice(2).join("/");
  return `/${locale}${rest ? `/${rest}` : ""}`;
}

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Language" className="flex gap-2 text-sm">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={withLocale(pathname, locale)}
          hrefLang={locale}
          aria-current={locale === currentLocale ? "true" : undefined}
          className={
            locale === currentLocale
              ? "font-semibold underline"
              : "text-muted hover:text-foreground"
          }
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
