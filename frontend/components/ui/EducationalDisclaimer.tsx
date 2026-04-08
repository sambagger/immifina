import { useTranslations } from "next-intl";

export type EducationalDisclaimerTopic =
  | "general"
  | "credit"
  | "tax"
  | "benefits"
  | "banking"
  | "remittance"
  | "legal";

type Props = {
  topic?: EducationalDisclaimerTopic;
  className?: string;
};

export function EducationalDisclaimer({ topic = "general", className = "" }: Props) {
  const t = useTranslations("disclaimer");
  return (
    <blockquote
      className={`rounded-control border border-white/10 bg-white/[0.04] p-4 text-sm text-zinc-400 ${className}`}
    >
      {t(topic)}
    </blockquote>
  );
}
