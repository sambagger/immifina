export function projectSavings(currentSavings, monthlySavings, annualReturnRate = 0.04, years) {
  const monthlyRate = annualReturnRate / 12;
  const months = years * 12;
  const projections = [];
  let balance = currentSavings;
  for (let i = 0; i <= months; i++) {
    if (i % 12 === 0) projections.push(Math.round(balance));
    balance = balance * (1 + monthlyRate) + monthlySavings;
  }
  return projections;
}

export function monthsToTarget(current, target, monthlyContribution) {
  if (monthlyContribution <= 0 || target <= current) return 0;
  const gap = target - current;
  return Math.ceil(gap / monthlyContribution);
}
