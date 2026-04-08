import type { Locale } from "@/i18n/routing";
import type { LegalDoc } from "./types";

const TERMS_EN: LegalDoc = {
  title: "ImmiFina Terms of Service",
  effectiveLabel: "Effective Date",
  effectiveDate: "April 4, 2026",
  sections: [
    {
      title: "1. Overview",
      paragraphs: [
        "ImmiFina provides financial education tools and AI-generated insights to help users better understand their finances. By using our service, you agree to these terms.",
      ],
    },
    {
      title: "2. Not Financial Advice",
      paragraphs: [
        "ImmiFina is not a bank, financial advisor, or legal service.",
        "All content is for educational purposes only and should not be considered financial advice.",
        "You are responsible for your financial decisions.",
      ],
    },
    {
      title: "3. Use of Service",
      paragraphs: ["You agree to:"],
      bullets: [
        "Provide accurate information",
        "Use the platform legally",
        "Not abuse or attempt to exploit the system",
      ],
      closingParagraphs: ["We may suspend accounts that violate these terms."],
    },
    {
      title: "4. Accounts",
      paragraphs: [
        "You are responsible for maintaining the security of your account.",
        "Do not share your login credentials.",
      ],
    },
    {
      title: "5. AI-Generated Content",
      paragraphs: [
        "Our AI provides estimates and general guidance.",
        "We do not guarantee accuracy, completeness, or outcomes.",
      ],
    },
    {
      title: "6. Limitation of Liability",
      paragraphs: ["ImmiFina is not liable for:"],
      bullets: [
        "Financial losses",
        "Decisions made based on platform content",
        "Inaccuracies in projections or suggestions",
      ],
    },
    {
      title: "7. Changes",
      paragraphs: [
        "We may update these terms at any time. Continued use means you accept the updated terms.",
      ],
    },
  ],
  contactTitle: "8. Contact",
  contactBeforeEmail: "For questions, contact:",
};

const TERMS_ES: LegalDoc = {
  title: "Términos del servicio de ImmiFina",
  effectiveLabel: "Fecha de vigencia",
  effectiveDate: "4 de abril de 2026",
  sections: [
    {
      title: "1. Descripción general",
      paragraphs: [
        "ImmiFina ofrece herramientas de educación financiera e información generada por IA para ayudarle a entender mejor sus finanzas. Al usar nuestro servicio, acepta estos términos.",
      ],
    },
    {
      title: "2. No es asesoría financiera",
      paragraphs: [
        "ImmiFina no es un banco, asesor financiero ni servicio legal.",
        "Todo el contenido es solo educativo y no debe considerarse asesoría financiera.",
        "Usted es responsable de sus decisiones financieras.",
      ],
    },
    {
      title: "3. Uso del servicio",
      paragraphs: ["Usted acepta:"],
      bullets: [
        "Proporcionar información veraz",
        "Usar la plataforma de forma legal",
        "No abusar ni intentar explotar el sistema",
      ],
      closingParagraphs: ["Podemos suspender cuentas que incumplan estos términos."],
    },
    {
      title: "4. Cuentas",
      paragraphs: [
        "Usted es responsable de mantener la seguridad de su cuenta.",
        "No comparta sus credenciales de acceso.",
      ],
    },
    {
      title: "5. Contenido generado por IA",
      paragraphs: [
        "Nuestra IA ofrece estimaciones y orientación general.",
        "No garantizamos exactitud, integridad ni resultados.",
      ],
    },
    {
      title: "6. Limitación de responsabilidad",
      paragraphs: ["ImmiFina no se hace responsable de:"],
      bullets: [
        "Pérdidas financieras",
        "Decisiones basadas en el contenido de la plataforma",
        "Inexactitudes en proyecciones o sugerencias",
      ],
    },
    {
      title: "7. Cambios",
      paragraphs: [
        "Podemos actualizar estos términos en cualquier momento. El uso continuado implica la aceptación de los términos actualizados.",
      ],
    },
  ],
  contactTitle: "8. Contacto",
  contactBeforeEmail: "Para preguntas, contacte:",
};

const TERMS_ZH: LegalDoc = {
  title: "ImmiFina 服务条款",
  effectiveLabel: "生效日期",
  effectiveDate: "2026 年 4 月 4 日",
  sections: [
    {
      title: "1. 概述",
      paragraphs: [
        "ImmiFina 提供金融教育工具与由 AI 生成的参考信息，帮助您更好地理解个人财务。使用本服务即表示您同意本条款。",
      ],
    },
    {
      title: "2. 非理财或法律建议",
      paragraphs: [
        "ImmiFina 不是银行、持牌理财顾问或法律服务。",
        "所有内容仅供教育目的，不应被视为理财或投资建议。",
        "您需对自身财务决定负责。",
      ],
    },
    {
      title: "3. 服务使用",
      paragraphs: ["您同意："],
      bullets: ["提供真实信息", "合法使用本平台", "不滥用或试图破坏系统"],
      closingParagraphs: ["若违反本条款，我们可能会暂停相关账户。"],
    },
    {
      title: "4. 账户",
      paragraphs: ["您有责任维护账户安全。", "请勿与他人共享登录凭据。"],
    },
    {
      title: "5. AI 生成内容",
      paragraphs: [
        "我们的 AI 提供估算与一般性说明。",
        "我们不保证内容准确、完整或带来特定结果。",
      ],
    },
    {
      title: "6. 责任限制",
      paragraphs: ["在下列情形下，ImmiFina 不承担责任："],
      bullets: [
        "资金损失",
        "基于平台内容作出的决定",
        "预测或建议中的不准确之处",
      ],
    },
    {
      title: "7. 条款变更",
      paragraphs: ["我们可能随时更新本条款。继续使用即视为接受更新后的条款。"],
    },
  ],
  contactTitle: "8. 联系方式",
  contactBeforeEmail: "如有疑问，请联系：",
};

export const TERMS: Record<Locale, LegalDoc> = {
  en: TERMS_EN,
  es: TERMS_ES,
  zh: TERMS_ZH,
};

export function getTerms(locale: string): LegalDoc {
  return TERMS[locale as Locale] ?? TERMS.en;
}
