import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return new TextEncoder().encode("dev-only-change-me-in-env");
  }
  return new TextEncoder().encode(secret);
}

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session");

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuth = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  if (isProtected) {
    if (!session?.value) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      await jwtVerify(session.value, getSecretKey());
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isAuth && session?.value) {
    try {
      await jwtVerify(session.value, getSecretKey());
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
