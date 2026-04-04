"use client";

import { useMemo, useState } from "react";
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
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const MEDIAN_HOME = 400_000;
const DOWN = 0.2;

export function ForecastClient() {
  const t = useTranslations("forecast");
  const tChat = useTranslations("chat");
  const [monthlyIncome, setMonthlyIncome] = useState(4000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(2800);
  const [currentSavings, setCurrentSavings] = useState(5000);
  const [monthlySavingsGoal, setMonthlySavingsGoal] = useState(500);
  const [yearsToProject, setYearsToProject] = useState(10);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const monthlySurplus = Math.max(0, monthlyIncome - monthlyExpenses);

  const chartData = useMemo(() => {
    const currentPath = projectSavings(currentSavings, monthlySurplus, 0.04, yearsToProject);
    const targetPath = projectSavings(currentSavings, monthlySavingsGoal, 0.04, yearsToProject);
    return currentPath.map((v, i) => ({
      year: i,
      current: v,
      target: targetPath[i] ?? 0,
    }));
  }, [currentSavings, monthlySurplus, monthlySavingsGoal, yearsToProject]);

  const emergencyTarget = monthlyExpenses * 3;
  const emergencyMonths = monthsToTarget(currentSavings, emergencyTarget, monthlySurplus);
  const downPayment = MEDIAN_HOME * DOWN;
  const downMonths = monthsToTarget(currentSavings, downPayment, monthlySurplus);
  const downYears =
    downMonths === null ? null : Math.round((downMonths / 12) * 10) / 10;

  const endCurrent = chartData[chartData.length - 1]?.current ?? currentSavings;

  async function getSuggestions() {
    setAiLoading(true);
    setAiText(null);
    const summary = `Forecast inputs: income ${monthlyIncome}, expenses ${monthlyExpenses}, savings ${currentSavings}, monthly savings goal ${monthlySavingsGoal}, years ${yearsToProject}. Monthly surplus about ${monthlySurplus}. End balance current path ~${endCurrent}. Give 3-5 short, practical educational suggestions in my language. No specific investment picks.`;
    try {
      const res = await fetch("/api/ai/chat", {
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
      <p className="text-muted">{t("subtitle")}</p>

      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink">{t("monthlyIncome")}</label>
            <Input
              type="number"
              min={0}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("monthlyExpenses")}</label>
            <Input
              type="number"
              min={0}
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
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
            <label className="text-sm font-medium text-ink">{t("monthlySavingsGoal")}</label>
            <Input
              type="number"
              min={0}
              value={monthlySavingsGoal}
              onChange={(e) => setMonthlySavingsGoal(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div className="md:col-span-2">
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

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("chartTitle")}</h2>
        <div className="mt-4 h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                dataKey="current"
                name={t("chartCurrent")}
                stroke="var(--color-blue)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="target"
                name={t("chartTarget")}
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("milestonesTitle")}</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          <li>
            {t("milestoneEnd", {
              amount: `$${endCurrent.toLocaleString()}`,
              years: yearsToProject,
            })}
          </li>
          <li>
            {emergencyMonths === null
              ? t("milestoneEmergency", { months: "—" })
              : t("milestoneEmergency", { months: String(emergencyMonths) })}
          </li>
          <li>
            {downYears === null
              ? t("milestoneDown", { years: "—" })
              : t("milestoneDown", { years: String(downYears) })}
          </li>
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
    </div>
  );
}
