"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { getRemittanceRows, REMITTANCE_COUNTRIES, type DeliveryMethod } from "@/lib/remittance-data";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { EducationalDisclaimer } from "@/components/ui/EducationalDisclaimer";

export function RemittanceClient() {
  const t = useTranslations("remittance");
  const tCommon = useTranslations("common");
  const [amount, setAmount] = useState(500);
  const [country, setCountry] = useState("MX");
  const [method, setMethod] = useState<DeliveryMethod>("bank");

  const rows = useMemo(
    () => getRemittanceRows(amount, country, method),
    [amount, country, method]
  );

  return (
    <div className="space-y-8">
      <p className="text-muted">{t("subtitle")}</p>
      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("introTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("introBody")}</p>
      </Card>
      <p className="text-xs text-muted">{tCommon("remittanceDisclaimer")}</p>

      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-ink">{t("amount")}</label>
            <Input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 font-figures"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("country")}</label>
            <Select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1"
            >
              {REMITTANCE_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {t(`countries.${c.nameKey}` as never)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink">{t("method")}</label>
            <Select
              value={method}
              onChange={(e) => setMethod(e.target.value as DeliveryMethod)}
              className="mt-1"
            >
              <option value="bank">{t("methodBank")}</option>
              <option value="cash">{t("methodCash")}</option>
              <option value="wallet">{t("methodWallet")}</option>
            </Select>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted">
          {method === "bank"
            ? t("bankHelp")
            : method === "cash"
              ? t("cashHelp")
              : t("walletHelp")}
        </p>
      </Card>

      <Card>
        <p className="mb-4 text-xs text-faint">{t("updated")}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-semibold text-ink">{t("tableProvider")}</th>
                <th className="py-2 pr-4 font-semibold text-ink">{t("tableFee")}</th>
                <th className="py-2 pr-4 font-semibold text-ink">{t("tableFx")}</th>
                <th className="py-2 pr-4 font-semibold text-ink">{t("tableGets")}</th>
                <th className="py-2 pr-4 font-semibold text-ink">{t("tableSpeed")}</th>
                <th className="py-2 font-semibold text-ink">{t("tableRating")}</th>
                <th className="py-2 pl-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-border">
                  <td className="py-3 pr-4 text-ink">{r.name}</td>
                  <td className="font-figures py-3 pr-4">${r.feeUsd.toFixed(2)}</td>
                  <td className="py-3 pr-4 text-muted">{r.exchangeRateNote}</td>
                  <td className="font-figures py-3 pr-4 text-accent-text">
                    ${r.recipientGetsUsd.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-muted">{r.speed}</td>
                  <td className="font-figures py-3">{r.rating}</td>
                  <td className="py-3 pl-2">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-accent underline-offset-2 hover:underline focus-visible:focus-ring rounded-badge px-1"
                    >
                      {t("link")}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("timingTitle")}</h2>
        <p className="mt-3 whitespace-pre-line text-sm text-muted">{t("timingBody")}</p>
        <p className="mt-4 text-xs text-faint">{t("timingNote")}</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("tipsTitle")}</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
          <li>{t("tip1")}</li>
          <li>{t("tip2")}</li>
          <li>{t("tip3")}</li>
          <li>{t("tip4")}</li>
          <li>{t("tip5")}</li>
          <li>{t("tip6")}</li>
        </ul>
      </Card>

      <details className="details-disclosure group rounded-control border border-border bg-surface">
        <summary className="cursor-pointer p-4 font-semibold text-ink">
          {t("recurringTitle")}
        </summary>
        <div className="border-t border-border p-4">
          <p className="whitespace-pre-line text-sm text-muted">{t("recurringBody")}</p>
          <p className="mt-4 text-xs text-faint">{t("recurringNote")}</p>
        </div>
      </details>

      <EducationalDisclaimer topic="remittance" />
    </div>
  );
}
