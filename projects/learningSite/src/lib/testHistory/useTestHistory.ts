"use client";

import { useSyncExternalStore } from "react";
import { readTestHistory, STORAGE_KEY } from "./store";
import type { TestHistory } from "./schema";

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// Same cache-by-raw-string trick as useJournal/useNotes/useProgress —
// useSyncExternalStore needs the same reference back until the store
// actually changes, and readTestHistory() re-parses JSON on every call.
let cachedRaw: string | null | undefined;
let cachedHistory: TestHistory | undefined;

function getSnapshot(): TestHistory {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw || cachedHistory === undefined) {
    cachedRaw = raw;
    cachedHistory = readTestHistory();
  }
  return cachedHistory;
}

// Server has no localStorage — render nothing history-dependent until the
// client snapshot resolves, rather than guessing and risking a hydration
// mismatch.
function getServerSnapshot(): null {
  return null;
}

export function useTestHistory(): TestHistory | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
