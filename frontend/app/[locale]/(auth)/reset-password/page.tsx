"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { LegalFooter } from "@/components/LegalFooter";
import { apiFetch } from "@/lib/api";

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError(t("resetPasswordMismatch"));
      return;
    }
    if (!token) {
      setError(t("resetPasswordInvalidToken"));
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { code?: string };
        if (data.code === "INVALID_TOKEN" || data.code === "TOKEN_EXPIRED") {
          setError(t("resetPasswordInvalidToken"));
        } else if (data.code === "VALIDATION_FAILED") {
          setError(t("resetPasswordInvalidPassword"));
        } else {
          setError(t("resetPasswordError"));
        }
        return;
      }
      setDone(true);
    } catch {
      setError(t("resetPasswordError"));
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <Card variant="glass" className="w-full max-w-md rounded-2xl p-6 md:p-8">
        <p className="text-sm text-red-300">{t("resetPasswordInvalidToken")}</p>
        <Link href="/forgot-password" className="mt-4 block text-sm font-medium text-landing-title hover:text-white">
          {t("forgotTitle")}
        </Link>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="w-full max-w-md rounded-2xl p-6 md:p-8">
      <h1 className="font-display text-3xl leading-tight text-landing-title md:text-4xl">
        {t("resetPasswordTitle")}
      </h1>

      {done ? (
        <div className="mt-6 space-y-4">
          <p className="text-sm leading-relaxed text-zinc-300">{t("resetPasswordSuccess")}</p>
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/25 bg-[#1d6b4f] px-6 text-sm font-semibold text-white hover:bg-[#185a42] focus-visible:focus-ring"
          >
            {t("submitLogin")}
          </Link>
        </div>
      ) : (
        <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-landing-body">
              {t("resetPasswordNewLabel")}
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 ${error ? "!border-red-500/70 !ring-red-500/30" : ""}`}
              variant="onDark"
              aria-invalid={Boolean(error)}
            />
            {!error && <p className="mt-1 text-xs text-zinc-400">{t("passwordRules")}</p>}
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-landing-body">
              {t("resetPasswordConfirmLabel")}
            </label>
            <Input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`mt-1 ${error ? "!border-red-500/70 !ring-red-500/30" : ""}`}
              variant="onDark"
              aria-invalid={Boolean(error)}
            />
          </div>
          {error ? (
            <div className="flex items-start gap-2 rounded-control border border-red-500/30 bg-red-500/10 px-3 py-2.5" role="alert">
              <span className="mt-px text-red-400" aria-hidden>✕</span>
              <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
          ) : null}
          <Button
            type="submit"
            className="w-full rounded-full border border-white/25 py-3.5 text-sm font-semibold shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
            disabled={loading}
          >
            {loading ? t("resetPasswordSaving") : t("resetPasswordSubmit")}
          </Button>
        </form>
      )}

      <div className="mt-8 space-y-3 border-t border-white/10 pt-4">
        <LegalFooter variant="onDark" />
        <p className="text-center text-xs text-zinc-500">{tc("copyright")}</p>
      </div>
    </Card>
  );
}
