/**
 * Applies `src/db/schema.sql`. Every statement is CREATE ... IF NOT EXISTS,
 * so running it repeatedly is safe and it doubles as the setup step for a
 * fresh database.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { Pool } from "pg";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set. Point it at a Postgres instance and re-run.");
    process.exit(1);
  }

  const sql = readFileSync(path.join(process.cwd(), "src", "db", "schema.sql"), "utf8");
  const pool = new Pool({
    connectionString: url,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await pool.query(sql);
    const { rows } = await pool.query<{ table_name: string }>(
      `select table_name from information_schema.tables
       where table_schema = 'public' order by table_name`,
    );
    console.log(`Schema applied. Tables: ${rows.map((r) => r.table_name).join(", ")}`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
