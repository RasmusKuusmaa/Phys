"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getSnapshot(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "dark" || stored === "light" ? stored : systemTheme();
}

// Server has no localStorage/matchMedia — render nothing until the client
// snapshot resolves, rather than guessing and risking a hydration mismatch.
function getServerSnapshot(): null {
  return null;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = (theme ?? systemTheme()) === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
    // The native "storage" event only fires in *other* tabs, so this tab's
    // useSyncExternalStore needs a manual nudge to re-read the snapshot.
    window.dispatchEvent(new Event("storage"));
  }

  if (theme === null) return null;

  return (
    <button type="button" onClick={toggle} className="text-muted hover:text-foreground">
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
