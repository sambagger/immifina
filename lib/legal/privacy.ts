import type { Locale } from "@/i18n/routing";
import type { LegalDoc } from "./types";

const PRIVACY_EN: LegalDoc = {
  title: "ImmiFina Privacy Policy",
  effectiveLabel: "Effective Date",
  effectiveDate: "April 4, 2026",
  sections: [
    {
      title: "1. Information We Collect",
      paragraphs: ["We may collect:"],
      bullets: [
        "Name and email",
        "Financial inputs (income, expenses, etc.)",
        "Usage data (interactions with the app)",
      ],
    },
    {
      title: "2. How We Use Information",
      paragraphs: ["We use your data to:"],
      bullets: [
        "Provide financial insights and forecasts",
        "Improve the product",
        "Personalize your experience",
      ],
    },
    {
      title: "3. Data Storage",
      paragraphs: [
        "Data is stored securely using Supabase.",
        "We take reasonable measures to protect your information.",
      ],
    },
    {
      title: "4. Data Sharing",
      paragraphs: [
        "We do not sell your personal data.",
        "We may use third-party services (for example, AI providers) to process data.",
      ],
    },
    {
      title: "5. Your Rights",
      paragraphs: ["You can:"],
      bullets: [
        "Request deletion of your data",
        "Update your information",
        "Stop using the service at any time",
      ],
    },
    {
      title: "6. Cookies",
      paragraphs: [
        "We may use cookies or similar technologies to improve user experience.",
      ],
    },
    {
      title: "7. Changes",
      paragraphs: [
        "We may update this policy. Continued use of the service means you accept the updated policy.",
      ],
    },
  ],
  contactTitle: "8. Contact",
  contactBeforeEmail: "For privacy questions:",
};

const PRIVACY_ES: LegalDoc = {
  title: "Política de privacidad de ImmiFina",
  effectiveLabel: "Fecha de vigencia",
  effectiveDate: "4 de abril de 2026",
  sections: [
    {
      title: "1. Información que recopilamos",
      paragraphs: ["Podemos recopilar:"],
      bullets: [
        "Nombre y correo electrónico",
        "Datos financieros que usted introduce (ingresos, gastos, etc.)",
        "Datos de uso (interacciones con la aplicación)",
      ],
    },
    {
      title: "2. Cómo usamos la información",
      paragraphs: ["Usamos sus datos para:"],
      bullets: [
        "Ofrecer información y proyecciones financieras",
        "Mejorar el producto",
        "Personalizar su experiencia",
      ],
    },
    {
      title: "3. Almacenamiento de datos",
      paragraphs: [
        "Los datos se almacenan de forma segura mediante Supabase.",
        "Aplicamos medidas razonables para proteger su información.",
      ],
    },
    {
      title: "4. Compartición de datos",
      paragraphs: [
        "No vendemos sus datos personales.",
        "Podemos usar servicios de terceros (por ejemplo, proveedores de IA) para procesar datos.",
      ],
    },
    {
      title: "5. Sus derechos",
      paragraphs: ["Usted puede:"],
      bullets: [
        "Solicitar la eliminación de sus datos",
        "Actualizar su información",
        "Dejar de usar el servicio en cualquier momento",
      ],
    },
    {
      title: "6. Cookies",
      paragraphs: [
        "Podemos usar cookies o tecnologías similares para mejorar la experiencia de usuario.",
      ],
    },
    {
      title: "7. Cambios",
      paragraphs: [
        "Podemos actualizar esta política. El uso continuado del servicio implica la aceptación de la política actualizada.",
      ],
    },
  ],
  contactTitle: "8. Contacto",
  contactBeforeEmail: "Para consultas de privacidad:",
};

const PRIVACY_ZH: LegalDoc = {
  title: "ImmiFina 隐私政策",
  effectiveLabel: "生效日期",
  effectiveDate: "2026 年 4 月 4 日",
  sections: [
    {
      title: "1. 我们收集的信息",
      paragraphs: ["我们可能收集："],
      bullets: ["姓名与电子邮箱", "您填写的财务信息（收入、支出等）", "使用数据（与应用的互动）"],
    },
    {
      title: "2. 信息用途",
      paragraphs: ["我们使用您的数据以："],
      bullets: ["提供财务参考与预测", "改进产品", "个性化您的体验"],
    },
    {
      title: "3. 数据存储",
      paragraphs: [
        "数据通过 Supabase 安全存储。",
        "我们采取合理措施保护您的信息。",
      ],
    },
    {
      title: "4. 数据共享",
      paragraphs: [
        "我们不出售您的个人数据。",
        "我们可能使用第三方服务（例如 AI 服务商）处理数据。",
      ],
    },
    {
      title: "5. 您的权利",
      paragraphs: ["您可以："],
      bullets: ["请求删除您的数据", "更新您的信息", "随时停止使用本服务"],
    },
    {
      title: "6. Cookie",
      paragraphs: ["我们可能使用 Cookie 或类似技术以改善使用体验。"],
    },
    {
      title: "7. 政策变更",
      paragraphs: ["我们可能更新本政策。继续使用本服务即视为接受更新后的政策。"],
    },
  ],
  contactTitle: "8. 联系方式",
  contactBeforeEmail: "隐私相关问题请联系：",
};

export const PRIVACY: Record<Locale, LegalDoc> = {
  en: PRIVACY_EN,
  es: PRIVACY_ES,
  zh: PRIVACY_ZH,
};

export function getPrivacy(locale: string): LegalDoc {
  return PRIVACY[locale as Locale] ?? PRIVACY.en;
}
