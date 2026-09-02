import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { isLocale, locales } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { LocaleSwitcher, LocaleSwitcherFallback } from "@/components/LocaleSwitcher";
import { SubjectSwitcher } from "@/components/SubjectSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeaderSearch } from "@/components/HeaderSearch";
import { NotesNavLink } from "@/components/notes/NotesNavLink";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AuthNav } from "@/components/auth/AuthNav";
import { listSubjects } from "@/content/loader";
import { getSiteUrl } from "@/lib/siteUrl";
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
    // Lets every relative URL in `alternates`/`openGraph` etc. — here and in
    // every route below this layout — resolve to a fully-qualified one.
    // Lighthouse's hreflang audit requires absolute hrefs; a bare "/en"
    // fails it even though browsers and crawlers both resolve it correctly.
    metadataBase: new URL(getSiteUrl()),
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
        {/* Runs before hydration so a stored dark/light choice applies
            before first paint, avoiding a flash of the wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}`,
          }}
        />
        <a href="#main-content" className="skip-link">
          {dict.a11y.skipToContent}
        </a>
        <AuthProvider>
          <header className="border-b border-border">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-2 px-4 py-4">
              <span className="text-lg font-semibold">{dict.site.name}</span>
              <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {subjects.length > 0 && <SubjectSwitcher subjects={subjects} locale={locale} />}
                <HeaderSearch locale={locale} placeholder={dict.search.placeholder} />
                <Link href={`/${locale}/roadmap`} className="text-muted hover:text-foreground">
                  {dict.nav.roadmap}
                </Link>
                <Link href={`/${locale}/curriculum`} className="text-muted hover:text-foreground">
                  {dict.nav.curriculum}
                </Link>
                <Link href={`/${locale}/formulas`} className="text-muted hover:text-foreground">
                  {dict.nav.formulas}
                </Link>
                <Link href={`/${locale}/glossary`} className="text-muted hover:text-foreground">
                  {dict.nav.glossary}
                </Link>
                <Link href={`/${locale}/periodic-table`} className="text-muted hover:text-foreground">
                  {dict.nav.periodicTable}
                </Link>
                <Link href={`/${locale}/practice`} className="text-muted hover:text-foreground">
                  {dict.nav.practice}
                </Link>
                <Link href={`/${locale}/progress`} className="text-muted hover:text-foreground">
                  {dict.nav.progress}
                </Link>
                <Link href={`/${locale}/journal`} className="text-muted hover:text-foreground">
                  {dict.nav.journal}
                </Link>
                <NotesNavLink href={`/${locale}/notes`} label={dict.nav.notes} />
                <AuthNav locale={locale} strings={dict.auth} />
                <Suspense fallback={<LocaleSwitcherFallback currentLocale={locale} />}>
                  <LocaleSwitcher currentLocale={locale} />
                </Suspense>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <footer className="border-t border-border">
            <div className="mx-auto max-w-5xl px-4 py-4 text-sm text-muted">
              {dict.footer.builtWith}
            </div>
          </footer>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
