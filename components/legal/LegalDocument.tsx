import type { LegalDoc } from "@/lib/legal/types";

type Props = {
  doc: LegalDoc;
  contactEmail: string;
};

export function LegalDocument({ doc, contactEmail }: Props) {
  return (
    <article className="max-w-3xl space-y-8 text-ink">
      <header className="space-y-2 border-b border-border pb-6">
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">{doc.title}</h1>
        <p className="text-sm text-muted">
          {doc.effectiveLabel}: {doc.effectiveDate}
        </p>
      </header>

      {doc.sections.map((section, si) => (
        <section key={`${section.title}-${si}`} className="space-y-3">
          {section.title ? (
            <h2 className="font-display text-xl text-ink">{section.title}</h2>
          ) : null}
          {section.paragraphs.map((p, pi) => (
            <p key={`${si}-p-${pi}`} className="text-[15px] leading-relaxed text-ink/90">
              {p}
            </p>
          ))}
          {section.bullets && section.bullets.length > 0 ? (
            <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink/90">
              {section.bullets.map((item, bi) => (
                <li key={`${si}-b-${bi}`}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.closingParagraphs?.map((p, pi) => (
            <p key={`${si}-c-${pi}`} className="text-[15px] leading-relaxed text-ink/90">
              {p}
            </p>
          ))}
        </section>
      ))}

      <section className="space-y-3 border-t border-border pt-6">
        <h2 className="font-display text-xl text-ink">{doc.contactTitle}</h2>
        <p className="text-[15px] leading-relaxed text-ink/90">
          {doc.contactBeforeEmail}{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="text-accent underline-offset-2 hover:underline focus-visible:focus-ring rounded-sm"
          >
            {contactEmail}
          </a>
        </p>
      </section>
    </article>
  );
}
