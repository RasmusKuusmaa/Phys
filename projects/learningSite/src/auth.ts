import NextAuth, { type NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import PostgresAdapter from "@auth/pg-adapter";
import Credentials from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getPool, hasDatabase } from "@/db/pool";

/**
 * A bcrypt hash of nothing in particular. Sign-in compares against this
 * when no user row matches, so a request for an unregistered address costs
 * the same time as one for a registered address — otherwise the response
 * latency alone tells an attacker which emails have accounts.
 */
const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEe.b1nJ0PQPTfyDDDDDDDDDDDDDDDDDDDD";

export const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/** Registration is stricter than sign-in: sign-in only needs to compare what was typed. */
export const RegistrationSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(10).max(200),
  name: z.string().trim().max(100).optional(),
});

function buildProviders(): Provider[] {
  const providers: Provider[] = [
    Credentials({
      id: "password",
      name: "Password",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(raw) {
        const parsed = CredentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const { rows } = await getPool().query<{
          id: string;
          name: string | null;
          email: string;
          image: string | null;
          password_hash: string | null;
        }>(
          `select id, name, email, image, password_hash from users where lower(email) = lower($1)`,
          [email],
        );
        const user = rows[0];

        // Always spend the compare, even with no user and no hash — see
        // DUMMY_HASH. Never branch out early on "user not found".
        const ok = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
        if (!ok || !user?.password_hash) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ];

  // Each optional provider is registered only when fully configured, so a
  // deployment without OAuth keys still boots instead of throwing at import.
  if (process.env.AUTH_EMAIL_SERVER && process.env.AUTH_EMAIL_FROM) {
    providers.push(
      Nodemailer({
        server: process.env.AUTH_EMAIL_SERVER,
        from: process.env.AUTH_EMAIL_FROM,
      }),
    );
  }
  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    providers.push(
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    );
  }
  if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
    providers.push(
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      }),
    );
  }

  return providers;
}

/** Which sign-in methods this deployment actually offers — the UI renders from this rather than hard-coding buttons for providers that aren't configured. */
export function enabledProviders() {
  return {
    password: true,
    email: Boolean(process.env.AUTH_EMAIL_SERVER && process.env.AUTH_EMAIL_FROM),
    google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
    github: Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET),
  };
}

export const authConfig: NextAuthConfig = {
  // Deferred behind hasDatabase(): PostgresAdapter(getPool()) would throw at
  // import time otherwise, and this module is imported (for enabledProviders,
  // for the API route handlers) even on deployments with no database, where
  // every page that touches accounts is expected to degrade to local-only
  // rather than crash.
  adapter: hasDatabase() ? PostgresAdapter(getPool()) : undefined,
  // JWT, not database sessions: the Credentials provider cannot issue a
  // database session in Auth.js v5. The adapter is still doing real work —
  // it persists users, linked OAuth accounts, and the one-time tokens the
  // magic-link flow verifies against.
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/en/signin", verifyRequest: "/en/signin?sent=1", error: "/en/signin" },
  providers: buildProviders(),
  callbacks: {
    jwt({ token, user }) {
      // Only present on the request that actually signs in; afterwards the
      // id is already in the token.
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
