"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { Link } from "@/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { LegalFooter } from "@/components/LegalFooter";

function buildSchema(t: (key: string) => string) {
  return z
    .object({
      email: z.string().email().max(255),
      password: z
        .string()
        .min(8)
        .max(128)
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("passwordRules")
        ),
      confirmPassword: z.string(),
      name: z.string().min(1).max(100),
      preferredLanguage: z.enum(["en", "es", "zh"]),
    })
    .refine((d) => d.password === d.confirmPassword, {
      path: ["confirmPassword"],
      message: t("passwordMismatch"),
    });
}

export function RegisterForm() {
  const t = useTranslations("auth");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const schema = useMemo(() => buildSchema(t), [t]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "es" | "zh">("en");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const parsed = schema.safeParse({
      email,
      password,
      confirmPassword,
      name,
      preferredLanguage,
    });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0];
        if (typeof path === "string" && !fe[path]) fe[path] = issue.message;
      }
      setFieldErrors(fe);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: parsed.data.email,
          password: parsed.data.password,
          name: parsed.data.name,
          preferredLanguage: parsed.data.preferredLanguage,
        }),
      });
      const data = await res.json().catch(() => ({}));
      const payload = data as { code?: string };
      if (!res.ok) {
        if (res.status === 429) setError(t("rateLimited"));
        else if (res.status === 409) setError(t("emailTaken"));
        else if (payload.code === "AUTH_MISCONFIGURED") setError(t("authSecretMissing"));
        else if (payload.code === "DATABASE_ERROR") setError(t("registerDbError"));
        else if (res.status === 503 || payload.code === "SERVICE_UNAVAILABLE") {
          setError(t("serviceUnavailable"));
        } else setError(t("genericError"));
        return;
      }
      if (data.success) router.push("/onboarding");
    } catch {
      setError(t("genericError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card variant="glass" className="w-full max-w-md rounded-2xl p-6 md:p-8">
      <h1 className="font-display text-3xl leading-tight text-landing-title md:text-4xl">{t("registerTitle")}</h1>
      <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-landing-body">
            {t("name")}
          </label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
            variant="onDark"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "err-name" : undefined}
          />
          {fieldErrors.name ? (
            <p id="err-name" className="mt-1 text-sm text-red-300" role="alert">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>
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
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "err-email" : undefined}
          />
          {fieldErrors.email ? (
            <p id="err-email" className="mt-1 text-sm text-red-300" role="alert">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-landing-body">
            {t("password")}
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
            variant="onDark"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby="password-hint err-password"
          />
          <p id="password-hint" className="mt-1 text-xs text-zinc-400">
            {t("passwordRules")}
          </p>
          {fieldErrors.password ? (
            <p id="err-password" className="mt-1 text-sm text-red-300" role="alert">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-landing-body">
            {t("confirmPassword")}
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1"
            variant="onDark"
            aria-invalid={Boolean(fieldErrors.confirmPassword)}
            aria-describedby={fieldErrors.confirmPassword ? "err-confirm" : undefined}
          />
          {fieldErrors.confirmPassword ? (
            <p id="err-confirm" className="mt-1 text-sm text-red-300" role="alert">
              {fieldErrors.confirmPassword}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="preferredLanguage" className="block text-sm font-medium text-landing-body">
            {t("preferredLanguage")}
          </label>
          <Select
            id="preferredLanguage"
            name="preferredLanguage"
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value as "en" | "es" | "zh")}
            className="mt-1"
            variant="onDark"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="zh">中文（简体）</option>
          </Select>
        </div>
        {error ? (
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        ) : null}
        <p className="text-xs leading-relaxed text-zinc-400">
          {t.rich("agreeToTerms", {
            terms: (chunks) => (
              <Link href="/terms" className="text-landing-title underline-offset-2 hover:text-white">
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link href="/privacy" className="text-landing-title underline-offset-2 hover:text-white">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <Button
          type="submit"
          className="w-full rounded-full border border-white/25 py-3.5 text-sm font-semibold shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
          disabled={loading}
        >
          {loading ? "…" : t("submitRegister")}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-300">
        <Link
          href="/login"
          className="font-medium text-landing-title underline-offset-2 transition-colors hover:text-white"
        >
          {tNav("login")}
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
