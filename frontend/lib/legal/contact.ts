/** Public contact email for legal pages, footer, and mailto links. Override with NEXT_PUBLIC_CONTACT_EMAIL. */
export const DEFAULT_PUBLIC_CONTACT_EMAIL = "info@immifina.org";

export function getContactEmail(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return fromEnv || DEFAULT_PUBLIC_CONTACT_EMAIL;
}
