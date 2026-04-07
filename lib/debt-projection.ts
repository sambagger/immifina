import { projectSavings } from "@/lib/forecast";

export const DEFAULT_DEBT_APR = 0.2;

/**
 * Month by month: apply monthly surplus to debt (with interest) first.
 * Once debt is cleared, compound savings at `annualReturnRate`.
 * `savingsAfter` has length `yearsToProject + 1`, aligned with `projectSavings`.
 */
export function debtFirstProjection(
  currentDebt: number,
  interestRateAnnual: number,
  monthlyPayment: number,
  yearsToProject: number,
  currentSavings: number = 0,
  annualReturnRate: number = 0.04
): { debtFreeMonth: number | null; savingsAfter: number[] } {
  const months = yearsToProject * 12;
  const monthlyDebtRate = interestRateAnnual / 12;
  const monthlySaveRate = annualReturnRate / 12;

  let debt = Math.max(0, currentDebt);
  let savings = Math.max(0, currentSavings);
  let debtFreeMonth: number | null = null;

  const savingsAfter: number[] = [];

  for (let i = 0; i <= months; i++) {
    if (i % 12 === 0) {
      savingsAfter.push(Math.round(savings));
    }
    if (i === months) break;

    if (debt > 0.005) {
      savings *= 1 + monthlySaveRate;
      debt *= 1 + monthlyDebtRate;
      const pay = Math.min(monthlyPayment, debt);
      debt -= pay;
      if (debt <= 0.005) {
        debt = 0;
        if (debtFreeMonth === null) debtFreeMonth = i + 1;
      }
    } else {
      savings = savings * (1 + monthlySaveRate) + monthlyPayment;
    }
  }

  return { debtFreeMonth, savingsAfter };
}

export { projectSavings };
