"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { US_STATES } from "@/lib/us-states";

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/benefits", {
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

  return (
    <div className="space-y-8">
      <p className="text-muted">{t("subtitle")}</p>
      <p className="text-sm text-muted">{t("privacyLead")}</p>
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

      <p className="text-xs text-muted">{tCommon("benefitsDisclaimer")}</p>

      {error ? (
        <p className="text-sm text-red" role="alert">
          {error}
        </p>
      ) : null}

      {programs ? (
        <ul className="space-y-4">
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
    </div>
  );
}
