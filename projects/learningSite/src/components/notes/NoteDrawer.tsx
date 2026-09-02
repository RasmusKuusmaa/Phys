"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Side panel for composing or editing a note without leaving the prose it
 * belongs to. Deliberately not a full focus trap — it's a side panel, not
 * a blocking modal — but it does move focus in, restore it on close, and
 * answer Escape, which is what makes it usable from the keyboard.
 */
export function NoteDrawer({
  title,
  closeLabel,
  onClose,
  children,
}: {
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Captured on mount so focus can go back where it came from — usually the
  // highlight or the selection toolbar that opened this.
  const openerRef = useRef<Element | null>(null);

  useEffect(() => {
    openerRef.current = document.activeElement;
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const opener = openerRef.current;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={title}
      tabIndex={-1}
      className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-border bg-background p-6 shadow-xl outline-none sm:w-[28rem]"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border px-3 py-1 text-sm hover:border-accent"
        >
          {closeLabel}
        </button>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
