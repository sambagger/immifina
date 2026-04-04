"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";

function estimateRange(payment: number, util: number, age: number, mix: number, inq: number) {
  const p = payment / 100;
  const u = 1 - util / 100;
  const a = age / 100;
  const m = mix / 100;
  const i = 1 - Math.min(inq, 5) / 5;
  const raw = p * 220 + u * 160 + a * 140 + m * 80 + i * 100;
  const mid = 300 + (raw / 700) * 550;
  const spread = 40;
  return {
    low: Math.round(Math.max(300, mid - spread)),
    high: Math.round(Math.min(850, mid + spread)),
  };
}

export function CreditSimulator() {
  const t = useTranslations("credit");
  const [payment, setPayment] = useState(70);
  const [util, setUtil] = useState(40);
  const [age, setAge] = useState(30);
  const [mix, setMix] = useState(40);
  const [inq, setInq] = useState(2);

  const range = useMemo(
    () => estimateRange(payment, util, age, mix, inq),
    [payment, util, age, mix, inq]
  );

  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">{t("simTitle")}</h2>
      <p className="mt-2 text-sm text-muted">{t("simHint")}</p>
      <div className="mt-6 space-y-5">
        {[
          { label: t("simPayment"), v: payment, set: setPayment },
          { label: t("simUtil"), v: util, set: setUtil },
          { label: t("simAge"), v: age, set: setAge },
          { label: t("simMix"), v: mix, set: setMix },
          { label: t("simInq"), v: inq, set: setInq, max: 10 },
        ].map((row) => (
          <div key={row.label}>
            <label className="flex justify-between text-sm text-ink">
              <span>{row.label}</span>
              <span className="font-figures text-muted">{row.v}</span>
            </label>
            <input
              type="range"
              min={0}
              max={"max" in row ? row.max : 100}
              value={row.v}
              onChange={(e) => row.set(Number(e.target.value))}
              className="mt-2 w-full accent-accent"
            />
          </div>
        ))}
      </div>
      <p className="mt-6 font-figures text-lg text-accent-text">
        {t("simEstimated", { low: range.low, high: range.high })}
      </p>
    </Card>
  );
}
