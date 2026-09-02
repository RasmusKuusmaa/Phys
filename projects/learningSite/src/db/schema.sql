-- Schema for the account system.
--
-- The four Auth.js tables below are dictated by @auth/pg-adapter: their
-- names and the quoted camelCase columns are what its SQL literally
-- queries, so they are not free to be renamed to match house style.
-- Everything after them is this application's own.
--
-- Ids are TEXT/uuid rather than the SERIAL in Auth.js's published example:
-- Auth.js types user ids as strings throughout, and uuids keep that true
-- end to end instead of relying on Postgres coercing numeric strings.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  -- Null for accounts that only ever sign in by magic link or OAuth. A row
  -- with no hash must never be allowed to pass password sign-in.
  password_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
  UNIQUE (provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" TEXT NOT NULL UNIQUE
);

-- Singular table name, unquoted: that is exactly what the adapter queries.
CREATE TABLE IF NOT EXISTS verification_token (
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- One row per user per kind of synced blob. The stored JSON is the same
-- versioned shape the browser keeps in localStorage, so the server never
-- has to understand notes or progress — it stores and returns them, and
-- the client's migration chain remains the single place that format
-- changes are handled.
CREATE TABLE IF NOT EXISTS user_data (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('notes', 'progress')),
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, kind)
);

CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts ("userId");
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions ("userId");
