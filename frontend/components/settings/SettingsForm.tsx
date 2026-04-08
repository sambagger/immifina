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
import { apiFetch } from "@/lib/api";

type Immigration = "us_citizen" | "green_card" | "visa" | "daca" | "other";
type PrimaryGoal =
  | "build_credit"
  | "bank_account"
  | "save_plan"
  | "remittance"
  | "taxes"
  | "home"
  | "business";
type Employment = "employed" | "self_employed" | "unemployed" | "student";

const IMM_OPTIONS: Immigration[] = ["us_citizen", "green_card", "visa", "daca", "other"];
const GOAL_OPTIONS: PrimaryGoal[] = [
  "build_credit",
  "bank_account",
  "save_plan",
  "remittance",
  "taxes",
  "home",
  "business",
];
const EMP_OPTIONS: Employment[] = ["employed", "self_employed", "unemployed", "student"];

function parseImmigration(raw: string | null | undefined): Immigration {
  return IMM_OPTIONS.includes(raw as Immigration) ? (raw as Immigration) : "visa";
}

function parseGoal(raw: string | null | undefined): PrimaryGoal {
  return GOAL_OPTIONS.includes(raw as PrimaryGoal) ? (raw as PrimaryGoal) : "save_plan";
}

function parseEmployment(raw: string | null | undefined): Employment {
  return EMP_OPTIONS.includes(raw as Employment) ? (raw as Employment) : "employed";
}

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
    immigration_situation?: string | null;
    primary_goal?: string | null;
    has_ssn?: boolean | null;
    has_itin?: boolean | null;
    years_in_us?: number | null;
    employment_status?: string | null;
  } | null;
};

export function SettingsForm() {
  const t = useTranslations("settings");
  const tDash = useTranslations("dashboard");
  const tOn = useTranslations("onboarding");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "es" | "zh">("en");
  const [immigrationSituation, setImmigrationSituation] = useState<Immigration>("visa");
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal>("save_plan");
  const [hasSsn, setHasSsn] = useState(false);
  const [hasItin, setHasItin] = useState(false);
  const [yearsInUs, setYearsInUs] = useState(2);
  const [employmentStatus, setEmploymentStatus] = useState<Employment>("employed");
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
        const res = await apiFetch("/profile");
        if (!res.ok) return;
        const data = (await res.json()) as ProfilePayload;
        if (cancelled) return;
        setName(data.user.name);
        setPreferredLanguage((data.user.preferred_language as "en" | "es" | "zh") || "en");
        const p = data.profile;
        if (p) {
          setImmigrationSituation(parseImmigration(p.immigration_situation));
          setPrimaryGoal(parseGoal(p.primary_goal));
          setHasSsn(Boolean(p.has_ssn));
          setHasItin(Boolean(p.has_itin));
          setYearsInUs(
            typeof p.years_in_us === "number" && Number.isFinite(p.years_in_us)
              ? Math.min(80, Math.max(0, p.years_in_us))
              : 2
          );
          setEmploymentStatus(parseEmployment(p.employment_status));
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
      const res = await apiFetch("/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          preferredLanguage,
          immigrationSituation,
          primaryGoal,
          hasSsn,
          hasItin,
          yearsInUs,
          employmentStatus,
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
      router.refresh();
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

        <div className="border-t border-border pt-6">
          <h2 className="font-display text-lg text-ink">{t("situationSection")}</h2>
          <p className="mt-2 text-sm text-muted">{t("situationLead")}</p>
          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium text-ink">{tOn("s1Title")}</p>
            {(
              [
                ["us_citizen", tOn("optCitizen")],
                ["green_card", tOn("optGreen")],
                ["visa", tOn("optVisa")],
                ["daca", tOn("optDaca")],
                ["other", tOn("optOther")],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer rounded-control border px-4 py-3 text-sm ${
                  immigrationSituation === value
                    ? "border-accent bg-accent-light"
                    : "border-border bg-surface"
                }`}
              >
                <input
                  type="radio"
                  name="immigration"
                  className="mt-0.5"
                  checked={immigrationSituation === value}
                  onChange={() => setImmigrationSituation(value)}
                />
                <span className="ml-3">{label}</span>
              </label>
            ))}
          </div>

          <p className="mt-8 text-sm font-medium text-ink">{tOn("s2Title")}</p>
          <div className="mt-3 space-y-3">
            {(
              [
                ["build_credit", tOn("goalCredit")],
                ["bank_account", tOn("goalBank")],
                ["save_plan", tOn("goalSave")],
                ["remittance", tOn("goalRemit")],
                ["taxes", tOn("goalTax")],
                ["home", tOn("goalHome")],
                ["business", tOn("goalBiz")],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer rounded-control border px-4 py-3 text-sm ${
                  primaryGoal === value ? "border-accent bg-accent-light" : "border-border bg-surface"
                }`}
              >
                <input
                  type="radio"
                  name="primaryGoal"
                  checked={primaryGoal === value}
                  onChange={() => setPrimaryGoal(value)}
                />
                <span className="ml-3">{label}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 grid gap-4 border-t border-border pt-6 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={hasSsn} onChange={(e) => setHasSsn(e.target.checked)} />
              {tOn("hasSsn")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={hasItin} onChange={(e) => setHasItin(e.target.checked)} />
              {tOn("hasItin")}
            </label>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-ink">{tOn("yearsUs")}</label>
            <input
              type="range"
              min={0}
              max={30}
              value={yearsInUs}
              onChange={(e) => setYearsInUs(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
            <p className="font-figures text-sm text-muted">
              {yearsInUs === 30 ? "30+" : yearsInUs} {tOn("years")}
            </p>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-ink">{tOn("employment")}</label>
            <Select
              className="mt-1"
              value={employmentStatus}
              onChange={(e) => setEmploymentStatus(e.target.value as Employment)}
            >
              <option value="employed">{tOn("empEmployed")}</option>
              <option value="self_employed">{tOn("empSelf")}</option>
              <option value="unemployed">{tOn("empUnemployed")}</option>
              <option value="student">{tOn("empStudent")}</option>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 border-t border-border pt-6 md:grid-cols-2">
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
