import { getTranslations } from "next-intl/server";
import { localeFromParam } from "@/lib/locale-route";

const NAV_KEYS = ["dashboard", "chat", "forecast", "credit", "benefits"] as const;

/** Demo numbers only — illustrative, not user data */
const DEMO = {
  income: 3200,
  expenses: 2400,
  surplus: 800,
  savings: 12400,
  forecast5y: 28450,
  foundationPct: 68,
};

function currencyFormatter(locale: string) {
  const tag =
    locale === "zh" ? "zh-CN" : locale === "es" ? "es-US" : locale === "en" ? "en-US" : locale;
  return new Intl.NumberFormat(tag, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export async function LandingProductMockup({ locale }: { locale: string }) {
  const loc = localeFromParam(locale);
  const tNav = await getTranslations({ locale: loc, namespace: "nav" });
  const tDash = await getTranslations({ locale: loc, namespace: "dashboard" });
  const tl = await getTranslations({ locale: loc, namespace: "landing" });
  const fmt = currencyFormatter(loc);

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-soft backdrop-blur-xl md:rounded-3xl"
      aria-hidden
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white/[0.22]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/[0.22]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/[0.22]" />
        </div>
        <p className="ml-2 truncate text-left text-xs text-teal-200 md:text-sm">
          {tl("logo")} / {tNav("dashboard")}
        </p>
      </div>
      <div className="flex min-h-[220px] flex-col md:min-h-0 md:flex-row">
        <aside className="shrink-0 border-white/10 bg-black/50 p-4 md:w-[12rem] md:border-r">
          <ul className="flex flex-col gap-1 text-left text-xs">
            {NAV_KEYS.map((key) => {
              const active = key === "dashboard";
              return (
                <li
                  key={key}
                  className={
                    active
                      ? "rounded-md border border-teal-500/35 bg-teal-500/15 px-2 py-1.5 font-medium text-teal-200"
                      : "rounded-md px-2 py-1.5 text-teal-300"
                  }
                >
                  {tNav(key)}
                </li>
              );
            })}
          </ul>
        </aside>
        <div className="flex flex-1 flex-col gap-3 p-4 text-left sm:gap-4 md:p-6">
          <div>
            <h3 className="text-sm font-semibold text-teal-100">{tDash("snapshotTitle")}</h3>
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div>
                <dt className="text-xs text-teal-300">{tDash("income")}</dt>
                <dd className="font-figures mt-0.5 text-sm font-medium tabular-nums text-emerald-50 md:text-base">
                  {fmt.format(DEMO.income)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-teal-300">{tDash("expenses")}</dt>
                <dd className="font-figures mt-0.5 text-sm font-medium tabular-nums text-emerald-50 md:text-base">
                  {fmt.format(DEMO.expenses)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-teal-300">{tDash("surplusLabel")}</dt>
                <dd className="font-figures mt-0.5 text-sm font-medium tabular-nums text-teal-200 md:text-base">
                  {fmt.format(DEMO.surplus)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-teal-300">{tDash("savings")}</dt>
                <dd className="font-figures mt-0.5 text-sm font-medium tabular-nums text-emerald-50 md:text-base">
                  {fmt.format(DEMO.savings)}
                </dd>
              </div>
            </dl>
          </div>
          <p className="text-sm leading-relaxed text-teal-100">
            {tDash("quickForecast")}{" "}
            <span className="font-figures font-semibold text-teal-200">
              {fmt.format(DEMO.forecast5y)}
            </span>{" "}
            {tDash("quickForecastNote")}
          </p>
          <div>
            <div className="flex justify-between text-xs text-teal-300">
              <span>{tDash("foundationLabel")}</span>
              <span className="font-figures text-teal-100">{DEMO.foundationPct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-teal-400"
                style={{ width: `${DEMO.foundationPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs leading-snug text-teal-300">{tDash("foundationHint")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
