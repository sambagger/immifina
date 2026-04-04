"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function WaitlistForm() {
  const t = useTranslations("common");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  if (done) {
    return (
      <p className="text-center text-sm text-accent-text" role="status">
        {t("waitlistThanks")}
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
    >
      <Input
        type="email"
        name="email"
        autoComplete="email"
        placeholder={t("waitlistPlaceholder")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label={t("waitlistPlaceholder")}
        className="flex-1"
      />
      <Button type="submit" variant="secondary">
        {t("waitlistCta")}
      </Button>
    </form>
  );
}
