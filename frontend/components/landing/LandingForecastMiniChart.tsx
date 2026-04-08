"use client";

import { useMemo } from "react";
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
import { projectSavings } from "@/lib/forecast";

/** Same projection logic as Forecast — demo inputs only */
const DEMO = {
  start: 5000,
  monthlySave: 380,
  years: 5,
};

export function LandingForecastMiniChart({ className = "" }: { className?: string }) {
  const t = useTranslations("forecast");
  const data = useMemo(() => {
    const saving = projectSavings(DEMO.start, DEMO.monthlySave, 0.04, DEMO.years);
    const nosave = projectSavings(DEMO.start, 0, 0.04, DEMO.years);
    return saving.map((v, i) => ({
      year: i,
      saving: v,
      nosave: nosave[i] ?? v,
    }));
  }, []);

  return (
    <div className={`h-[148px] w-full min-w-0 md:h-[160px] ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: 4, bottom: 4 }}
        >
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: "#d4d4d8", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
          />
          <YAxis
            tick={{ fill: "#d4d4d8", fontSize: 10, dx: -1 }}
            tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
            width={52}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.85)",
              fontSize: 12,
            }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
            formatter={(value) => <span className="text-zinc-200">{value}</span>}
          />
          <Line
            type="monotone"
            dataKey="saving"
            name={t("chartSaving")}
            stroke="#34d399"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="nosave"
            name={t("chartNoSave")}
            stroke="rgba(148,163,184,0.65)"
            strokeDasharray="5 4"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
