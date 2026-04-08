import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { getAuthSecretBytes } from "./auth-secret";

const SESSION_COOKIE = "session";

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };
}

async function signSessionToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getAuthSecretBytes());
}

/**
 * Set the session cookie on a Route Handler response. Prefer this over
 * `cookies().set` so Set-Cookie is applied reliably on Vercel/serverless.
 */
export async function setSessionCookieOnResponse(response: NextResponse, userId: string) {
  const token = await signSessionToken(userId);
  response.cookies.set(SESSION_COOKIE, token, getSessionCookieOptions());
  return response;
}

/**
 * Build a JSON response with a session cookie. Catches missing AUTH_SECRET in
 * production so the route returns 503 JSON instead of an uncaught 500.
 */
export async function jsonWithSessionCookie(
  body: Record<string, unknown>,
  userId: string,
  init?: { status?: number }
) {
  try {
    const res = NextResponse.json(body, { status: init?.status ?? 200 });
    return await setSessionCookieOnResponse(res, userId);
  } catch (err) {
    console.error("[auth] session signing failed:", err);
    return NextResponse.json(
      {
        error: "AUTH_SECRET is missing or invalid in production",
        code: "AUTH_MISCONFIGURED",
      },
      { status: 503 }
    );
  }
}

export function clearSessionCookieOnResponse(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });
}

export async function verifySession(): Promise<{ userId: string } | null> {
  const cookie = cookies().get(SESSION_COOKIE);
  if (!cookie?.value) return null;

  try {
    const { payload } = await jwtVerify(cookie.value, getAuthSecretBytes());
    const userId = payload.userId;
    if (typeof userId !== "string") return null;
    return { userId };
  } catch {
    return null;
  }
}

