/**
 * Resolves client-side API URLs to Next.js route handlers under `/api/*`.
 * Callers pass paths like `/auth/login` → `/api/auth/login`.
 *
 * Set `NEXT_PUBLIC_API_ORIGIN` only if the API is on another origin (must allow cookies/CORS).
 */
function apiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withApi = `/api${normalized}`;
  const origin = process.env.NEXT_PUBLIC_API_ORIGIN?.replace(/\/$/, "") ?? "";
  return origin ? `${origin}${withApi}` : withApi;
}

export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}
