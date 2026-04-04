import { cookies } from "next/headers";

/**
 * Forward session cookie to internal API routes from Server Components.
 */
export async function fetchWithSession(path: string, init?: RequestInit) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
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
