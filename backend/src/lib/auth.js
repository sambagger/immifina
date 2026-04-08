import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "session";

function getSecretBytes() {
  const raw = process.env.AUTH_SECRET?.trim();
  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET is required in production");
    }
    return new TextEncoder().encode("dev-only-change-me-in-env");
  }
  return new TextEncoder().encode(raw);
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: "/",
  };
}

export async function signSessionToken(userId) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretBytes());
}

export async function verifySession(req) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretBytes());
    if (typeof payload.userId !== "string") return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export function setSessionCookie(res, token) {
  const opts = getSessionCookieOptions();
  res.cookie(SESSION_COOKIE, token, opts);
}

export function clearSessionCookie(res) {
  res.cookie(SESSION_COOKIE, "", {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });
}

/** Express middleware — attaches session to req or returns 401 */
export async function requireAuth(req, res, next) {
  const session = await verifySession(req);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.session = session;
  next();
}
