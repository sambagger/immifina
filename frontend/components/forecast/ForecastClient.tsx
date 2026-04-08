"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { projectSavings, monthsToTarget } from "@/lib/forecast";
import { DEFAULT_DEBT_APR, debtFirstProjection } from "@/lib/debt-projection";
import { DebtVsSaveExplainer } from "@/components/forecast/DebtVsSaveExplainer";
import { EducationalDisclaimer } from "@/components/ui/EducationalDisclaimer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { apiFetch } from "@/lib/api";

const MEDIAN_HOME_BY_STATE: Record<string, number> = {
  CA: 750_000,
  TX: 350_000,
  NY: 450_000,
  FL: 400_000,
  default: 400_000,
};

export function ForecastClient() {
  const t = useTranslations("forecast");
  const tChat = useTranslations("chat");
  const [loaded, setLoaded] = useState(false);

  const [monthlyIncome, setMonthlyIncome] = useState(4000);
  const [incomePattern, setIncomePattern] = useState<"consistent" | "varies">("consistent");
  const [lowMonthIncome, setLowMonthIncome] = useState(3000);
  const [highMonthIncome, setHighMonthIncome] = useState(5000);
  const [currentDebt, setCurrentDebt] = useState(0);
  const [forecastTab, setForecastTab] = useState<"save" | "debt">("save");
  const [expenseHousing, setExpenseHousing] = useState(1200);
  const [expenseFood, setExpenseFood] = useState(500);
  const [expenseTransport, setExpenseTransport] = useState(200);
  const [expenseUtilities, setExpenseUtilities] = useState(150);
  const [expenseRemittance, setExpenseRemittance] = useState(0);
  const [expenseOther, setExpenseOther] = useState(250);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [monthlySave, setMonthlySave] = useState(400);
  const [yearsToProject, setYearsToProject] = useState(10);
  const [stateCode, setStateCode] = useState("CA");
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/profile");
        if (!res.ok) return;
        const data = (await res.json()) as {
          profile: {
            monthly_income: number;
            current_savings: number;
            expense_housing?: number;
            expense_food?: number;
            expense_transport?: number;
            expense_utilities?: number;
            expense_remittance?: number;
            expense_other?: number;
            monthly_expenses?: number;
            monthly_savings_goal?: number;
            state_of_residence?: string | null;
            current_debt?: number | string | null;
          } | null;
        };
        if (cancelled || !data.profile) return;
        const p = data.profile;
        setMonthlyIncome(Number(p.monthly_income) || 4000);
        const mi = Number(p.monthly_income) || 4000;
        setLowMonthIncome(mi);
        setHighMonthIncome(Math.round(mi * 1.2));
        if (p.current_debt != null) setCurrentDebt(Number(p.current_debt));
        setCurrentSavings(Number(p.current_savings) || 0);
        if (p.expense_housing != null) setExpenseHousing(Number(p.expense_housing));
        if (p.expense_food != null) setExpenseFood(Number(p.expense_food));
        if (p.expense_transport != null) setExpenseTransport(Number(p.expense_transport));
        if (p.expense_utilities != null) setExpenseUtilities(Number(p.expense_utilities));
        if (p.expense_remittance != null) setExpenseRemittance(Number(p.expense_remittance));
        if (p.expense_other != null) setExpenseOther(Number(p.expense_other));
        if (p.monthly_savings_goal != null) setMonthlySave(Number(p.monthly_savings_goal));
        if (p.state_of_residence) setStateCode(p.state_of_residence);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalExpenses = useMemo(
    () =>
      expenseHousing +
      expenseFood +
      expenseTransport +
      expenseUtilities +
      expenseRemittance +
      expenseOther,
    [
      expenseHousing,
      expenseFood,
      expenseTransport,
      expenseUtilities,
      expenseRemittance,
      expenseOther,
    ]
  );

  const effectiveMonthlyIncome =
    incomePattern === "varies" ? Math.max(0, lowMonthIncome) : Math.max(0, monthlyIncome);

  const surplus = Math.max(0, effectiveMonthlyIncome - totalExpenses);
  const effectiveSave = Math.min(monthlySave, surplus);
  const twentyPct = effectiveMonthlyIncome * 0.2;

  const chartData = useMemo(() => {
    const savePath = projectSavings(currentSavings, effectiveSave, 0.04, yearsToProject);
    const noSavePath = projectSavings(currentSavings, 0, 0.04, yearsToProject);
    const { savingsAfter: debtFirstPath } = debtFirstProjection(
      currentDebt,
      DEFAULT_DEBT_APR,
      effectiveSave,
      yearsToProject,
      currentSavings,
      0.04
    );
    return savePath.map((v, i) => ({
      year: i,
      saving: v,
      nosave: noSavePath[i] ?? currentSavings,
      debtFirst: debtFirstPath[i] ?? currentSavings,
    }));
  }, [currentSavings, effectiveSave, yearsToProject, currentDebt]);

  const activeChartRows = useMemo(() => {
    if (forecastTab === "save") {
      return chartData.map((row) => ({
        year: row.year,
        saving: row.saving,
        nosave: row.nosave,
      }));
    }
    return chartData.map((row) => ({
      year: row.year,
      saving: row.debtFirst,
      nosave: row.nosave,
    }));
  }, [chartData, forecastTab]);

  const emergencyTarget = totalExpenses * 3;
  const emergencyMonths = monthsToTarget(currentSavings, emergencyTarget, effectiveSave);
  const medianHome = MEDIAN_HOME_BY_STATE[stateCode] ?? MEDIAN_HOME_BY_STATE.default;
  const down10 = medianHome * 0.1;
  const downMonths = monthsToTarget(currentSavings, down10, effectiveSave);
  const fiveKMonths = monthsToTarget(currentSavings, 5000, effectiveSave);

  const endSaving =
    forecastTab === "save"
      ? (chartData[chartData.length - 1]?.saving ?? currentSavings)
      : (chartData[chartData.length - 1]?.debtFirst ?? currentSavings);

  const headlineSave = chartData[chartData.length - 1]?.saving ?? currentSavings;

  async function getSuggestions() {
    setAiLoading(true);
    setAiText(null);
    const summary = `User forecast: income ${effectiveMonthlyIncome}, expense categories total ${totalExpenses}, surplus ${surplus}, saves ${effectiveSave}/mo, current savings ${currentSavings}, debt ${currentDebt}, years ${yearsToProject}. End balance ~${endSaving}. Give 3-5 short educational suggestions. No investment picks.`;
    try {
      const res = await apiFetch("/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: summary }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAiText(tChat("error"));
        return;
      }
      setAiText((data.reply as string) || tChat("error"));
    } catch {
      setAiText(tChat("error"));
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-lg font-medium text-ink">{t("hook")}</p>
        <p className="mt-2 text-sm text-muted">{t("subtitle")}</p>
      </div>
      {!loaded ? (
        <p className="text-sm text-muted">{t("loadingProfile")}</p>
      ) : null}

      <Card className="border-accent/30 bg-accent-light/15">
        <p className="text-sm font-medium text-accent-text">{t("snapshotLabel")}</p>
        <p className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
          {t("snapshotHeadline", {
            years: yearsToProject,
            amount: `$${headlineSave.toLocaleString()}`,
          })}
        </p>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          <li>{t("insightSavingsRate")}</li>
          {currentDebt > 0 ? <li>{t("insightDebtFirst")}</li> : null}
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("forecastExplainTitle")}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setForecastTab("save")}
            className={`rounded-control border px-3 py-2 text-sm font-medium transition-colors focus-visible:focus-ring ${
              forecastTab === "save"
                ? "border-border-strong bg-accent-light text-accent-text"
                : "border-border text-muted hover:border-border-strong"
            }`}
          >
            {t("tabSaveFocus")}
          </button>
          <button
            type="button"
            onClick={() => setForecastTab("debt")}
            className={`rounded-control border px-3 py-2 text-sm font-medium transition-colors focus-visible:focus-ring ${
              forecastTab === "debt"
                ? "border-border-strong bg-accent-light text-accent-text"
                : "border-border text-muted hover:border-border-strong"
            }`}
          >
            {t("tabDebtFocus")}
          </button>
        </div>
        <p className="mt-3 text-xs text-muted">
          {forecastTab === "save" ? t("tabSaveHint") : t("tabDebtHint")}
        </p>
        <h3 className="mt-6 text-base font-semibold text-ink">{t("chartTitle")}</h3>
        <div className="mt-4 h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeChartRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" />
              <XAxis dataKey="year" tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip
                formatter={(value) => [
                  typeof value === "number" ? `$${value.toLocaleString()}` : String(value ?? ""),
                  "",
                ]}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid var(--color-border)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="saving"
                name={
                  forecastTab === "save" ? t("chartSaving") : t("chartDebtFirstLine")
                }
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="nosave"
                name={t("chartNoSave")}
                stroke="var(--color-border-strong)"
                strokeDasharray="6 4"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <details className="details-disclosure mt-6 group rounded-control border border-border bg-bg">
          <summary className="cursor-pointer p-3 text-sm font-medium text-ink">
            {t("methodologyTitle")}
          </summary>
          <p className="border-t border-border p-3 text-sm text-muted">{t("forecastExplainBody")}</p>
        </details>

        {currentDebt > 0 ? (
          <details className="details-disclosure mt-3 group rounded-control border border-border bg-bg">
            <summary className="cursor-pointer p-3 text-sm font-medium text-ink">
              {t("debtVsSaveExpand")}
            </summary>
            <div className="border-t border-border p-3">
              <DebtVsSaveExplainer
                debtAmount={currentDebt}
                debtAprPercent={24}
                savingsAprPercent={4}
              />
            </div>
          </details>
        ) : null}

        <a
          href="#forecast-inputs"
          className="mt-6 inline-flex text-sm font-medium text-accent underline-offset-2 hover:underline focus-visible:focus-ring rounded-badge"
        >
          {t("ctaAdjustInputs")}
        </a>
      </Card>

      <Card id="forecast-inputs" className="scroll-mt-24">
        <h2 className="text-lg font-semibold text-ink">{t("expenseBreakdownTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("expenseBreakdownLead")}</p>
        <details className="details-disclosure mt-4 rounded-control border border-border bg-bg">
          <summary className="cursor-pointer p-3 text-sm font-medium text-ink">
            {t("learnMoreIncome")}
          </summary>
          <div className="space-y-3 border-t border-border p-3 text-sm text-muted">
            <p>{t("understandIncome")}</p>
            <p>{t("payFrequencyLead")}</p>
            <ul className="list-inside list-disc space-y-1.5">
              <li>{t("payFrequencyWeekly")}</li>
              <li>{t("payFrequencyBiweekly")}</li>
              <li>{t("payFrequencySemiMonthly")}</li>
            </ul>
          </div>
        </details>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-ink">{t("monthlyIncome")}</label>
            <Input
              type="number"
              min={0}
              value={monthlyIncome}
              onChange={(e) => {
                const v = Number(e.target.value);
                setMonthlyIncome(v);
                if (incomePattern === "consistent") {
                  setLowMonthIncome(v);
                  setHighMonthIncome(Math.round(v * 1.2));
                }
              }}
              className="mt-1 font-figures"
            />
            <p className="mt-4 text-sm font-medium text-ink">{t("incomeSameQuestion")}</p>
            <div className="mt-2 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="incpat"
                  checked={incomePattern === "consistent"}
                  onChange={() => {
                    setIncomePattern("consistent");
                    setLowMonthIncome(monthlyIncome);
                  }}
                />
                {t("incomeSameYes")}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="incpat"
                  checked={incomePattern === "varies"}
                  onChange={() => {
                    setIncomePattern("varies");
                    setLowMonthIncome((prev) => prev || monthlyIncome);
                    setHighMonthIncome((prev) => (prev > 0 ? prev : Math.round(monthlyIncome * 1.2)));
                  }}
                />
                {t("incomeSameNo")}
              </label>
            </div>
            {incomePattern === "varies" ? (
              <div className="mt-4 space-y-4 rounded-control border border-border bg-bg p-4">
                <p className="text-sm text-muted">{t("incomeVariesIntro")}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-ink">{t("lowMonthLabel")}</label>
                    <Input
                      type="number"
                      min={0}
                      value={lowMonthIncome}
                      onChange={(e) => setLowMonthIncome(Number(e.target.value))}
                      className="mt-1 font-figures"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink">{t("highMonthLabel")}</label>
                    <Input
                      type="number"
                      min={0}
                      value={highMonthIncome}
                      onChange={(e) => setHighMonthIncome(Number(e.target.value))}
                      className="mt-1 font-figures"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted">{t("incomeVariesPlanNote")}</p>
                <p className="text-xs text-faint">{t("incomeSmoothingNote")}</p>
              </div>
            ) : null}
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("exHousing")}</label>
            <Input
              type="number"
              min={0}
              value={expenseHousing}
              onChange={(e) => setExpenseHousing(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("exFood")}</label>
            <Input
              type="number"
              min={0}
              value={expenseFood}
              onChange={(e) => setExpenseFood(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("exTransport")}</label>
            <Input
              type="number"
              min={0}
              value={expenseTransport}
              onChange={(e) => setExpenseTransport(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("exUtilities")}</label>
            <Input
              type="number"
              min={0}
              value={expenseUtilities}
              onChange={(e) => setExpenseUtilities(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("exRemit")}</label>
            <Input
              type="number"
              min={0}
              value={expenseRemittance}
              onChange={(e) => setExpenseRemittance(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("exOther")}</label>
            <Input
              type="number"
              min={0}
              value={expenseOther}
              onChange={(e) => setExpenseOther(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("currentSavings")}</label>
            <Input
              type="number"
              min={0}
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("currentDebt")}</label>
            <Input
              type="number"
              min={0}
              value={currentDebt}
              onChange={(e) => setCurrentDebt(Number(e.target.value))}
              className="mt-1 font-figures"
            />
            <p className="mt-1 text-xs text-faint">{t("currentDebtHint")}</p>
          </div>
        </div>
        <div className="mt-6 rounded-control border border-border bg-bg p-4 text-sm">
          <p>
            {t("totalExpensesLabel")}{" "}
            <span className="font-figures font-semibold">${totalExpenses.toLocaleString()}</span>
          </p>
          <p className="mt-2">
            {t("surplusLine", {
              surplus: `$${surplus.toLocaleString()}`,
            })}
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <h2 className="text-lg font-semibold text-ink">{t("saveRuleTitle")}</h2>
          <p className="mt-2 text-sm text-muted">{t("saveRuleBody")}</p>
          <p className="mt-2 text-sm text-muted">
            {t("twentyPctLine", { amount: `$${Math.round(twentyPct).toLocaleString()}` })}
          </p>
          <div className="mt-6">
            <label className="text-sm font-medium text-ink">{t("sliderSaveLabel")}</label>
            <input
              type="range"
              min={0}
              max={Math.max(surplus, 25)}
              value={Math.min(monthlySave, Math.max(surplus, 0))}
              onChange={(e) => setMonthlySave(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
            <p className="mt-1 font-figures text-sm text-muted">
              ${effectiveSave.toLocaleString()}/mo —{" "}
              {effectiveMonthlyIncome > 0
                ? t("pctOfIncome", {
                    pct: Math.round((effectiveSave / effectiveMonthlyIncome) * 100),
                  })
                : ""}
            </p>
          </div>
          <div className="mt-6">
            <label htmlFor="years" className="text-sm font-medium text-ink">
              {t("years")}:{" "}
              <span className="font-figures text-accent-text">{yearsToProject}</span>
            </label>
            <input
              id="years"
              type="range"
              min={1}
              max={30}
              value={yearsToProject}
              onChange={(e) => setYearsToProject(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
          </div>
        </div>
      </Card>

      <div id="budget-strategies" className="scroll-mt-20">
        <details className="details-disclosure group rounded-control border border-border bg-surface">
          <summary className="cursor-pointer p-4 font-semibold text-ink">
            {t("budgetingTitle")}
          </summary>
          <div className="border-t border-border p-4">
            <p className="text-sm text-muted">{t("budgetingLead")}</p>
            <ul className="mt-4 list-inside list-disc space-y-3 text-sm leading-relaxed text-muted">
              <li>{t("budgeting503020")}</li>
              <li>{t("budgetingEnvelope")}</li>
              <li>{t("budgetingPayFirst")}</li>
              <li>{t("budgetingZero")}</li>
              <li>{t("budgetingTailored")}</li>
            </ul>
            <p className="mt-4 text-xs text-faint">{t("budgetingDisc")}</p>
          </div>
        </details>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("milestonesTitle")}</h2>
        <ul className="mt-4 list-inside list-disc space-y-3 text-sm text-muted">
          <li>
            {t("msEmergency", {
              amount: `$${Math.round(emergencyTarget).toLocaleString()}`,
              months: emergencyMonths === null ? "—" : String(emergencyMonths),
            })}
          </li>
          <li>
            {t("ms5k", { months: fiveKMonths === null ? "—" : String(fiveKMonths) })}
          </li>
          <li>
            {t("msDown", {
              amount: `$${Math.round(down10).toLocaleString()}`,
              years:
                downMonths === null
                  ? "—"
                  : String(Math.round((downMonths / 12) * 10) / 10),
            })}
          </li>
          <li>{t("milestoneEnd", { amount: `$${endSaving.toLocaleString()}`, years: yearsToProject })}</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("aiTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("aiHint")}</p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4"
          onClick={() => void getSuggestions()}
          disabled={aiLoading}
        >
          {aiLoading ? "…" : t("aiButton")}
        </Button>
        {aiText ? (
          <div className="mt-4 rounded-control border border-border bg-bg p-4 text-sm text-ink whitespace-pre-wrap">
            {aiText}
          </div>
        ) : null}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("nextStepsTitle")}</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          <li>{t("nextStep1")}</li>
          <li>{t("nextStep2")}</li>
          <li>{t("nextStep3")}</li>
        </ul>
      </Card>

      <EducationalDisclaimer topic="general" />
    </div>
  );
}
