/**
 * Plain-text sanitization for API inputs (names, emails, snippets).
 * We intentionally avoid isomorphic-dompurify + JSDOM — that chain triggers
 * ERR_REQUIRE_ESM (@exodus/bytes / html-encoding-sniffer) on Vercel serverless.
 */
export function sanitizeString(input: string): string {
  let s = input.trim().replace(/\x00/g, "");
  s = s.replace(/<[^>]*>/g, "");
  s = s.replace(/[<>]/g, "");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

export function sanitizeNumber(input: unknown): number {
  const num = Number(input);
  if (isNaN(num) || !isFinite(num)) throw new Error("Invalid number");
  return Math.max(0, Math.min(num, 999999999));
}
