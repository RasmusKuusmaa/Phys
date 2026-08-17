"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AnswerFormat, Concept, Level, TestMode } from "@/schema";
import { levelOrder } from "@/schema";
import type { Locale } from "@/i18n/locales";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function TestBuilderForm({
  subject,
  concepts,
  locale,
}: {
  subject: string;
  concepts: Concept[];
  locale: Locale;
}) {
  const router = useRouter();
  const [levels, setLevels] = useState<Level[]>([...levelOrder]);
  const [conceptIds, setConceptIds] = useState<string[]>(concepts.map((c) => c.id));
  const [itemCount, setItemCount] = useState(5);
  const [mode, setMode] = useState<TestMode>("mixed");
  const [answerFormat, setAnswerFormat] = useState<AnswerFormat>("multiple-choice");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // Ad-hoc for now — item 8 (encode test config and seed in url) replaces
    // this with a shared codec used by both the builder and the runner.
    const params = new URLSearchParams();
    params.set("subject", subject);
    params.set("levels", levels.join(","));
    params.set("concepts", conceptIds.join(","));
    params.set("count", String(itemCount));
    params.set("mode", mode);
    params.set("format", answerFormat);
    params.set("seed", String(Date.now()));
    router.push(`/${locale}/practice/run?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Levels</legend>
        {levelOrder.map((level) => (
          <label key={level} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={levels.includes(level)}
              onChange={() => setLevels((prev) => toggle(prev, level))}
            />
            {level}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Concepts</legend>
        {concepts.map((concept) => (
          <label key={concept.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={conceptIds.includes(concept.id)}
              onChange={() => setConceptIds((prev) => toggle(prev, concept.id))}
            />
            {concept.title[locale]}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Mode</legend>
        {(["concept", "formula", "mixed"] as const).map((option) => (
          <label key={option} style={{ display: "block" }}>
            <input
              type="radio"
              name="mode"
              checked={mode === option}
              onChange={() => setMode(option)}
            />
            {option}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Answer format</legend>
        {(["multiple-choice", "free-entry"] as const).map((option) => (
          <label key={option} style={{ display: "block" }}>
            <input
              type="radio"
              name="answerFormat"
              checked={answerFormat === option}
              onChange={() => setAnswerFormat(option)}
            />
            {option}
          </label>
        ))}
      </fieldset>

      <label style={{ display: "block" }}>
        Item count
        <input
          type="number"
          min={1}
          value={itemCount}
          onChange={(event) => setItemCount(Math.max(1, Number(event.target.value)))}
        />
      </label>

      <button type="submit" disabled={conceptIds.length === 0 || levels.length === 0}>
        Start
      </button>
    </form>
  );
}
