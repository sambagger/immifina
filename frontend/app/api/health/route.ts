import { NextResponse } from "next/server";
import { getAuthSecretRaw } from "@/lib/env";
import { isSupabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Safe diagnostics for Vercel: confirms env presence without exposing values.
 * Open: https://YOUR_DEPLOYMENT.vercel.app/api/health
 */
export async function GET() {
  const authSecretConfigured = Boolean(getAuthSecretRaw());
  const supabaseConfigured = isSupabaseConfigured();

  const ok = authSecretConfigured && supabaseConfigured;

  const payload: Record<string, unknown> = {
    ok,
    checks: {
      authSecretConfigured,
      supabaseConfigured,
    },
  };
  if (process.env.NODE_ENV !== "production") {
    payload.nodeEnv = process.env.NODE_ENV;
    payload.vercel = process.env.VERCEL === "1";
    payload.vercelUrl = process.env.VERCEL_URL ?? null;
  }

  return NextResponse.json(payload, { status: ok ? 200 : 503 });
}
