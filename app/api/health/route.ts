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

  return NextResponse.json(
    {
      ok,
      checks: {
        authSecretConfigured,
        supabaseConfigured,
      },
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL === "1",
      /** Hostname Vercel assigns (no secrets). */
      vercelUrl: process.env.VERCEL_URL ?? null,
    },
    { status: ok ? 200 : 503 }
  );
}
