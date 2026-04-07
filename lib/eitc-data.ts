/** IRS EITC approximate limits — 2024, single filer reference for education only. */
export const eitcLimits2024 = {
  "0_children": { max_income_single: 18591, max_credit: 632 },
  "1_child": { max_income_single: 49084, max_credit: 4213 },
  "2_children": { max_income_single: 55768, max_credit: 6960 },
  "3_children": { max_income_single: 59899, max_credit: 7830 },
} as const;

export type EitcChildrenKey = keyof typeof eitcLimits2024;

export function childrenToEitcKey(numChildren: number): EitcChildrenKey {
  if (numChildren <= 0) return "0_children";
  if (numChildren === 1) return "1_child";
  if (numChildren === 2) return "2_children";
  return "3_children";
}

/** Rough eligibility: earned income below limit (education only, not tax advice). */
export function estimateEitcMaxCredit(annualIncome: number, numChildren: number): number | null {
  const key = childrenToEitcKey(numChildren);
  const row = eitcLimits2024[key];
  if (annualIncome > row.max_income_single) return null;
  return row.max_credit;
}
