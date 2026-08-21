"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setTheme(stored === "dark" || stored === "light" ? stored : systemTheme());
  }, []);

  function toggle() {
    const next: Theme = (theme ?? systemTheme()) === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  // Avoid rendering a guess before the mount effect resolves the real
  // stored/system value — a wrong label for one frame is worse than none.
  if (theme === null) return null;

  return (
    <button type="button" onClick={toggle} className="text-muted hover:text-foreground">
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
