import { createClient } from "@supabase/supabase-js";

function trimEnv(value) {
  if (value == null) return undefined;
  const t = value.trim();
  return t.length > 0 ? t : undefined;
}

function getSupabaseEnv() {
  const url = trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = trimEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) return null;
  return { url, key };
}

export function isSupabaseConfigured() {
  return getSupabaseEnv() !== null;
}

export function createServiceClient() {
  const env = getSupabaseEnv();
  if (!env) throw new Error("Supabase environment variables are not configured");
  return createClient(env.url, env.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
