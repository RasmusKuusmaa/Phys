"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";

const MIN_PASSWORD_LENGTH = 10;

export function RegisterForm({
  locale,
  strings,
}: {
  locale: Locale;
  strings: Messages["auth"];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password, name: name.trim() || undefined }),
    });

    if (!response.ok) {
      setBusy(false);
      setError(strings.registerFailed);
      return;
    }

    // The endpoint answers the same way whether or not the address was
    // already taken, so it can't be used to enumerate accounts. Try to sign
    // in; if the address belonged to someone else, this simply fails and
    // they get the ordinary sign-in error.
    const result = await signIn("password", { email, password, redirect: false });
    setBusy(false);
    if (result?.error) setError(strings.registerMaybeExists);
    else window.location.href = `/${locale}/account`;
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      <div>
        <label htmlFor="name" className="block text-xs font-medium text-muted">
          {strings.nameLabel}
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
      </div>

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
          minLength={MIN_PASSWORD_LENGTH}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-muted">{strings.passwordHint}</p>
      </div>

      {error && <p className="text-sm text-[var(--level-l3)]">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white enabled:hover:bg-accent-hover disabled:opacity-50"
      >
        {strings.submitRegister}
      </button>

      <p className="text-sm text-muted">
        {strings.haveAccount}{" "}
        <Link href={`/${locale}/signin`} className="underline hover:text-foreground">
          {strings.signIn}
        </Link>
      </p>
    </form>
  );
}
