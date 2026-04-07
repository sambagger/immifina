"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { US_STATES } from "@/lib/us-states";
import {
  estimatePaycheckDeductions,
  type FilingStatus,
  type PayFrequency,
} from "@/lib/paycheck-estimate";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EducationalDisclaimer } from "@/components/ui/EducationalDisclaimer";

export function PaycheckExplainer() {
  const t = useTranslations("paycheck");
  const [gross, setGross] = useState(2500);
  const [freq, setFreq] = useState<PayFrequency>("monthly");
  const [state, setState] = useState("CA");
  const [filing, setFiling] = useState<FilingStatus>("single");
  const [deps, setDeps] = useState(0);
  const [health, setHealth] = useState(0);
  const [ret401, setRet401] = useState(0);

  const est = useMemo(
    () =>
      estimatePaycheckDeductions(gross, freq, state, filing, deps, health, ret401),
    [gross, freq, state, filing, deps, health, ret401]
  );

  const pctDisplay = String(est.takeHomePct);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-lg font-medium text-ink">{t("hook")}</p>
        <p className="mt-2 text-sm text-muted">{t("subtitle")}</p>
        <p className="mt-2 text-xs text-faint">{t("interactionHint")}</p>
      </div>

      <Card id="paycheck-inputs">
        <h2 className="text-lg font-semibold text-ink">{t("s1Title")}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink">{t("grossLabel")}</label>
            <Input
              type="number"
              min={0}
              value={gross}
              onChange={(e) => setGross(Number(e.target.value))}
              className="mt-1 font-figures"
            />
            <p className="mt-1 text-xs text-faint">{t("grossHelp")}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("freqLabel")}</label>
            <Select
              value={freq}
              onChange={(e) => setFreq(e.target.value as PayFrequency)}
              className="mt-1"
            >
              <option value="weekly">{t("freqWeekly")}</option>
              <option value="biweekly">{t("freqBiweekly")}</option>
              <option value="semimonthly">{t("freqSemi")}</option>
              <option value="monthly">{t("freqMonthly")}</option>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("stateLabel")}</label>
            <Select value={state} onChange={(e) => setState(e.target.value)} className="mt-1">
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </Select>
            <p className="mt-1 text-xs text-faint">{t("stateHelp")}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("filingLabel")}</label>
            <Select
              value={filing}
              onChange={(e) => setFiling(e.target.value as FilingStatus)}
              className="mt-1"
            >
              <option value="single">{t("filingSingle")}</option>
              <option value="mfj">{t("filingMfj")}</option>
              <option value="hoh">{t("filingHoh")}</option>
            </Select>
            <p className="mt-1 text-xs text-faint">{t("filingHelp")}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("depLabel")}</label>
            <Select
              value={String(Math.min(deps, 10))}
              onChange={(e) => setDeps(Number(e.target.value))}
              className="mt-1"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("healthLabel")}</label>
            <Input
              type="number"
              min={0}
              value={health}
              onChange={(e) => setHealth(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("retireLabel")}</label>
            <Input
              type="number"
              min={0}
              value={ret401}
              onChange={(e) => setRet401(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("s2Title")}</h2>
        <p className="mt-2 text-xs text-faint">{t("stubWarn")}</p>

        <div className="mt-6 rounded-control border-2 border-accent/40 bg-accent-light/15 px-4 py-5 text-center md:px-8">
          <p className="text-sm font-medium text-accent-text">{t("heroHighlight", { pct: pctDisplay })}</p>
        </div>

        <div className="mt-6 space-y-3 font-figures text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-ink">{t("stubGross")}</span>
            <span>${est.monthlyGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div>
            <div className="flex justify-between text-red">
              <span>{t("stubFederal")}</span>
              <span>-${est.federal.toLocaleString()}</span>
            </div>
            <p className="mt-1 pl-2 text-xs text-muted">{t("stubFederalInfo")}</p>
          </div>
          <div>
            <div className="flex justify-between text-red">
              <span>{t("stubState")}</span>
              <span>-${est.state.toLocaleString()}</span>
            </div>
            <p className="mt-1 pl-2 text-xs text-muted">{t("stubStateInfo")}</p>
          </div>
          <div>
            <div className="flex justify-between text-red">
              <span>{t("stubSs")}</span>
              <span>-${est.socialSecurity.toLocaleString()}</span>
            </div>
            <p className="mt-1 pl-2 text-xs text-muted">{t("stubSsInfo")}</p>
          </div>
          <div>
            <div className="flex justify-between text-red">
              <span>{t("stubMed")}</span>
              <span>-${est.medicare.toLocaleString()}</span>
            </div>
            <p className="mt-1 pl-2 text-xs text-muted">{t("stubMedInfo")}</p>
          </div>
          {est.health > 0 ? (
            <div className="flex justify-between text-red">
              <span>{t("stubHealth")}</span>
              <span>-${est.health.toLocaleString()}</span>
            </div>
          ) : null}
          {est.retirement > 0 ? (
            <div className="flex justify-between text-red">
              <span>{t("stub401")}</span>
              <span>-${est.retirement.toLocaleString()}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-border pt-3 font-semibold text-ink">
            <span>{t("stubTakeHome")}</span>
            <span>${est.takeHome.toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted">{t("stubPct", { pct: pctDisplay })}</p>
        </div>
      </Card>

      <details className="details-disclosure group rounded-control border border-border bg-surface">
        <summary className="cursor-pointer p-4 font-semibold text-ink">
          {t("formsLearnMore")}
        </summary>
        <div className="border-t border-border p-4 space-y-6">
          <div>
            <h3 className="font-semibold text-ink">{t("s3Title")}</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
              <li>{t("formsW4")}</li>
              <li>{t("formsW2")}</li>
              <li>{t("forms1099")}</li>
            </ul>
            <p className="mt-3 text-sm text-muted">{t("formsVita")}</p>
          </div>
          <div>
            <h3 className="font-semibold text-ink">{t("s4Title")}</h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
              <li>{t("faqRefund")}</li>
              <li>{t("faqMultiJob")}</li>
              <li>{t("faqCash")}</li>
            </ul>
          </div>
        </div>
      </details>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("nextStepsTitle")}</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          <li>{t("nextStep1")}</li>
          <li>{t("nextStep2")}</li>
          <li>{t("nextStep3")}</li>
        </ul>
      </Card>

      <EducationalDisclaimer topic="tax" />
    </div>
  );
}
