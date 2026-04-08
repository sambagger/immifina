export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  /** Rendered after bullets, same section (e.g. closing note). */
  closingParagraphs?: string[];
};

export type LegalDoc = {
  title: string;
  effectiveLabel: string;
  effectiveDate: string;
  sections: LegalSection[];
  contactTitle: string;
  contactBeforeEmail: string;
};
