"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress/useProgress";
import { writeProgress } from "@/lib/progress/store";
import { createEmptyProgress } from "@/lib/progress/schema";
import { encodeProgressCode, decodeProgressCode } from "@/lib/progress/code";

export function ProgressManager() {
  const progress = useProgress();
  const [copied, setCopied] = useState(false);
  const [importValue, setImportValue] = useState("");
  const [importState, setImportState] = useState<"idle" | "error" | "success">("idle");
  const [confirmingClear, setConfirmingClear] = useState(false);

  if (progress === null) return null;

  const code = encodeProgressCode(progress);

  function handleImportChange(value: string) {
    setImportValue(value);
    setImportState("idle");
  }

  function handleImport() {
    const decoded = decodeProgressCode(importValue);
    if (!decoded) {
      setImportState("error");
      return;
    }
    writeProgress(decoded);
    setImportState("success");
    setImportValue("");
  }

  function handleClear() {
    writeProgress(createEmptyProgress());
    setConfirmingClear(false);
  }

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

      <h2 className="mt-10 text-xl font-semibold">Import</h2>
      <p className="mt-2 text-sm text-muted">
        Paste a code exported from another browser to replace your progress here with it.
      </p>
      <textarea
        value={importValue}
        onChange={(e) => handleImportChange(e.target.value)}
        rows={3}
        placeholder="Paste code here"
        aria-label="Progress import code"
        className="mt-3 w-full rounded-lg border border-border p-2 font-mono text-xs"
      />
      <button
        type="button"
        onClick={handleImport}
        disabled={importValue.trim().length === 0}
        className="mt-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        Import
      </button>
      {importState === "error" && (
        <p className="mt-2 text-sm text-red-600">
          That code isn&rsquo;t valid — check you copied it in full.
        </p>
      )}
      {importState === "success" && <p className="mt-2 text-sm text-emerald-600">Progress imported.</p>}

      <h2 className="mt-10 text-xl font-semibold">Clear</h2>
      <p className="mt-2 text-sm text-muted">Permanently erase all progress stored in this browser.</p>
      {confirmingClear ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <span>Clear all progress? This can&rsquo;t be undone.</span>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-red-600 px-3 py-1.5 text-red-600 hover:bg-red-600 hover:text-white"
          >
            Yes, clear it
          </button>
          <button
            type="button"
            onClick={() => setConfirmingClear(false)}
            className="rounded-lg border border-border px-3 py-1.5 hover:border-accent"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmingClear(true)}
          className="mt-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:border-accent"
        >
          Clear progress
        </button>
      )}
    </section>
  );
}
