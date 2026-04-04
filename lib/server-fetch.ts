import { cookies, headers } from "next/headers";

/**
 * Forward session cookie to internal API routes from Server Components.
 *
 * Uses the **current request** host (x-forwarded-host / host + proto), not
 * NEXT_PUBLIC_APP_URL. On Vercel, if NEXT_PUBLIC_APP_URL was missing or still
 * `localhost`, fetches defaulted to http://localhost:3000 and never hit your
 * deployment — session cookies looked "dead" after login.
 */
export async function fetchWithSession(path: string, init?: RequestInit) {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = `${proto}://${host}`.replace(/\/$/, "");

  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return fetch(`${base}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });
}
