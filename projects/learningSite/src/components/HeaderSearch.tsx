"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/locales";

export function HeaderSearch({ locale, placeholder }: { locale: Locale; placeholder: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(`/${locale}/search${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} role="search">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-40 rounded-lg border border-border bg-transparent px-3 py-1 text-sm text-muted focus:w-56 focus:text-foreground focus:outline-none"
      />
    </form>
  );
}
