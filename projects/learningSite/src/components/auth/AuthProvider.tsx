"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/**
 * Deliberately given no `session` prop.
 *
 * Passing one would mean calling `auth()` in the root layout, and reading a
 * session on the server opts every route under it out of static rendering —
 * all 600+ prerendered concept pages would become per-request renders. This
 * fetches the session from /api/auth/session after hydration instead, so
 * the content stays static and only the parts that show sign-in state wait.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
