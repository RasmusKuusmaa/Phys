"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { locales, type Locale } from "@/i18n/locales";

// The hash isn't exposed by any Next.js navigation hook — it never triggers
// a server request — so it's read straight from the browser. A stable
// module-level subscribe/snapshot pair (rather than one recreated on every
// render) is what `useSyncExternalStore` needs to avoid resubscribing on
// every render; the empty-string server snapshot is what SSR renders before
// hydration, matching `LocaleSwitcherFallback`'s no-hash link.
function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
function getHashSnapshot() {
  return window.location.hash;
}
function getServerHashSnapshot() {
  return "";
}

/**
 * Swaps only the leading /en or /et segment, preserving the query string and
 * `#anchor` (e.g. a practice session's `?concepts=...` or a curriculum deep
 * link's `?track=...#COURSE`) — losing those on a language switch stranded
 * the learner back at a bare, unconfigured page. Once concept pages have
 * per-locale slugs (Phase 8), the path swap itself needs a slug translation
 * lookup instead of a bare prefix swap.
 */
function withLocale(pathname: string, search: string, hash: string, locale: Locale): string {
  const rest = pathname.split("/").slice(2).join("/");
  return `/${locale}${rest ? `/${rest}` : ""}${search}${hash}`;
}

function LocaleLinks({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const hash = useSyncExternalStore(subscribeToHash, getHashSnapshot, getServerHashSnapshot);

  return (
    <>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={withLocale(pathname, search ? `?${search}` : "", hash, locale)}
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
    </>
  );
}

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  return (
    <nav aria-label="Language" className="flex gap-2 text-sm">
      <LocaleLinks currentLocale={currentLocale} />
    </nav>
  );
}

/**
 * `useSearchParams` bails the tree above it to client rendering during
 * static generation unless wrapped in `<Suspense>` — this is that
 * boundary's fallback. Same links, without query/hash preservation, so a
 * viewer who clicks before hydration still lands on the right page.
 */
export function LocaleSwitcherFallback({ currentLocale }: { currentLocale: Locale }) {
  return (
    <nav aria-label="Language" className="flex gap-2 text-sm">
      {locales.map((locale) => (
        <Link
          key={locale}
          // The root layout doesn't know the full request path (only its
          // own [lang] segment) and useSearchParams isn't available without
          // the Suspense boundary this is the fallback for — so this brief,
          // pre-hydration state links to the locale's home page rather than
          // guessing at the current one. LocaleLinks replaces it with the
          // real target within milliseconds once the client renders.
          href={`/${locale}`}
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
