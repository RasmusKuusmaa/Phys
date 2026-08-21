"use client";

import { useSyncExternalStore } from "react";
import { readProgress, STORAGE_KEY } from "./store";
import type { Progress } from "./schema";

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// useSyncExternalStore requires the same reference back until the store
// actually changes, but readProgress() re-parses JSON on every call —
// cache by the raw string so an unrelated re-render doesn't hand React a
// new object and trigger its "getSnapshot should be cached" loop guard.
// Lazily populated (not at module scope) since this module is also
// evaluated during SSR, where localStorage doesn't exist.
let cachedRaw: string | null | undefined;
let cachedProgress: Progress | undefined;

function getSnapshot(): Progress {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw || cachedProgress === undefined) {
    cachedRaw = raw;
    cachedProgress = readProgress();
  }
  return cachedProgress;
}

// Server has no localStorage — render nothing progress-dependent until the
// client snapshot resolves, rather than guessing and risking a hydration
// mismatch. Same pattern as ThemeToggle.
function getServerSnapshot(): null {
  return null;
}

export function useProgress(): Progress | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
