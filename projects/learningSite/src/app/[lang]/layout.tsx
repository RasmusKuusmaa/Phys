import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SubjectSwitcher } from "@/components/SubjectSwitcher";
import { listSubjects } from "@/content/loader";
import Link from "next/link";
import "../globals.css";

// Estonian needs š/ž/õ, which the base "latin" subset doesn't always cover —
// "latin-ext" is requested on all three so body, mono and display text
// render Estonian correctly rather than silently falling back to a system font.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

// Display face for headings — a serif with real optical-size range, giving
// the reference material a bit of typographic character without pulling in
// a whole second sans-serif family for body text.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.site.name,
    description: dict.home.subheading,
    // Route-level pages (Phase 8 concept pages) must override this with
    // their own path, since alternates here only cover "/[lang]" itself.
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function RootLayout({
  children,
}: LayoutProps<"/[lang]">) {
  const locale = await lang();
  if (!locale || !isLocale(locale)) notFound();
  const dict = await getDictionary();
  const subjects = listSubjects();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <span className="text-lg font-semibold">{dict.site.name}</span>
            <nav className="flex items-center gap-4 text-sm">
              {subjects.length > 0 && <SubjectSwitcher subjects={subjects} locale={locale} />}
              <Link href={`/${locale}/glossary`} className="text-muted hover:text-foreground">
                {dict.nav.glossary}
              </Link>
              <Link href={`/${locale}/practice`} className="text-muted hover:text-foreground">
                {dict.nav.practice}
              </Link>
              <LocaleSwitcher currentLocale={locale} />
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-4 text-sm text-muted">
            {dict.footer.builtWith}
          </div>
        </footer>
      </body>
    </html>
  );
}
