"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const TIMER_KEY = "journalTimerStartedAt";

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/** Reads a persisted start time, so a reload or an accidental tab close during a study block doesn't lose the elapsed time. */
function getSnapshot(): number | null {
  try {
    const raw = localStorage.getItem(TIMER_KEY);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

// Server has no localStorage, and no timer can be running before the page
// has hydrated — "not running" is the correct answer here, not a guess.
function getServerSnapshot(): null {
  return null;
}

/**
 * A start/stop stopwatch for one study block, running independently of the
 * entry form's fields — starting the timer doesn't require a topic to
 * already be picked, since often you start studying before deciding how
 * to log it.
 *
 * `startedAt` comes from `useSyncExternalStore` reading `localStorage`
 * directly (same pattern as `useNotes`/`useProgress`) rather than mirroring
 * it into `useState`, so there's no synchronous setState-in-effect to read
 * it on mount.
 */
export function useStudyTimer() {
  const startedAt = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Ticks once a second so the displayed elapsed time advances; the actual
  // elapsed value is computed from `startedAt` and `now` during render, not
  // stored redundantly.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (startedAt === null) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const start = useCallback(() => {
    const started = Date.now();
    try {
      localStorage.setItem(TIMER_KEY, String(started));
    } catch {
      // Private-mode or blocked storage — the timer still runs for this
      // page life, it just won't survive a reload.
    }
    // The native "storage" event only fires in *other* tabs — nudge this
    // one's useSyncExternalStore subscribers manually, same trick as every
    // other store in the app.
    window.dispatchEvent(new Event("storage"));
  }, []);

  /** Stops the timer and returns the whole minutes elapsed, rounding up so a 40-second check doesn't log as zero. */
  const stop = useCallback((): number => {
    const minutes = startedAt === null ? 0 : Math.max(1, Math.ceil((Date.now() - startedAt) / 60000));
    try {
      localStorage.removeItem(TIMER_KEY);
    } catch {
      // Nothing to clean up if storage was never reachable.
    }
    window.dispatchEvent(new Event("storage"));
    return minutes;
  }, [startedAt]);

  const elapsedSeconds = startedAt === null ? 0 : Math.floor((now - startedAt) / 1000);

  return { running: startedAt !== null, elapsedSeconds, start, stop };
}
