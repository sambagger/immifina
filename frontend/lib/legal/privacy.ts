import type { Locale } from "@/i18n/routing";
import type { LegalDoc } from "./types";

const PRIVACY_EN: LegalDoc = {
  title: "ImmiFina Privacy Policy",
  effectiveLabel: "Effective Date",
  effectiveDate: "April 7, 2026",
  sections: [
    {
      title: "1. Information We Collect",
      paragraphs: ["When you use ImmiFina, we collect:"],
      bullets: [
        "Account information: name, email address, and password (stored as a bcrypt hash — we never store your plain-text password)",
        "Financial inputs you provide: monthly income, expenses, savings, debt, household size, and similar figures you enter into the app",
        "Immigration and employment context: status, years in the U.S., country of origin, and primary financial goal — used only to personalize guidance",
        "Conversation history: messages you send to the AI financial guide and the AI's replies",
        "Usage data: pages visited, features used, and error logs to help us improve the product",
        "IP address: used for rate limiting and fraud prevention",
      ],
    },
    {
      title: "2. How We Use Your Information",
      paragraphs: ["We use your data solely to:"],
      bullets: [
        "Provide personalized financial education, forecasts, and AI-powered guidance",
        "Remember your profile so you don't have to re-enter information each session",
        "Send transactional emails: email verification, password resets, and waitlist confirmations",
        "Improve our product through aggregate, anonymized usage analysis",
        "Prevent abuse through rate limiting and security monitoring",
      ],
    },
    {
      title: "3. Third-Party Services We Use",
      paragraphs: [
        "ImmiFina relies on the following trusted third-party services to operate. Each processes data according to their own privacy policies:",
      ],
      bullets: [
        "Supabase (supabase.com) — our database and authentication infrastructure. Your account data and financial profile are stored in a Supabase PostgreSQL database hosted in the United States.",
        "Anthropic (anthropic.com) — powers the ImmiFina AI financial guide via the Claude API. Your conversation messages and financial profile summary are sent to Anthropic to generate responses. Anthropic's usage policies apply.",
        "Resend (resend.com) — used to send transactional emails such as email verification and password reset links.",
        "Vercel (vercel.com) — hosts the ImmiFina web application and serves all pages.",
      ],
    },
    {
      title: "4. Data We Do NOT Collect",
      paragraphs: ["We do not collect or store:"],
      bullets: [
        "Bank account numbers, credit card numbers, or any payment information",
        "Social Security Numbers (SSN) or Individual Taxpayer Identification Numbers (ITIN) — we only ask whether you have one, not what it is",
        "Government-issued ID documents",
        "Real-time financial account data — all financial figures are self-reported by you",
      ],
    },
    {
      title: "5. Data Sharing",
      paragraphs: [
        "We do not sell, rent, or trade your personal data.",
        "We share data only with the third-party services listed in Section 3, strictly to provide the service. We do not share data with advertisers or data brokers.",
        "We may disclose data if required by law or to protect the rights and safety of ImmiFina users.",
      ],
    },
    {
      title: "6. Data Retention",
      paragraphs: [
        "We retain your account data for as long as your account is active. If you request account deletion, we will remove your personal data within 30 days, except where retention is required by law.",
        "Conversation history is retained to provide continuity across sessions. You can start new conversations at any time.",
      ],
    },
    {
      title: "7. Security",
      paragraphs: [
        "Passwords are hashed with bcrypt (cost factor 12) before storage — we cannot read your password.",
        "Sessions use short-lived JWT tokens stored in httpOnly cookies, inaccessible to JavaScript.",
        "All data is transmitted over HTTPS.",
        "Despite these measures, no system is perfectly secure. We cannot guarantee absolute security.",
      ],
    },
    {
      title: "8. Cookies",
      paragraphs: [
        "ImmiFina uses a single session cookie (httpOnly, Secure) to keep you logged in. This cookie is strictly necessary for the service to function and does not track you across other websites.",
        "We do not use analytics cookies, advertising cookies, or third-party tracking pixels.",
      ],
    },
    {
      title: "9. Your Rights",
      paragraphs: ["You have the right to:"],
      bullets: [
        "Access the personal data we hold about you — email info@immifina.org",
        "Correct inaccurate data — update it directly in Settings",
        "Delete your account and associated data — email info@immifina.org",
        "Stop using the service at any time",
      ],
    },
    {
      title: "10. Changes to This Policy",
      paragraphs: [
        "We may update this policy as the product evolves. We will notify registered users of material changes by email. Continued use of the service after changes are posted constitutes acceptance.",
      ],
    },
  ],
  contactTitle: "11. Contact",
  contactBeforeEmail: "For privacy questions or data requests:",
};

