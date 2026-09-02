"use client";

import Link from "next/link";
import { useNotes } from "@/lib/notes/useNotes";

/**
 * The notes link, carrying a count once there's anything to see.
 *
 * The header is a long row of equally-weighted links, so a plain "Notes"
 * entry gives no sign that anything is stored behind it. The count is the
 * whole point: it tells you your notes exist and where they live.
 *
 * Renders the bare label until the client snapshot resolves (see
 * `useNotes`) rather than guessing a count and flashing the wrong one.
 */
export function NotesNavLink({ href, label }: { href: string; label: string }) {
  const notebook = useNotes();
  const count = notebook ? Object.keys(notebook.notes).length : 0;

  return (
    <Link href={href} className="flex items-center gap-1.5 text-muted hover:text-foreground">
      {label}
      {count > 0 && (
        <span className="rounded-full bg-accent px-1.5 py-0.5 text-xs leading-none font-medium text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
