"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { US_STATES } from "@/lib/us-states";

type ProfilePayload = {
  user: { name: string; preferred_language: string };
  profile: {
    monthly_income: number;
    monthly_expenses: number;
    current_savings: number;
    monthly_savings_goal: number;
    household_size: number;
    state_of_residence: string | null;
    has_children: boolean;
  } | null;
};

export function SettingsForm() {
  const t = useTranslations("settings");
  const tDash = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "es" | "zh">("en");
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthlySavingsGoal, setMonthlySavingsGoal] = useState(0);
  const [householdSize, setHouseholdSize] = useState(1);
  const [stateOfResidence, setStateOfResidence] = useState("CA");
  const [hasChildren, setHasChildren] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) return;
        const data = (await res.json()) as ProfilePayload;
        if (cancelled) return;
        setName(data.user.name);
        setPreferredLanguage((data.user.preferred_language as "en" | "es" | "zh") || "en");
        const p = data.profile;
        if (p) {
          setMonthlyIncome(Number(p.monthly_income));
          setMonthlyExpenses(Number(p.monthly_expenses));
          setCurrentSavings(Number(p.current_savings));
          setMonthlySavingsGoal(Number(p.monthly_savings_goal));
          setHouseholdSize(p.household_size);
          setStateOfResidence(p.state_of_residence || "CA");
          setHasChildren(Boolean(p.has_children));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          preferredLanguage,
          monthlyIncome,
          monthlyExpenses,
          currentSavings,
          monthlySavingsGoal,
          householdSize,
          stateOfResidence,
          hasChildren,
        }),
      });
      if (!res.ok) {
        setError(tCommon("error"));
        return;
      }
      setSaved(true);
      if (preferredLanguage !== locale) {
        router.replace("/settings", { locale: preferredLanguage });
      }
    } catch {
      setError(tCommon("error"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4" aria-busy>
        <div className="h-10 max-w-xs rounded-control bg-border" />
        <div className="h-64 rounded-card border border-border bg-surface" />
      </div>
    );
  }

  return (
    <Card>
      <h1 className="font-display text-2xl text-ink md:text-3xl">{t("title")}</h1>
      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="pref-lang" className="text-sm font-medium text-ink">
            {t("language")}
          </label>
          <Select
            id="pref-lang"
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value as typeof preferredLanguage)}
            className="mt-1"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="zh">中文（简体）</option>
          </Select>
        </div>
        <div>
          <label htmlFor="s-name" className="text-sm font-medium text-ink">
            {t("name")}
          </label>
          <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink">{tDash("income")}</label>
            <Input
              type="number"
              min={0}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{tDash("expenses")}</label>
            <Input
              type="number"
              min={0}
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{tDash("savings")}</label>
            <Input
              type="number"
              min={0}
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{tDash("goal")}</label>
            <Input
              type="number"
              min={0}
              value={monthlySavingsGoal}
              onChange={(e) => setMonthlySavingsGoal(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("householdLabel")}</label>
            <Input
              type="number"
              min={1}
              max={20}
              value={householdSize}
              onChange={(e) => setHouseholdSize(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("stateLabel")}</label>
            <Select
              value={stateOfResidence}
              onChange={(e) => setStateOfResidence(e.target.value)}
              className="mt-1"
            >
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hasChildren}
                onChange={(e) => setHasChildren(e.target.checked)}
              />
              {t("hasChildren")}
            </label>
          </div>
        </div>
        {error ? (
          <p className="text-sm text-red" role="alert">
            {error}
          </p>
        ) : null}
        {saved ? (
          <p className="text-sm text-accent-text" role="status">
            {t("saved")}
          </p>
        ) : null}
        <Button type="submit" disabled={saving}>
          {saving ? "…" : t("saveProfile")}
        </Button>
      </form>
    </Card>
  );
}
