"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress/useProgress";
import { encodeProgressCode } from "@/lib/progress/code";

export function ProgressManager() {
  const progress = useProgress();
  const [copied, setCopied] = useState(false);

  if (progress === null) return null;

  const code = encodeProgressCode(progress);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Permission denied or unavailable — the textarea below is still
      // there to select and copy manually.
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">Export</h2>
      <p className="mt-2 text-sm text-muted">
        Copy this code to save your progress, or to move it to another browser.
      </p>
      <textarea
        readOnly
        value={code}
        rows={3}
        onFocus={(e) => e.currentTarget.select()}
        aria-label="Progress export code"
        className="mt-3 w-full rounded-lg border border-border p-2 font-mono text-xs"
      />
      <button
        type="button"
        onClick={copyCode}
        className="mt-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent"
      >
        {copied ? "Copied" : "Copy code"}
      </button>
    </section>
  );
}
