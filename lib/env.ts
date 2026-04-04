/**
 * Vercel / dashboard pastes often include leading/trailing spaces or newlines.
 * Those make env vars "set" but break JWT, Supabase, or URL parsing.
 */
export function trimEnv(value: string | undefined): string | undefined {
  if (value == null) return undefined;
  const t = value.trim();
  return t.length > 0 ? t : undefined;
}

export function getAuthSecretRaw(): string | undefined {
  return trimEnv(process.env.AUTH_SECRET);
}

export function getSupabaseServerEnv(): { url: string; key: string } | null {
  const url = trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = trimEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) return null;
  return { url, key };
}
