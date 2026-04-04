export type DeliveryMethod = "bank" | "cash" | "wallet";

export type RemittanceRow = {
  name: string;
  feeUsd: number;
  exchangeRateNote: string;
  recipientGetsUsd: number;
  speed: string;
  rating: number;
  url: string;
};

const PROVIDERS_BASE = [
  {
    name: "Wise",
    feeUsd: 4.99,
    exchangeRateNote: "Mid-market style (sample)",
    speed: "1–2 business days",
    rating: 4.7,
    url: "https://wise.com",
  },
  {
    name: "Remitly",
    feeUsd: 3.99,
    exchangeRateNote: "Promotional tier (sample)",
    speed: "Minutes–same day",
    rating: 4.5,
    url: "https://www.remitly.com",
  },
  {
    name: "Western Union",
    feeUsd: 7.99,
    exchangeRateNote: "Retail rate (sample)",
    speed: "Minutes–1 day",
    rating: 4.2,
    url: "https://www.westernunion.com",
  },
  {
    name: "MoneyGram",
    feeUsd: 6.49,
    exchangeRateNote: "Retail rate (sample)",
    speed: "Minutes–1 day",
    rating: 4.1,
    url: "https://www.moneygram.com",
  },
  {
    name: "WorldRemit",
    feeUsd: 5.49,
    exchangeRateNote: "Online rate (sample)",
    speed: "Same day",
    rating: 4.4,
    url: "https://www.worldremit.com",
  },
];

/** Illustrative recipient amounts: tweak per country for static demo */
const COUNTRY_FACTOR: Record<string, number> = {
  MX: 0.92,
  IN: 0.88,
  PH: 0.9,
  CN: 0.91,
  GT: 0.89,
  SV: 0.9,
  HN: 0.9,
  NG: 0.85,
  VN: 0.9,
  CO: 0.9,
  BR: 0.87,
  JM: 0.88,
  HT: 0.86,
  CU: 0.84,
  KR: 0.93,
  PK: 0.87,
  BD: 0.88,
  EG: 0.86,
  ET: 0.84,
  GB: 0.95,
};

export function getRemittanceRows(
  amountUsd: number,
  countryCode: string,
  method: DeliveryMethod
): RemittanceRow[] {
  const factor = COUNTRY_FACTOR[countryCode] ?? 0.9;
  const methodFeeBump =
    method === "cash" ? 1.15 : method === "wallet" ? 1.05 : 1;

  return PROVIDERS_BASE.map((p) => {
    const fee = Math.round(p.feeUsd * methodFeeBump * 100) / 100;
    const netSend = Math.max(0, amountUsd - fee);
    const recipientGetsUsd = Math.round(netSend * factor * 100) / 100;
    return {
      name: p.name,
      feeUsd: fee,
      exchangeRateNote: p.exchangeRateNote,
      recipientGetsUsd,
      speed: p.speed,
      rating: p.rating,
      url: p.url,
    };
  }).sort((a, b) => b.recipientGetsUsd - a.recipientGetsUsd);
}

export const REMITTANCE_COUNTRIES: { code: string; nameKey: string }[] = [
  { code: "MX", nameKey: "mexico" },
  { code: "IN", nameKey: "india" },
  { code: "PH", nameKey: "philippines" },
  { code: "CN", nameKey: "china" },
  { code: "GT", nameKey: "guatemala" },
  { code: "SV", nameKey: "elSalvador" },
  { code: "HN", nameKey: "honduras" },
  { code: "NG", nameKey: "nigeria" },
  { code: "VN", nameKey: "vietnam" },
  { code: "CO", nameKey: "colombia" },
  { code: "BR", nameKey: "brazil" },
  { code: "JM", nameKey: "jamaica" },
  { code: "HT", nameKey: "haiti" },
  { code: "CU", nameKey: "cuba" },
  { code: "KR", nameKey: "korea" },
  { code: "PK", nameKey: "pakistan" },
  { code: "BD", nameKey: "bangladesh" },
  { code: "EG", nameKey: "egypt" },
  { code: "ET", nameKey: "ethiopia" },
  { code: "GB", nameKey: "uk" },
];
