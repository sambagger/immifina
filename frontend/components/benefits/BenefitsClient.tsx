"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { EducationalDisclaimer } from "@/components/ui/EducationalDisclaimer";
import { US_STATES } from "@/lib/us-states";
import { estimateEitcMaxCredit } from "@/lib/eitc-data";
import { apiFetch } from "@/lib/api";

type ProgramRow = {
  id: string;
  eligibilityKey: "high" | "medium" | "low";
  applyUrl: string;
};

export function BenefitsClient() {
  const t = useTranslations("benefits");
  const tCommon = useTranslations("common");
  const [state, setState] = useState("CA");
  const [householdSize, setHouseholdSize] = useState(2);
  const [annualIncome, setAnnualIncome] = useState(45000);
  const [hasChildren, setHasChildren] = useState(false);
  const [immigrationStatus, setImmigrationStatus] = useState<
    "citizen" | "permanent_resident" | "visa_holder" | "daca" | "other"
  >("citizen");
  const [hasChildrenUnder5, setHasChildrenUnder5] = useState(false);
  const [pregnantOrNewborn, setPregnantOrNewborn] = useState(false);
  const [programs, setPrograms] = useState<ProgramRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicChargeAck, setPublicChargeAck] = useState(false);
  const [earnedIncome, setEarnedIncome] = useState(true);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/benefits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          householdSize,
          annualIncome,
          hasChildren,
          hasChildrenUnder5,
          pregnantOrNewborn,
          immigrationStatus,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(tCommon("error"));
        return;
      }
      setPrograms(data.programs as ProgramRow[]);
    } catch {
      setError(tCommon("error"));
    } finally {
      setLoading(false);
    }
  }

  const childCount = hasChildren ? Math.min(Math.max(householdSize - 1, 1), 3) : 0;
  const eitcMax = estimateEitcMaxCredit(annualIncome, childCount);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-lg font-medium text-ink">{t("hook")}</p>
        <p className="mt-2 text-sm text-muted">{t("subtitle")}</p>
        <p className="mt-2 text-sm text-muted">{t("privacyLead")}</p>
      </div>

      <Card className="border-teal-600/25 bg-teal-500/5">
        <h2 className="text-lg font-semibold text-ink">{t("reassuranceTitle")}</h2>
        <p className="mt-3 text-sm text-muted">{t("reassuranceBody")}</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("bucketsTitle")}</h2>
        <ul className="mt-4 space-y-4 text-sm">
          <li>
            <p className="font-medium text-ink">{t("bucketSafeTitle")}</p>
            <p className="mt-1 text-muted">{t("bucketSafeBody")}</p>
          </li>
          <li>
            <p className="font-medium text-ink">{t("bucketDependsTitle")}</p>
            <p className="mt-1 text-muted">{t("bucketDependsBody")}</p>
          </li>
          <li>
            <p className="font-medium text-ink">{t("bucketExpertTitle")}</p>
            <p className="mt-1 text-muted">{t("bucketExpertBody")}</p>
          </li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("publicChargeTitle")}</h2>
        <p className="mt-3 text-sm text-muted">{t("publicChargeLead")}</p>
        <details className="details-disclosure mt-4 rounded-control border border-border bg-bg">
          <summary className="cursor-pointer p-3 text-sm font-medium text-ink">
            {t("publicChargeReadMore")}
          </summary>
          <div className="border-t border-border p-3">
            <p className="whitespace-pre-line text-sm text-muted">{t("publicChargeBody")}</p>
          </div>
        </details>
        <a
          href="https://www.immigrationadvocates.org/legaldirectory"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-accent underline-offset-2 hover:underline"
        >
          {t("publicChargeLink")} ↗
        </a>
        <p className="mt-4 text-sm text-muted">{t("publicChargeFooter")}</p>
        {!publicChargeAck ? (
          <Button type="button" className="mt-4" onClick={() => setPublicChargeAck(true)}>
            {t("publicChargeAck")}
          </Button>
        ) : null}
      </Card>

      {publicChargeAck ? (
      <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="md:col-span-2">
            <label htmlFor="state" className="text-sm font-medium text-ink">
              {t("state")}
            </label>
            <Select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-1"
            >
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="hh" className="text-sm font-medium text-ink">
              {t("household")}
            </label>
            <Input
              id="hh"
              type="number"
              min={1}
              max={20}
              value={householdSize}
              onChange={(e) => setHouseholdSize(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label htmlFor="inc" className="text-sm font-medium text-ink">
              {t("income")}
            </label>
            <Input
              id="inc"
              type="number"
              min={0}
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div className="md:col-span-2">
            <span className="text-sm font-medium text-ink">{t("earnedIncomeLabel")}</span>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="earned"
                  checked={earnedIncome}
                  onChange={() => setEarnedIncome(true)}
                />
                {t("earnedIncomeYes")}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="earned"
                  checked={!earnedIncome}
                  onChange={() => setEarnedIncome(false)}
                />
                {t("earnedIncomeNo")}
              </label>
            </div>
          </div>
          <div className="md:col-span-2">
            <span className="text-sm font-medium text-ink">{t("children")}</span>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="ch"
                  checked={hasChildren}
                  onChange={() => setHasChildren(true)}
                />
                {t("childrenYes")}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="ch"
                  checked={!hasChildren}
                  onChange={() => setHasChildren(false)}
                />
                {t("childrenNo")}
              </label>
            </div>
          </div>
          {hasChildren ? (
            <div className="md:col-span-2">
              <span className="text-sm font-medium text-ink">{t("childrenUnder5")}</span>
              <div className="mt-2 flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="u5"
                    checked={hasChildrenUnder5}
                    onChange={() => setHasChildrenUnder5(true)}
                  />
                  {t("childrenYes")}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="u5"
                    checked={!hasChildrenUnder5}
                    onChange={() => setHasChildrenUnder5(false)}
                  />
                  {t("childrenNo")}
                </label>
              </div>
            </div>
          ) : null}
          <div className="md:col-span-2">
            <span className="text-sm font-medium text-ink">{t("pregnant")}</span>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="preg"
                  checked={pregnantOrNewborn}
                  onChange={() => setPregnantOrNewborn(true)}
                />
                {t("childrenYes")}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="preg"
                  checked={!pregnantOrNewborn}
                  onChange={() => setPregnantOrNewborn(false)}
                />
                {t("childrenNo")}
              </label>
            </div>
            <p className="mt-1 text-xs text-muted">{t("pregnantHint")}</p>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="im" className="text-sm font-medium text-ink">
              {t("status")}
            </label>
            <Select
              id="im"
              value={immigrationStatus}
              onChange={(e) =>
                setImmigrationStatus(e.target.value as typeof immigrationStatus)
              }
              className="mt-1"
            >
              <option value="citizen">{t("statusCitizen")}</option>
              <option value="permanent_resident">{t("statusPR")}</option>
              <option value="visa_holder">{t("statusVisa")}</option>
              <option value="daca">{t("statusDaca")}</option>
              <option value="other">{t("statusOther")}</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "…" : t("submit")}
            </Button>
          </div>
        </form>
      </Card>
      ) : null}

      <p className="text-xs text-muted">{tCommon("benefitsDisclaimer")}</p>

      {error ? (
        <p className="text-sm text-red" role="alert">
          {error}
        </p>
      ) : null}

      {programs ? (
        <ul className="space-y-4">
          {earnedIncome && eitcMax != null ? (
            <li>
              <Card className="border-2 border-teal-600/50 bg-teal-500/5 p-6 md:p-8">
                <h3 className="text-xl font-semibold text-ink">{t("eitcTitle")}</h3>
                <p className="mt-2 text-sm text-muted">{t("eitcLead")}</p>
                <p className="mt-3 text-sm font-medium text-ink">{t("eitcWhat")}</p>
                <p className="mt-1 text-sm text-muted">{t("eitcWhatBody")}</p>
                <p className="mt-4 font-figures text-lg text-accent-text">
                  {t("eitcEstimate", {
                    household: String(householdSize),
                    income: annualIncome.toLocaleString(),
                    max: eitcMax.toLocaleString(),
                  })}
                </p>
                <p className="mt-4 text-sm font-medium text-ink">{t("eitcWho")}</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
                  <li>{t("eitcWho1")}</li>
                  <li>{t("eitcWho2")}</li>
                  <li>{t("eitcWho3")}</li>
                  <li>{t("eitcWho4")}</li>
                </ul>
                <p className="mt-4 text-sm font-medium text-ink">{t("eitcVita")}</p>
                <p className="mt-1 text-sm text-muted">{t("eitcVitaBody")}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="https://www.irs.gov/vita"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-accent underline-offset-2 hover:underline"
                  >
                    {t("eitcVitaLink")} ↗
                  </a>
                  <a
                    href="https://www.irs.gov/es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-accent underline-offset-2 hover:underline"
                  >
                    {t("eitcEsLink")} ↗
                  </a>
                </div>
                <p className="mt-4 text-xs text-faint">{t("eitcWarn")}</p>
              </Card>
            </li>
          ) : null}
          {programs.map((p) => (
            <li key={p.id}>
              <Card className="hover:border-border-strong">
                <h3 className="font-semibold text-ink">
                  {t(`programs.${p.id}.name` as never)}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {t(`programs.${p.id}.covers` as never)}
                </p>
                <p className="mt-2 text-sm text-accent-text">
                  {t("match")}: {t(`eligibility.${p.eligibilityKey}` as never)}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {t(`programs.${p.id}.elig` as never)}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {t("langRes")}: {t(`programs.${p.id}.lang` as never)}
                </p>
                <a
                  href={p.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-blue underline-offset-2 hover:underline focus-visible:focus-ring rounded-badge"
                >
                  {t("apply")} ↗
                </a>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("nextStepsTitle")}</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          <li>{t("nextStep1")}</li>
          <li>{t("nextStep2")}</li>
          <li>{t("nextStep3")}</li>
        </ul>
      </Card>

      <EducationalDisclaimer topic="benefits" />
    </div>
  );
}
