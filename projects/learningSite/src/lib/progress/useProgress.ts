"use client";

import { useSyncExternalStore } from "react";
import { readProgress } from "./store";
import type { Progress } from "./schema";

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// Server has no localStorage — render nothing progress-dependent until the
// client snapshot resolves, rather than guessing and risking a hydration
// mismatch. Same pattern as ThemeToggle.
function getServerSnapshot(): null {
  return null;
}

export function useProgress(): Progress | null {
  return useSyncExternalStore(subscribe, readProgress, getServerSnapshot);
}
