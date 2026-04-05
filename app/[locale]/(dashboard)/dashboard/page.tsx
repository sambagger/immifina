import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/navigation";
import { localeFromParam } from "@/lib/locale-route";
import { fetchWithSession } from "@/lib/server-fetch";
import { projectSavings } from "@/lib/forecast";
import { Card } from "@/components/ui/Card";
import {
  foundationProgressPct,
  getNextSteps,
  type FinancialProfileRow,
} from "@/lib/onboarding-logic";

const btnSecondary =
  "inline-flex min-h-[44px] items-center justify-center rounded-control border border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent-light hover:border-border-strong active:scale-[0.98] focus-visible:focus-ring";

type ProfileResponse = {
  user: { name: string; email: string };
  profile: FinancialProfileRow | null;
  recentConversations: { id: string; title: string | null; created_at: string }[];
};

export default async function DashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const res = await fetchWithSession("/api/profile");

  if (res.status === 401) {
    redirect("/login");
  }

  if (!res.ok) {
    return (
      <div className="rounded-card border border-amber bg-amber-light p-6 text-amber">
        <p>{t("profileSkeleton")}</p>
      </div>
    );
  }

  const data = (await res.json()) as ProfileResponse;
  const p = data.profile;
  const income = Number(p?.monthly_income ?? 0);
  const expenses = Number(p?.monthly_expenses ?? 0);
  const savings = Number(p?.current_savings ?? 0);
  const surplus = income - expenses;
  const surplusDisplay = Math.max(0, surplus);
  const fiveYear = projectSavings(savings, surplusDisplay, 0.04, 5);
  const projected5 = fiveYear[fiveYear.length - 1] ?? savings;
  const foundation = foundationProgressPct(p);
  const nextSteps = getNextSteps(p);
  const emergencyOneMonth = expenses;
  const emergencySaved = Math.min(savings, emergencyOneMonth);
  const emergencyPct =
    emergencyOneMonth > 0 ? Math.round((emergencySaved / emergencyOneMonth) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink md:text-4xl">
          {t("welcome", { name: data.user.name })}
        </h1>
        <p className="mt-2 text-muted">{t("journeyLead")}</p>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted">
            <span>{t("foundationLabel")}</span>
            <span className="font-figures text-ink">{foundation}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${foundation}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-faint">{t("foundationHint")}</p>
          <details className="mt-3 rounded-control border border-border bg-bg p-3 text-left">
            <summary className="cursor-pointer text-sm font-medium text-ink">
              {t("foundationHowTitle")}
            </summary>
            <p className="mt-2 text-xs text-muted">{t("foundationHowIntro")}</p>
            <ul className="mt-2 list-inside list-disc space-y-1.5 text-xs text-muted">
              <li>{t("foundationPt1")}</li>
              <li>{t("foundationPt2")}</li>
              <li>{t("foundationPt3")}</li>
              <li>{t("foundationPt4")}</li>
              <li>{t("foundationPt5")}</li>
              <li>{t("foundationPt6")}</li>
              <li>{t("foundationPt7")}</li>
            </ul>
          </details>
        </div>
        <p className="mt-4 text-sm text-muted">
          {t("situationHint")}{" "}
          <Link
            href="/settings"
            className="font-medium text-accent underline-offset-2 hover:underline focus-visible:focus-ring rounded-sm"
          >
            {t("updateProfile")}
          </Link>
        </p>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("nextStepsTitle")}</h2>
        <p className="mt-1 text-sm text-muted">{t("nextStepsLead")}</p>
        <ol className="mt-4 space-y-4">
          {nextSteps.map((s, i) => (
            <li
              key={`${s.href}-${i}`}
              className="rounded-control border border-border bg-bg p-4"
            >
              <p className="font-medium text-ink">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.description}</p>
              <Link
                href={s.href}
                className="mt-3 inline-flex text-sm font-medium text-accent underline-offset-2 hover:underline"
              >
                {s.cta}
              </Link>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("snapshotTitle")}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-sm text-muted">{t("income")}</dt>
            <dd className="font-figures mt-1 text-lg text-ink">${income.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{t("expenses")}</dt>
            <dd className="font-figures mt-1 text-lg text-ink">${expenses.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{t("surplusLabel")}</dt>
            <dd
              className={`font-figures mt-1 text-lg ${surplus < 0 ? "text-red" : "text-accent-text"}`}
            >
              ${Math.round(surplus).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{t("savings")}</dt>
            <dd className="font-figures mt-1 text-lg text-ink">${savings.toLocaleString()}</dd>
          </div>
        </dl>
        {surplus < 0 ? (
          <p className="mt-4 rounded-control border border-amber bg-amber-light p-3 text-sm text-amber">
            {t("surplusWarning")}
          </p>
        ) : null}
        <p className="mt-6 text-sm text-muted">
          {t("quickForecast")}{" "}
          <span className="font-figures font-semibold text-accent-text">
            ${projected5.toLocaleString()}
          </span>{" "}
          {t("quickForecastNote")}
        </p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("emergencyTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("emergencyBody", { amount: `$${emergencyOneMonth.toLocaleString()}` })}</p>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted">
            <span>{t("emergencyProgress")}</span>
            <span className="font-figures">{emergencyPct}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-blue"
              style={{ width: `${Math.min(100, emergencyPct)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            {t("emergencySavedLine", {
              saved: `$${emergencySaved.toLocaleString()}`,
              target: `$${emergencyOneMonth.toLocaleString()}`,
            })}
          </p>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-ink">{t("recentChats")}</h2>
        <ul className="mt-3 space-y-2">
          {data.recentConversations.length === 0 ? (
            <li className="text-sm text-muted">{t("noChats")}</li>
          ) : (
            data.recentConversations.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/chat?conversation=${encodeURIComponent(c.id)}`}
                  className="text-sm text-accent underline-offset-2 hover:underline focus-visible:focus-ring rounded-badge px-0.5"
                >
                  {c.title || "Chat"}
                </Link>
                <span className="ml-2 text-xs text-faint">
                  {new Date(c.created_at).toLocaleString()}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-ink">{t("quickActions")}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/settings" className={btnSecondary}>
            {t("updateProfile")}
          </Link>
          <Link href="/forecast" className={btnSecondary}>
            {t("runForecast")}
          </Link>
          <Link href="/benefits" className={btnSecondary}>
            {t("findBenefits")}
          </Link>
        </div>
      </div>
    </div>
  );
}
