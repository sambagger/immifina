export function sanitizeString(input) {
  let s = input.trim().replace(/\x00/g, "");
  s = s.replace(/<[^>]*>/g, "");
  s = s.replace(/[<>]/g, "");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

export function sanitizeNumber(input) {
  const num = Number(input);
  if (isNaN(num) || !isFinite(num)) throw new Error("Invalid number");
  return Math.max(0, Math.min(num, 999999999));
}
