import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerEnv } from "./env";

/**
 * Server-side Route Handlers only. Never import from client components.
 */
export function createServiceClient(): SupabaseClient {
  const env = getSupabaseServerEnv();
  if (!env) {
    throw new Error("Supabase server environment variables are not configured");
  }
  return createClient(env.url, env.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseServerEnv() !== null;
}
