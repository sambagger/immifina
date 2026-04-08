"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { LegalFooter } from "@/components/LegalFooter";
import { apiFetch } from "@/lib/api";

const ClientLoginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(128),
});

export function LoginForm() {
  const t = useTranslations("auth");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = ClientLoginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(t("invalidCredentials"));
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as {
        code?: string;
        success?: boolean;
      };
      if (!res.ok) {
        if (res.status === 429) setError(t("rateLimited"));
        else if (data.code === "AUTH_MISCONFIGURED") {
          setError(t("authSecretMissing"));
        } else if (
          res.status === 503 ||
          data.code === "SERVICE_UNAVAILABLE" ||
          data.code === "DATABASE_ERROR"
        ) {
          setError(
            data.code === "DATABASE_ERROR" ? t("authDbError") : t("serviceUnavailable")
          );
        } else if (res.status === 401 && data.code === "INVALID_CREDENTIALS") {
          setError(t("invalidCredentials"));
        } else if (res.status >= 500) {
          setError(t("genericError"));
        } else setError(t("invalidCredentials"));
        return;
      }
      if (data.success) router.push("/dashboard");
    } catch {
      setError(t("genericError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card variant="glass" className="w-full max-w-md rounded-2xl p-6 md:p-8">
      <h1 className="font-display text-3xl leading-tight text-landing-title md:text-4xl">{t("loginTitle")}</h1>
      <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-landing-body">
            {t("email")}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
            variant="onDark"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-landing-body">
            {t("password")}
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
            variant="onDark"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>
        {error ? (
          <div id="login-error" role="alert" className="flex items-start gap-2 rounded-control border border-red-500/30 bg-red-500/10 px-3 py-2.5">
            <span className="mt-px text-red-400" aria-hidden>✕</span>
            <p className="text-sm font-medium text-red-400">{error}</p>
          </div>
        ) : null}
        <Button
          type="submit"
          className="w-full rounded-full border border-white/25 py-3.5 text-sm font-semibold shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
          disabled={loading}
        >
          {loading ? "…" : t("submitLogin")}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-landing-title underline-offset-2 transition-colors hover:text-white"
        >
          {t("forgotLink")}
        </Link>
      </p>
      <p className="mt-6 text-center text-sm text-zinc-300">
        <Link
          href="/register"
          className="font-medium text-landing-title underline-offset-2 transition-colors hover:text-white"
        >
          {tNav("register")}
        </Link>
      </p>
      <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
        <p className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-center text-xs text-zinc-400">
          <Link href="/terms" className="transition-colors hover:text-white">
            {tCommon("termsOfService")}
          </Link>
          <span aria-hidden className="text-zinc-600">
            ·
          </span>
          <Link href="/privacy" className="transition-colors hover:text-white">
            {tCommon("privacyPolicy")}
          </Link>
        </p>
        <LegalFooter variant="onDark" />
        <p className="text-center text-xs text-zinc-500">{tCommon("copyright")}</p>
      </div>
    </Card>
  );
}
