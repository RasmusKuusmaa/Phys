"use client";

import { useState } from "react";
import type { Concept, Level } from "@/schema";
import { levelOrder } from "@/schema";
import type { Locale } from "@/i18n/locales";
import { ConceptCard } from "@/components/ConceptCard";

export type LevelGroup = {
  level: Level;
  modules: { name: string; concepts: Concept[] }[];
};

export function RoadmapSections({
  groups,
  concepts,
  locale,
}: {
  groups: LevelGroup[];
  concepts: Concept[];
  locale: Locale;
}) {
  const [selectedLevels, setSelectedLevels] = useState<Level[]>([...levelOrder]);
  const conceptById = new Map(concepts.map((c) => [c.id, c]));

  function toggle(level: Level) {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  }

  return (
    <div>
      <fieldset className="mt-6">
        <legend>Levels</legend>
        {levelOrder.map((level) => (
          <label key={level} style={{ display: "inline-block", marginRight: "1rem" }}>
            <input
              type="checkbox"
              checked={selectedLevels.includes(level)}
              onChange={() => toggle(level)}
            />
            {level}
          </label>
        ))}
      </fieldset>

      {groups
        .filter((group) => selectedLevels.includes(group.level))
        .map((group) => (
          <section key={group.level} className="mt-10">
            <h2 className="text-2xl font-semibold">{group.level}</h2>
            {group.modules.map((module) => (
              <div key={module.name} className="mt-6">
                <h3 className="text-lg font-semibold capitalize">{module.name}</h3>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {module.concepts.map((concept) => (
                    <ConceptCard
                      key={concept.id}
                      concept={concept}
                      locale={locale}
                      prerequisites={concept.prerequisites
                        .map((id) => conceptById.get(id))
                        .filter((c): c is Concept => c !== undefined)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
    </div>
  );
}
