/** Public contact email for legal pages and mailto links. Set NEXT_PUBLIC_CONTACT_EMAIL in production. */
export function getContactEmail(): string {
  return process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@immifina.org";
}
