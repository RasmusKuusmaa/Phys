"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";

export type ProviderFlags = {
  password: boolean;
  email: boolean;
  google: boolean;
  github: boolean;
};

export function SignInForm({
  locale,
  strings,
  providers,
  magicLinkAlreadySent,
}: {
  locale: Locale;
  strings: Messages["auth"];
  providers: ProviderFlags;
  magicLinkAlreadySent: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(magicLinkAlreadySent);
  const [busy, setBusy] = useState(false);

  async function submitPassword(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await signIn("password", { email, password, redirect: false });
    setBusy(false);
    // A failed credentials sign-in never says *which* part was wrong —
    // distinguishing "no such account" from "wrong password" would confirm
    // which addresses are registered.
    if (result?.error) setError(strings.invalidCredentials);
    else window.location.href = `/${locale}/account`;
  }

  async function sendMagicLink() {
    if (!email) return;
    setBusy(true);
    setError(null);
    await signIn("nodemailer", { email, redirect: false });
    setBusy(false);
    setSent(true);
  }

  return (
    <div className="mt-8 space-y-6">
      {sent && (
        <p className="rounded-xl border border-accent bg-accent/10 px-4 py-3 text-sm">
          {strings.magicLinkSent}
        </p>
      )}

      <form onSubmit={submitPassword} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-muted">
            {strings.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium text-muted">
            {strings.passwordLabel}
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-[var(--level-l3)]">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white enabled:hover:bg-accent-hover disabled:opacity-50"
        >
          {strings.submitSignIn}
        </button>
      </form>

      {(providers.email || providers.google || providers.github) && (
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-border" />
          {strings.orDivider}
          <span className="h-px flex-1 bg-border" />
        </div>
      )}

      <div className="space-y-2">
        {providers.email && (
          <button
            type="button"
            onClick={sendMagicLink}
            disabled={busy || !email}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm enabled:hover:border-accent disabled:opacity-50"
          >
            {strings.magicLinkButton}
          </button>
        )}
        {providers.google && (
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: `/${locale}/account` })}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm hover:border-accent"
          >
            {strings.continueWithGoogle}
          </button>
        )}
        {providers.github && (
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: `/${locale}/account` })}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm hover:border-accent"
          >
            {strings.continueWithGitHub}
          </button>
        )}
      </div>

      <p className="text-sm text-muted">
        {strings.needAccount}{" "}
        <Link href={`/${locale}/register`} className="underline hover:text-foreground">
          {strings.register}
        </Link>
      </p>
    </div>
  );
}
