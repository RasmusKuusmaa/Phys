"use client";

import { useEffect, useRef, useState } from "react";
import type { Messages } from "@/i18n/dictionaries";
import { useJournal } from "@/lib/journal/useJournal";
import { setReflection } from "@/lib/journal/store";
import { todayDateString } from "@/lib/journal/date";

export function ReflectionEditor({
  strings,
}: {
  strings: Pick<Messages["journal"], "reflectionLabel" | "reflectionPlaceholder" | "saveReflection">;
}) {
  const journal = useJournal();
  const today = todayDateString();
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  // Seeded once from storage, then the textarea owns the value — otherwise
  // every external journal change (e.g. logging a session) would re-run
  // and stomp on text the person is mid-typing.
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current || journal === null) return;
    seeded.current = true;
    setText(journal.days[today]?.reflection ?? "");
  }, [journal, today]);

  function handleSave() {
    setReflection(today, text);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mt-6">
      <label htmlFor="journal-reflection" className="block text-xs font-medium text-muted">
        {strings.reflectionLabel}
      </label>
      <textarea
        id="journal-reflection"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={strings.reflectionPlaceholder}
        rows={2}
        className="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg border border-border px-3 py-1.5 text-xs hover:border-accent"
        >
          {strings.saveReflection}
        </button>
        {saved && <span className="text-xs text-emerald-600">✓</span>}
      </div>
    </div>
  );
}
