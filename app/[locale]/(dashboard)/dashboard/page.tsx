import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/navigation";
import { fetchWithSession } from "@/lib/server-fetch";
import { projectSavings } from "@/lib/forecast";
import { Card } from "@/components/ui/Card";

const btnSecondary =
  "inline-flex min-h-[44px] items-center justify-center rounded-control border border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent-light hover:border-border-strong active:scale-[0.98] focus-visible:focus-ring";

type ProfileResponse = {
  user: { name: string; email: string };
  profile: {
    monthly_income: number;
    monthly_expenses: number;
    current_savings: number;
    monthly_savings_goal: number;
  } | null;
  recentConversations: { id: string; title: string | null; created_at: string }[];
};

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
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
  const surplus = Math.max(0, income - expenses);
  const fiveYear = projectSavings(savings, surplus, 0.04, 5);
  const projected5 = fiveYear[fiveYear.length - 1] ?? savings;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink md:text-4xl">
          {t("welcome", { name: data.user.name })}
        </h1>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("summaryTitle")}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-sm text-muted">{t("income")}</dt>
            <dd className="font-figures mt-1 text-lg text-ink">
              ${income.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{t("expenses")}</dt>
            <dd className="font-figures mt-1 text-lg text-ink">
              ${expenses.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{t("savings")}</dt>
            <dd className="font-figures mt-1 text-lg text-ink">
              ${savings.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{t("goal")}</dt>
            <dd className="font-figures mt-1 text-lg text-ink">
              ${Number(p?.monthly_savings_goal ?? 0).toLocaleString()}
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-sm text-muted">
          {t("quickForecast")}{" "}
          <span className="font-figures font-semibold text-accent-text">
            ${projected5.toLocaleString()}
          </span>{" "}
          (4% growth, surplus saved).
        </p>
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
                  href="/chat"
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
