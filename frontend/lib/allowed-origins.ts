/**
 * CORS allowlist for `/api/*`. Override with comma-separated `ALLOWED_ORIGINS` (server env).
 * Defaults include production and local dev.
 */
const DEFAULT_ALLOWED_ORIGINS = [
  "https://immifina.org",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
] as const;

export function parseAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS?.trim();
  if (raw) {
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [...DEFAULT_ALLOWED_ORIGINS];
}

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return parseAllowedOrigins().includes(origin);
}

/** Headers for a credentialed browser request from an allowed origin. */
export function corsHeadersForOrigin(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}
