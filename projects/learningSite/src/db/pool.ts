import { Pool } from "pg";

/**
 * One pool per process, cached on globalThis so Next's dev-mode module
 * reloading doesn't open a new pool (and leak connections) on every edit.
 */
const globalForPool = globalThis as unknown as { fkmPool?: Pool };

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set — the account system needs a Postgres connection.");
  }
  globalForPool.fkmPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    // Managed Postgres (Neon, Vercel, Supabase) terminates TLS with certs
    // the container's trust store doesn't always carry; local Docker has no
    // TLS at all. Opt in explicitly rather than guessing from the URL.
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });
  return globalForPool.fkmPool;
}

/** True when a database is configured at all — lets the app degrade to local-only rather than crash. */
export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
