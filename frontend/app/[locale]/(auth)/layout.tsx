import { AuthLandingChrome } from "@/components/auth/AuthLandingChrome";

/** Skip static-path prerender for auth routes (avoids dev worker chunk resolution issues with next-intl). */
export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthLandingChrome>{children}</AuthLandingChrome>;
}
