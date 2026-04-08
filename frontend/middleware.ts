import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getAuthSecretBytes } from "./lib/auth-secret";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

/** CORS allowlist — keep in middleware (Edge bundle); override with ALLOWED_ORIGINS. */
const DEFAULT_ORIGINS = [
  "https://immifina.org",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
  "http://127.0.0.1:3003",
] as const;

function allowedOriginsList(): string[] {
  const raw = process.env.ALLOWED_ORIGINS?.trim();
  if (raw) {
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [...DEFAULT_ORIGINS];
}

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return allowedOriginsList().includes(origin);
}

function corsHeadersForOrigin(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}

function apiCorsResponse(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");
  if (request.method === "OPTIONS") {
    if (!origin) {
      return new NextResponse(null, { status: 204 });
    }
    if (!isAllowedOrigin(origin)) {
      return new NextResponse(null, { status: 403 });
    }
    const h = corsHeadersForOrigin(origin);
    const headers = new Headers();
    for (const [k, v] of Object.entries(h)) {
      headers.set(k, v);
    }
    return new NextResponse(null, { status: 204, headers });
  }
  if (!origin || !isAllowedOrigin(origin)) {
    return NextResponse.next();
  }
  const res = NextResponse.next();
  const h = corsHeadersForOrigin(origin);
  for (const [k, v] of Object.entries(h)) {
    res.headers.set(k, v);
  }
  return res;
}

const PROTECTED_ROUTES = [
  "/dashboard",
  "/forecast",
  "/paycheck",
  "/credit",
  "/benefits",
  "/banking",
  "/remittance",
  "/resources",
  "/chat",
  "/settings",
];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

/** Logged-in users only; same session check as dashboard. */
const ONBOARDING_ROUTE = "/onboarding";

/** next-intl may use /en/... internally; `startsWith("/dashboard")` fails for "/en/dashboard". */
function withoutLocalePrefix(pathname: string): string {
  for (const loc of routing.locales) {
    const prefix = `/${loc}`;
    if (pathname === prefix) return "/";
    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || "/";
    }
  }
  return pathname;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return apiCorsResponse(request);
  }

  const path = withoutLocalePrefix(pathname);
  const session = request.cookies.get("session");

  const isProtected = PROTECTED_ROUTES.some((r) => path.startsWith(r));
  const isOnboarding = path === ONBOARDING_ROUTE || path.startsWith(`${ONBOARDING_ROUTE}/`);
  const isAuth = AUTH_ROUTES.some((r) => path.startsWith(r));

  if (isProtected || isOnboarding) {
    if (!session?.value) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    let secretKey: Uint8Array;
    try {
      secretKey = getAuthSecretBytes();
    } catch {
      return new NextResponse("Server misconfiguration: AUTH_SECRET", { status: 500 });
    }
    try {
      await jwtVerify(session.value, secretKey);
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isAuth && session?.value) {
    let secretKey: Uint8Array;
    try {
      secretKey = getAuthSecretBytes();
    } catch {
      return new NextResponse("Server misconfiguration: AUTH_SECRET", { status: 500 });
    }
    try {
      await jwtVerify(session.value, secretKey);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch {
      /* invalid session — allow auth pages */
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Align with next-intl docs: exclude `_next`, `_vercel`, and paths with a file extension.
  // Do not exclude `api` — we handle `/api/*` first (CORS), then `NextResponse.next()`.
  matcher: ["/", "/((?!_next|_vercel|.*\\..*).*)"],
};
