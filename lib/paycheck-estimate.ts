/** Rough, non-binding estimates for education only — not tax advice. */

const NO_INCOME_TAX = new Set([
  "AK",
  "FL",
  "NV",
  "NH",
  "SD",
  "TN",
  "TX",
  "WA",
  "WY",
]);

/** Approximate effective state withholding rate (education only). */
export function approximateStateWithholdingRate(stateCode: string): number {
  if (NO_INCOME_TAX.has(stateCode)) return 0;
  if (stateCode === "CA") return 0.045;
  if (stateCode === "NY") return 0.042;
  if (stateCode === "NJ") return 0.038;
  if (stateCode === "IL") return 0.038;
  if (stateCode === "OR") return 0.065;
  return 0.032;
}

export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";
export type FilingStatus = "single" | "mfj" | "hoh";

function grossToMonthly(gross: number, frequency: PayFrequency): number {
  switch (frequency) {
    case "weekly":
      return gross * 4.33;
    case "biweekly":
      return gross * (26 / 12);
    case "semimonthly":
      return gross * 2;
    case "monthly":
    default:
      return gross;
  }
}

/** Very simplified federal withholding illustration (not IRS-accurate). */
function roughFederalMonthly(monthlyGross: number, filing: FilingStatus, dependents: number): number {
  const adj =
    filing === "mfj" ? 0.92 : filing === "hoh" ? 0.94 : 1;
  const depAdj = Math.max(0, 1 - dependents * 0.02);
  const taxable = monthlyGross * adj * depAdj;
  let rate = 0.1;
  if (taxable > 4000) rate = 0.12;
  if (taxable > 8500) rate = 0.15;
  if (taxable > 15000) rate = 0.18;
  return Math.round(taxable * rate * 0.85);
}

export function estimatePaycheckDeductions(
  grossPerPeriod: number,
  frequency: PayFrequency,
  stateCode: string,
  filing: FilingStatus,
  dependents: number,
  healthInsurance: number,
  retirement401k: number
): {
  monthlyGross: number;
  socialSecurity: number;
  medicare: number;
  federal: number;
  state: number;
  health: number;
  retirement: number;
  takeHome: number;
  takeHomePct: number;
} {
  const monthlyGross = grossToMonthly(grossPerPeriod, frequency);
  const ssWageBaseMonthly = 168600 / 12;
  const ssBase = Math.min(monthlyGross, ssWageBaseMonthly);
  const socialSecurity = Math.round(ssBase * 0.062);
  const medicare = Math.round(monthlyGross * 0.0145);
  const federal = roughFederalMonthly(monthlyGross, filing, dependents);
  const state = Math.round(monthlyGross * approximateStateWithholdingRate(stateCode));
  const health = Math.max(0, healthInsurance);
  const retirement = Math.max(0, retirement401k);
  const takeHome = Math.max(
    0,
    monthlyGross - socialSecurity - medicare - federal - state - health - retirement
  );
  const takeHomePct = monthlyGross > 0 ? Math.round((takeHome / monthlyGross) * 1000) / 10 : 0;
  return {
    monthlyGross: Math.round(monthlyGross * 100) / 100,
    socialSecurity,
    medicare,
    federal,
    state,
    health,
    retirement,
    takeHome,
    takeHomePct,
  };
}
