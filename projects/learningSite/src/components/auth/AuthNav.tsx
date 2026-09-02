"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";

/**
 * Sign-in state in the header. Renders nothing while the session is still
 * loading rather than flashing "Sign in" at someone who is already signed
 * in — the same reasoning as the notes/progress hooks.
 */
export function AuthNav({ locale, strings }: { locale: Locale; strings: Messages["auth"] }) {
  const { data: session, status } = useSession();
  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <Link href={`/${locale}/signin`} className="text-muted hover:text-foreground">
        {strings.signIn}
      </Link>
    );
  }

  return (
    <Link
      href={`/${locale}/account`}
      className="text-muted hover:text-foreground"
      title={session.user.email ?? undefined}
    >
      {strings.account}
    </Link>
  );
}
