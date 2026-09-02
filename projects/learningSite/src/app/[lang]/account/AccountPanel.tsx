"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import type { Locale } from "@/i18n/locales";
import type { Messages } from "@/i18n/dictionaries";
import { lastSyncedAt, recordSyncTime, syncAll, type SyncState } from "@/lib/sync/client";

export function AccountPanel({
  locale,
  strings,
}: {
  locale: Locale;
  strings: Messages["auth"];
}) {
  const { data: session, status } = useSession();
  const [state, setState] = useState<SyncState>("idle");
  const [syncedAt, setSyncedAt] = useState<string | null>(null);

  const runSync = useCallback(async () => {
    setState("syncing");
    try {
      await syncAll();
      recordSyncTime();
      setSyncedAt(lastSyncedAt());
      setState("synced");
    } catch {
      // Local data is untouched on failure — say so rather than implying
      // work was lost.
      setState("failed");
    }
  }, []);

  // Sync once on arrival, so signing in on a new device pulls everything
  // down without the person having to ask for it.
  const autoSyncedRef = useRef(false);
  useEffect(() => {
    if (status !== "authenticated" || autoSyncedRef.current) return;
    autoSyncedRef.current = true;
    setSyncedAt(lastSyncedAt());
    void runSync();
  }, [status, runSync]);

  if (status === "loading") return null;

  if (!session?.user) {
    return (
      <div className="mt-8">
        <p className="text-sm text-muted">{strings.localOnlyNotice}</p>
        <Link
          href={`/${locale}/signin`}
          className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          {strings.signIn}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-border p-4">
        <p className="text-xs text-muted">{strings.signedInAs}</p>
        <p className="mt-1 font-medium">{session.user.email ?? session.user.name}</p>
      </div>

      <div className="rounded-2xl border border-border p-4">
        <p className="text-sm">{strings.accountIntro}</p>
        <p className="mt-2 text-xs text-muted">
          {state === "syncing"
            ? strings.syncing
            : state === "failed"
              ? strings.syncFailed
              : syncedAt
                ? `${strings.synced}: ${new Date(syncedAt).toLocaleString(locale)}`
                : strings.neverSynced}
        </p>
        <button
          type="button"
          onClick={runSync}
          disabled={state === "syncing"}
          className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white enabled:hover:bg-accent-hover disabled:opacity-50"
        >
          {strings.syncNow}
        </button>
      </div>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: `/${locale}` })}
        className="rounded-lg border border-border px-4 py-2 text-sm hover:border-accent"
      >
        {strings.signOut}
      </button>
    </div>
  );
}
