"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { LegalFooter } from "@/components/LegalFooter";
import { apiFetch } from "@/lib/api";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.status === 429) {
        setError(t("forgotRateLimited"));
        return;
      }
      // Always show success (don't reveal if email exists)
      setSent(true);
    } catch {
      setError(t("forgotError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card variant="glass" className="w-full max-w-md rounded-2xl p-6 md:p-8">
      <h1 className="font-display text-3xl leading-tight text-landing-title md:text-4xl">
        {t("forgotTitle")}
      </h1>

      {sent ? (
        <p className="mt-6 text-sm leading-relaxed text-zinc-300">{t("forgotSuccess")}</p>
      ) : (
        <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-landing-body">
              {t("forgotEmailLabel")}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("forgotEmailPlaceholder")}
              className="mt-1"
              variant="onDark"
              required
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
            {loading ? t("forgotSending") : t("forgotSubmit")}
          </Button>
        </form>
      )}

      <p className="mt-8">
        <Link
          href="/login"
          className="text-sm font-medium text-landing-title underline-offset-2 transition-colors hover:text-white focus-visible:focus-ring rounded-badge px-1"
        >
          {t("backToLogin")}
        </Link>
      </p>

      <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
        <p className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-center text-xs text-zinc-400">
          <Link href="/terms" className="transition-colors hover:text-white">
            {tc("termsOfService")}
          </Link>
          <span aria-hidden className="text-zinc-600">·</span>
          <Link href="/privacy" className="transition-colors hover:text-white">
            {tc("privacyPolicy")}
          </Link>
        </p>
        <LegalFooter variant="onDark" />
        <p className="text-center text-xs text-zinc-500">{tc("copyright")}</p>
      </div>
    </Card>
  );
}
