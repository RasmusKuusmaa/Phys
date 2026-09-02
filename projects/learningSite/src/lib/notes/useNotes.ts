"use client";

import { useSyncExternalStore } from "react";
import { readNotebook, STORAGE_KEY } from "./store";
import type { Notebook } from "./schema";

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// useSyncExternalStore needs the same reference back until the store
// actually changes, but readNotebook() re-parses JSON on every call —
// cache by the raw string so an unrelated re-render doesn't hand React a
// new object and trip its "getSnapshot should be cached" loop guard.
// Lazily populated (not at module scope) since this module is also
// evaluated during SSR, where localStorage doesn't exist.
let cachedRaw: string | null | undefined;
let cachedNotebook: Notebook | undefined;

function getSnapshot(): Notebook {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw || cachedNotebook === undefined) {
    cachedRaw = raw;
    cachedNotebook = readNotebook();
  }
  return cachedNotebook;
}

// Server has no localStorage — render nothing notes-dependent until the
// client snapshot resolves, rather than guessing and risking a hydration
// mismatch. Same pattern as useProgress.
function getServerSnapshot(): null {
  return null;
}

export function useNotes(): Notebook | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
