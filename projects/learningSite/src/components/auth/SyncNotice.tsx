"use client";

import { useSession } from "next-auth/react";
import type { Messages } from "@/i18n/dictionaries";

/**
 * Tells a visitor to notes/progress whether what they're about to do syncs
 * anywhere, without the page itself having to read the session (that would
 * opt it out of static rendering — see AuthProvider).
 */
export function SyncNotice({ strings }: { strings: Messages["auth"] }) {
  const { data: session, status } = useSession();
  if (status === "loading") return null;

  return (
    <p className="mt-2 text-sm text-muted">
      {session?.user ? strings.accountIntro : strings.localOnlyNotice}
    </p>
  );
}