const PRIVACY_ES: LegalDoc = {
  title: "Política de privacidad de ImmiFina",
  effectiveLabel: "Fecha de vigencia",
  effectiveDate: "7 de abril de 2026",
  sections: [
    {
      title: "1. Información que recopilamos",
      paragraphs: ["Al usar ImmiFina, recopilamos:"],
      bullets: [
        "Datos de cuenta: nombre, correo electrónico y contraseña (almacenada como hash bcrypt; nunca guardamos su contraseña en texto plano)",
        "Datos financieros que usted introduce: ingresos, gastos, ahorros, deudas, tamaño del hogar y cifras similares",
        "Contexto migratorio y laboral: estatus, años en EE. UU., país de origen y objetivo financiero principal, usados únicamente para personalizar la orientación",
        "Historial de conversaciones con el asistente de IA y sus respuestas",
        "Datos de uso: páginas visitadas, funciones utilizadas y registros de errores para mejorar el producto",
        "Dirección IP: usada para limitar solicitudes y prevenir fraudes",
      ],
    },
    {
      title: "2. Cómo usamos su información",
      paragraphs: ["Usamos sus datos únicamente para:"],
      bullets: [
        "Ofrecer educación financiera personalizada, proyecciones y orientación con IA",
        "Recordar su perfil para no tener que reintroducir datos en cada sesión",
        "Enviar correos transaccionales: verificación de correo, restablecimiento de contraseña y confirmaciones de lista de espera",
        "Mejorar el producto mediante análisis agregados y anonimizados",
        "Prevenir abusos mediante límites de solicitudes y monitoreo de seguridad",
      ],
    },
    {
      title: "3. Servicios de terceros que utilizamos",
      paragraphs: [
        "ImmiFina utiliza los siguientes servicios de terceros para operar. Cada uno procesa datos según sus propias políticas de privacidad:",
      ],
      bullets: [
        "Supabase (supabase.com) — infraestructura de base de datos. Sus datos y perfil financiero se almacenan en una base de datos PostgreSQL alojada en Estados Unidos.",
        "Anthropic (anthropic.com) — impulsa el asistente de IA mediante la API Claude. Sus mensajes y el resumen de su perfil se envían a Anthropic para generar respuestas.",
        "Resend (resend.com) — envío de correos transaccionales como verificación de correo y restablecimiento de contraseña.",
        "Vercel (vercel.com) — aloja la aplicación web de ImmiFina.",
      ],
    },
    {
      title: "4. Datos que NO recopilamos",
      paragraphs: ["No recopilamos ni almacenamos:"],
      bullets: [
        "Números de cuenta bancaria, tarjeta de crédito ni información de pago",
        "Número de Seguro Social (SSN) ni ITIN — solo preguntamos si los tiene, no cuáles son",
        "Documentos de identidad oficiales",
        "Datos financieros en tiempo real — todas las cifras son autodeclaradas por usted",
      ],
    },
    {
      title: "5. Compartición de datos",
      paragraphs: [
        "No vendemos, alquilamos ni cedemos sus datos personales.",
        "Compartimos datos solo con los servicios listados en la Sección 3, estrictamente para prestar el servicio. No compartimos datos con anunciantes ni intermediarios de datos.",
        "Podemos divulgar datos si lo exige la ley o para proteger la seguridad de los usuarios de ImmiFina.",
      ],
    },
    {
      title: "6. Retención de datos",
      paragraphs: [
        "Conservamos sus datos mientras su cuenta esté activa. Si solicita la eliminación, eliminaremos sus datos personales en un plazo de 30 días, salvo que la ley exija conservarlos.",
      ],
    },
    {
      title: "7. Seguridad",
      paragraphs: [
        "Las contraseñas se almacenan con hash bcrypt (factor de costo 12). Las sesiones usan tokens JWT en cookies httpOnly. Todos los datos se transmiten por HTTPS.",
        "Ningún sistema es completamente seguro. No podemos garantizar seguridad absoluta.",
      ],
    },
    {
      title: "8. Cookies",
      paragraphs: [
        "ImmiFina usa una única cookie de sesión (httpOnly, Secure) para mantener la sesión iniciada. No usamos cookies de analítica, publicidad ni rastreo de terceros.",
      ],
    },
    {
      title: "9. Sus derechos",
      paragraphs: ["Usted tiene derecho a:"],
      bullets: [
        "Acceder a sus datos — escriba a info@immifina.org",
        "Corregir datos inexactos — actualícelos en Configuración",
        "Eliminar su cuenta y datos asociados — escriba a info@immifina.org",
        "Dejar de usar el servicio en cualquier momento",
      ],
    },
    {
      title: "10. Cambios en esta política",
      paragraphs: [
        "Podemos actualizar esta política. Notificaremos a los usuarios registrados sobre cambios relevantes por correo electrónico.",
      ],
    },
  ],
  contactTitle: "11. Contacto",
  contactBeforeEmail: "Para consultas de privacidad o solicitudes de datos:",
};

