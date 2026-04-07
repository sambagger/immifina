# Security

## Reporting issues

Please report suspected vulnerabilities privately (do not open a public issue with exploit details until fixed).

## Architecture (short)

- **Sessions:** HTTP-only, signed JWT cookie (`jose`, HS256), `Secure` + `SameSite=Lax` in production (`lib/auth.ts`).
- **Passwords:** bcrypt (cost factor 12); registration enforces complexity via Zod (`lib/validation.ts`).
- **Database:** Server routes use the Supabase **service role** client (`lib/db.ts`), which bypasses Row Level Security. Every query must scope by authenticated `user_id` — do not add routes that trust client-supplied IDs without verifying ownership.
- **Input:** Zod schemas on API bodies; strings additionally passed through `sanitizeString` / `sanitizeNumber` where applicable (`lib/sanitize.ts`).

## CORS / allowed origins

`/api/*` responses include `Access-Control-*` when the request `Origin` is in the allowlist (see `middleware.ts`). Defaults include `https://immifina.org` and `http://localhost:3000`. Override with comma-separated `ALLOWED_ORIGINS` (server env, e.g. in Vercel).

## HTTP headers

`next.config.mjs` sets baseline headers on all routes:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (restricts camera, microphone, geolocation)
- `Strict-Transport-Security` (production only)

A strict **Content-Security-Policy** is not enabled by default (Next.js + inline scripts/styles need careful tuning). Add CSP when you can test thoroughly.

## Rate limiting

Per-IP limits use `getClientIp()` (`lib/client-ip.ts`), preferring `x-vercel-forwarded-for` on Vercel, then `x-forwarded-for`, then `x-real-ip`.

Counters live in **process memory**. On **serverless** (e.g. Vercel), many concurrent instances each apply their own limits, so abuse volume can exceed a single counter’s budget. For strong global limits, use a shared store (e.g. Redis, Upstash) or a managed WAF.

Auth endpoints additionally cap login/register attempts per IP (`RATE_LIMITS.auth` in `lib/rate-limit.ts`).

## Health check

`GET /api/health` returns only `ok` and boolean checks in **production**. Extra fields (`nodeEnv`, `vercel`, `vercelUrl`) are included in **non-production** builds for debugging.

## Dependencies

Run `npm audit` regularly and apply patches. Major framework upgrades need a full regression pass.

## Not implemented (optional hardening)

- CAPTCHA (e.g. Cloudflare Turnstile) on login/register
- Account lockout after failed logins (beyond IP rate limits)
- Global rate limiting via Redis / edge
- CSRF tokens for cookie-authenticated APIs (many flows are mitigated by `SameSite=Lax` + same-site usage)

These are threat-model and product decisions; add them when requirements justify the complexity.
