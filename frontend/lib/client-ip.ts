/**
 * Client IP for rate limiting and logging.
 * On Vercel, prefer `x-vercel-forwarded-for` (single client IP set by the edge).
 * Fall back to the first hop in `x-forwarded-for` (leftmost = original client when chain is trusted).
 */
export function getClientIp(request: Request): string {
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) {
    const first = vercel.split(",")[0]?.trim();
    if (first) return first;
  }
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();
  return "unknown";
}
