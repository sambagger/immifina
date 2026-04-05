import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/LandingNav";
import { LegalFooter } from "@/components/LegalFooter";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { getContactEmail } from "@/lib/legal/contact";
import { getPrivacy } from "@/lib/legal/privacy";
import { localeFromParam } from "@/lib/locale-route";

type PageProps = { params: { locale: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const doc = getPrivacy(localeFromParam(params.locale));
  return { title: `${doc.title} | ImmiFina` };
}

export default async function PrivacyPage({ params }: PageProps) {
  const doc = getPrivacy(localeFromParam(params.locale));
  const email = getContactEmail();

  return (
    <>
      <LandingNav locale={params.locale} />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
        <LegalDocument doc={doc} contactEmail={email} />
        <div className="mt-8 border-t border-border pt-5">
          <LegalFooter align="left" />
        </div>
      </main>
    </>
  );
}
