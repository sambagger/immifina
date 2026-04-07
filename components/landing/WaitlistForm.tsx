"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/** Simple format check before submit (backend uses Zod). */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistForm() {
  const t = useTranslations("common");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);
    setSubmitError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setFieldError(t("waitlistEmailRequired"));
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setFieldError(t("waitlistEmailInvalid"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      let data: { success?: boolean } = {};
      try {
        data = (await res.json()) as { success?: boolean };
      } catch {
        /* ignore */
      }

      if (res.ok && data.success) {
        setDone(true);
        return;
      }

      setSubmitError(t("waitlistErrorGeneric"));
    } catch {
      setSubmitError(t("waitlistErrorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="text-center text-sm text-white" role="status">
        {t("waitlistSuccessLine")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-3" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Input
            type="email"
            name="email"
            autoComplete="email"
            placeholder={t("waitlistPlaceholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldError(null);
              setSubmitError(null);
            }}
            disabled={loading}
            aria-invalid={Boolean(fieldError)}
            aria-describedby={fieldError ? "waitlist-email-error" : undefined}
            aria-label={t("waitlistPlaceholder")}
            className="w-full"
          />
          {fieldError ? (
            <p id="waitlist-email-error" className="text-xs text-red-600 dark:text-red-400" role="alert">
              {fieldError}
            </p>
          ) : null}
        </div>
        <Button type="submit" variant="secondary" disabled={loading} className="w-full shrink-0 sm:w-auto">
          {loading ? t("waitlistJoining") : t("waitlistCta")}
        </Button>
      </div>
      {submitError ? (
        <p className="text-center text-sm text-red-600 dark:text-red-400" role="alert">
          {submitError}
        </p>
      ) : null}
    </form>
  );
}
