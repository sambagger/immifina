import DOMPurify from "isomorphic-dompurify";

export function sanitizeString(input: string): string {
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

export function sanitizeNumber(input: unknown): number {
  const num = Number(input);
  if (isNaN(num) || !isFinite(num)) throw new Error("Invalid number");
  return Math.max(0, Math.min(num, 999999999));
}