const PRIVACY_ZH: LegalDoc = {
  title: "ImmiFina 隐私政策",
  effectiveLabel: "生效日期",
  effectiveDate: "2026 年 4 月 7 日",
  sections: [
    {
      title: "1. 我们收集的信息",
      paragraphs: ["当您使用 ImmiFina 时，我们收集："],
      bullets: [
        "账户信息：姓名、电子邮箱及密码（以 bcrypt 哈希形式存储，我们不保存明文密码）",
        "您填写的财务数据：月收入、支出、储蓄、债务、家庭人口等",
        "移民与就业背景：身份状态、在美年限、原籍国及主要财务目标，仅用于个性化指导",
        "与 AI 助手的对话记录及 AI 的回复",
        "使用数据：访问页面、功能使用情况及错误日志，用于改进产品",
        "IP 地址：用于请求频率限制和防欺诈",
      ],
    },
    {
      title: "2. 我们如何使用您的信息",
      paragraphs: ["我们仅将您的数据用于："],
      bullets: [
        "提供个性化财务教育、预测及 AI 指导",
        "保存您的个人资料，避免每次重新填写",
        "发送事务性邮件：邮箱验证、密码重置及候补名单确认",
        "通过匿名聚合分析改进产品",
        "通过频率限制和安全监控防止滥用",
      ],
    },
    {
      title: "3. 我们使用的第三方服务",
      paragraphs: [
        "ImmiFina 依赖以下可信第三方服务运营，各方依据自身隐私政策处理数据：",
      ],
      bullets: [
        "Supabase（supabase.com）——数据库基础设施。您的账户数据和财务档案存储在美国托管的 PostgreSQL 数据库中。",
        "Anthropic（anthropic.com）——通过 Claude API 驱动 ImmiFina AI 助手。您的对话消息和财务档案摘要将发送至 Anthropic 以生成回复。",
        "Resend（resend.com）——用于发送邮箱验证、密码重置等事务性邮件。",
        "Vercel（vercel.com）——托管 ImmiFina 网页应用。",
      ],
    },
    {
      title: "4. 我们不收集的数据",
      paragraphs: ["我们不收集或存储："],
      bullets: [
        "银行账号、信用卡号或任何支付信息",
        "社会安全号（SSN）或个人纳税人识别号（ITIN）——我们仅询问您是否持有，不询问具体号码",
        "政府签发的身份证件",
        "实时金融账户数据——所有财务数据均为您自行填报",
      ],
    },
    {
      title: "5. 数据共享",
      paragraphs: [
        "我们不出售、出租或转让您的个人数据。",
        "我们仅与第 3 节所列服务共享数据，且仅为提供服务之目的。我们不与广告商或数据中间商共享数据。",
        "若法律要求或为保护用户安全，我们可能披露相关数据。",
      ],
    },
    {
      title: "6. 数据保留",
      paragraphs: [
        "账户有效期间我们保留您的数据。如您申请删除账户，我们将在 30 天内删除您的个人数据（法律要求保留的除外）。",
      ],
    },
    {
      title: "7. 安全",
      paragraphs: [
        "密码以 bcrypt（成本因子 12）哈希存储，我们无法读取您的密码。会话使用存储在 httpOnly Cookie 中的 JWT 令牌。所有数据通过 HTTPS 传输。",
        "任何系统均非绝对安全，我们无法保证完全的安全性。",
      ],
    },
    {
      title: "8. Cookie",
      paragraphs: [
        "ImmiFina 仅使用一个会话 Cookie（httpOnly、Secure）以保持登录状态。我们不使用分析 Cookie、广告 Cookie 或第三方追踪像素。",
      ],
    },
    {
      title: "9. 您的权利",
      paragraphs: ["您有权："],
      bullets: [
        "查阅我们持有的您的数据——发邮件至 info@immifina.org",
        "更正不准确的数据——在设置中直接更新",
        "删除账户及相关数据——发邮件至 info@immifina.org",
        "随时停止使用本服务",
      ],
    },
    {
      title: "10. 政策变更",
      paragraphs: [
        "我们可能更新本政策。重大变更将通过电子邮件通知注册用户。变更发布后继续使用本服务，即视为接受。",
      ],
    },
  ],
  contactTitle: "11. 联系方式",
  contactBeforeEmail: "隐私相关问题或数据请求，请联系：",
};

export const PRIVACY: Record<Locale, LegalDoc> = {
  en: PRIVACY_EN,
  es: PRIVACY_ES,
  zh: PRIVACY_ZH,
};

export function getPrivacy(locale: string): LegalDoc {
  return PRIVACY[locale as Locale] ?? PRIVACY.en;
}
