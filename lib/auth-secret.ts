/**
 * Shared secret for JWT session cookies (middleware + API routes).
 * Must match in both places or login "works" but protected routes reject the token.
 */
export function getAuthSecretBytes(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET is required in production");
    }
    return new TextEncoder().encode("dev-only-change-me-in-env");
  }
  return new TextEncoder().encode(secret);
}
