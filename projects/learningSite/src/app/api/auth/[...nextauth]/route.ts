import { handlers } from "@/auth";

export const { GET, POST } = handlers;

// bcrypt and `pg` are Node-only, and this route is inherently per-request.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
