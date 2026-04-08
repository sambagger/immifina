"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { US_STATES } from "@/lib/us-states";
import { ORIGIN_COUNTRIES } from "@/lib/countries-origin";
import { apiFetch } from "@/lib/api";

type Immigration = "us_citizen" | "green_card" | "visa" | "daca" | "other";
type Goal =
  | "build_credit"
  | "bank_account"
  | "save_plan"
  | "remittance"
  | "taxes"
  | "home"
  | "business";
type Employment = "employed" | "self_employed" | "unemployed" | "student";

export function OnboardingWizard() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [immigrationSituation, setImmigrationSituation] = useState<Immigration>("visa");
  const [hasSsn, setHasSsn] = useState(false);
  const [hasItin, setHasItin] = useState(false);
  const [yearsInUs, setYearsInUs] = useState(2);
  const [countryOfOrigin, setCountryOfOrigin] = useState("MX");

  const [primaryGoal, setPrimaryGoal] = useState<Goal>("save_plan");

  const [stateOfResidence, setStateOfResidence] = useState("CA");
  const [householdSize, setHouseholdSize] = useState(2);
  const [childrenUnder18, setChildrenUnder18] = useState(false);
  const [employmentStatus, setEmploymentStatus] = useState<Employment>("employed");

  const [monthlyIncome, setMonthlyIncome] = useState(3500);
  const [expenseHousing, setExpenseHousing] = useState(1200);
  const [expenseFood, setExpenseFood] = useState(500);
  const [expenseTransport, setExpenseTransport] = useState(200);
  const [expenseUtilities, setExpenseUtilities] = useState(150);
  const [expenseRemittance, setExpenseRemittance] = useState(0);
  const [expenseOther, setExpenseOther] = useState(250);
  const [currentSavings, setCurrentSavings] = useState(2000);
  const [currentDebt, setCurrentDebt] = useState(0);
  const [monthlyCanSave, setMonthlyCanSave] = useState(200);

  const totalExpenses =
    expenseHousing +
    expenseFood +
    expenseTransport +
    expenseUtilities +
    expenseRemittance +
    expenseOther;
  const surplus = Math.max(0, monthlyIncome - totalExpenses);

  async function submitAll() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          immigrationSituation,
          hasSsn,
          hasItin,
          yearsInUs,
          countryOfOrigin:
            countryOfOrigin === "OTHER"
              ? "Other"
              : (ORIGIN_COUNTRIES.find((c) => c.code === countryOfOrigin)?.name ?? countryOfOrigin),
          primaryGoal,
          stateOfResidence,
          householdSize,
          childrenUnder18,
          hasChildren: childrenUnder18,
          employmentStatus,
          monthlyIncome,
          expenseHousing,
          expenseFood,
          expenseTransport,
          expenseUtilities,
          expenseRemittance,
          expenseOther,
          currentSavings,
          currentDebt,
          monthlyCanSave: Math.min(monthlyCanSave, surplus || monthlyCanSave),
          completeOnboarding: true,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
      };
      if (!res.ok) {
        setError(
          body.code === "MIGRATION_REQUIRED" && typeof body.error === "string"
            ? body.error
            : t("error")
        );
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-center text-sm text-muted">
        {t("stepIndicator", { step, total: 4 })}
      </p>

      {step === 1 ? (
        <Card>
          <h2 className="font-display text-xl text-ink">{t("s1Title")}</h2>
          <p className="mt-2 text-sm text-muted">{t("s1Lead")}</p>
          <div className="mt-6 space-y-3">
            {(
              [
                ["us_citizen", t("optCitizen")],
                ["green_card", t("optGreen")],
                ["visa", t("optVisa")],
                ["daca", t("optDaca")],
                ["other", t("optOther")],
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
                  name="imm"
                  className="mt-0.5"
                  checked={immigrationSituation === value}
                  onChange={() => setImmigrationSituation(value)}
                />
                <span className="ml-3">{label}</span>
              </label>
            ))}
          </div>

          <div className="mt-8 grid gap-4 border-t border-border pt-6 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={hasSsn} onChange={(e) => setHasSsn(e.target.checked)} />
              {t("hasSsn")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={hasItin} onChange={(e) => setHasItin(e.target.checked)} />
              {t("hasItin")}
            </label>
          </div>
          <details className="details-disclosure mt-2 text-xs text-muted">
            <summary className="cursor-pointer text-accent">{t("whatSsn")}</summary>
            <p className="mt-2">{t("whatSsnBody")}</p>
          </details>
          <details className="details-disclosure mt-2 text-xs text-muted">
            <summary className="cursor-pointer text-accent">{t("whatItin")}</summary>
            <p className="mt-2">{t("whatItinBody")}</p>
          </details>

          <div className="mt-6">
            <label className="text-sm font-medium text-ink">{t("yearsUs")}</label>
            <input
              type="range"
              min={0}
              max={30}
              value={yearsInUs}
              onChange={(e) => setYearsInUs(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
            <p className="font-figures text-sm text-muted">
              {yearsInUs === 30 ? "30+" : yearsInUs} {t("years")}
            </p>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-ink">{t("origin")}</label>
            <Select
              className="mt-1"
              value={countryOfOrigin}
              onChange={(e) => setCountryOfOrigin(e.target.value)}
            >
              {ORIGIN_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card>
          <h2 className="font-display text-xl text-ink">{t("s2Title")}</h2>
          <p className="mt-2 text-sm text-muted">{t("s2Lead")}</p>
          <div className="mt-6 space-y-3">
            {(
              [
                ["build_credit", t("goalCredit")],
                ["bank_account", t("goalBank")],
                ["save_plan", t("goalSave")],
                ["remittance", t("goalRemit")],
                ["taxes", t("goalTax")],
                ["home", t("goalHome")],
                ["business", t("goalBiz")],
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
                  name="goal"
                  checked={primaryGoal === value}
                  onChange={() => setPrimaryGoal(value)}
                />
                <span className="ml-3">{label}</span>
              </label>
            ))}
          </div>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card>
          <h2 className="font-display text-xl text-ink">{t("s3Title")}</h2>
          <div className="mt-6 grid gap-4">
            <div>
              <label className="text-sm font-medium text-ink">{t("state")}</label>
              <Select
                className="mt-1"
                value={stateOfResidence}
                onChange={(e) => setStateOfResidence(e.target.value)}
              >
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-ink">{t("household")}</label>
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
              <p className="text-sm font-medium text-ink">{t("kids")}</p>
              <div className="mt-2 flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={childrenUnder18}
                    onChange={() => setChildrenUnder18(true)}
                  />
                  {t("yes")}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={!childrenUnder18}
                    onChange={() => setChildrenUnder18(false)}
                  />
                  {t("no")}
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-ink">{t("employment")}</label>
              <Select
                className="mt-1"
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value as Employment)}
              >
                <option value="employed">{t("empEmployed")}</option>
                <option value="self_employed">{t("empSelf")}</option>
                <option value="unemployed">{t("empUnemployed")}</option>
                <option value="student">{t("empStudent")}</option>
              </Select>
            </div>
          </div>
        </Card>
      ) : null}

      {step === 4 ? (
        <Card>
          <h2 className="font-display text-xl text-ink">{t("s4Title")}</h2>
          <p className="mt-2 text-sm text-muted">{t("s4Lead")}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-ink">{t("monthlyIncome")}</label>
              <Input
                type="number"
                min={0}
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="mt-1 font-figures"
              />
              <p className="mt-1 text-xs text-muted">{t("incomeHint")}</p>
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
              <label className="text-sm font-medium text-ink">{t("savings")}</label>
              <Input
                type="number"
                min={0}
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="mt-1 font-figures"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">{t("debt")}</label>
              <Input
                type="number"
                min={0}
                value={currentDebt}
                onChange={(e) => setCurrentDebt(Number(e.target.value))}
                className="mt-1 font-figures"
              />
            </div>
          </div>
          <div className="mt-6 rounded-control border border-border bg-bg p-4 text-sm">
            <p>
              {t("totalExpenses")}{" "}
              <span className="font-figures font-semibold">${totalExpenses.toLocaleString()}</span>
            </p>
            <p className="mt-1">
              {t("surplus")}{" "}
              <span className="font-figures font-semibold text-accent-text">
                ${surplus.toLocaleString()}
              </span>
            </p>
          </div>
          <div className="mt-6">
            <label className="text-sm font-medium text-ink">{t("canSave")}</label>
            <input
              type="range"
              min={0}
              max={Math.max(surplus, 25)}
              value={Math.min(monthlyCanSave, Math.max(surplus, 0))}
              onChange={(e) => setMonthlyCanSave(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
            <p className="font-figures text-sm text-muted">${monthlyCanSave.toLocaleString()}/mo</p>
          </div>
        </Card>
      ) : null}

      {error ? (
        <p className="text-center text-sm text-red" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap justify-between gap-3">
        {step > 1 ? (
          <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>
            {t("back")}
          </Button>
        ) : (
          <span />
        )}
        {step < 4 ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)}>
            {t("next")}
          </Button>
        ) : (
          <Button type="button" onClick={() => void submitAll()} disabled={loading}>
            {loading ? "…" : t("finish")}
          </Button>
        )}
      </div>
    </div>
  );
}
