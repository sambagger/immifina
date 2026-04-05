import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getAuthSecretBytes } from "./lib/auth-secret";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const PROTECTED_ROUTES = [
  "/dashboard",
  "/forecast",
  "/credit",
  "/benefits",
  "/remittance",
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
  // Include `/` explicitly — the negative lookahead pattern can skip the homepage.
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
