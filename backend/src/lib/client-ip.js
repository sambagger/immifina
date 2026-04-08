export function getClientIp(req) {
  const vercel = req.headers["x-vercel-forwarded-for"];
  if (vercel) {
    const first = vercel.split(",")[0]?.trim();
    if (first) return first;
  }
  const xff = req.headers["x-forwarded-for"];
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers["x-real-ip"];
  if (realIp?.trim()) return realIp.trim();
  return req.ip ?? "unknown";
}
