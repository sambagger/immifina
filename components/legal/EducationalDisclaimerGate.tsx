"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const STORAGE_KEY = "immifina_edu_ack_v1";

function useBodyScrollLock(locked: boolean) {
  useLayoutEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export function EducationalDisclaimerGate({ children }: { children: ReactNode }) {
  const t = useTranslations("common");
  const [ack, setAck] = useState<boolean | null>(null);
  const [checked, setChecked] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    try {
      setAck(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setAck(false);
    }
  }, []);

  const pending = ack === null;
  const showGate = ack === false;
  useBodyScrollLock(showGate);

  useLayoutEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.inert = pending || showGate;
  }, [pending, showGate]);

  function confirm() {
    if (!checked) return;
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setAck(true);
  }

  return (
    <>
      <div
        ref={mainRef}
        className={pending ? "invisible" : ""}
        aria-hidden={pending || showGate}
      >
        {children}
      </div>

      {pending && (
        <div
          className="fixed inset-0 z-[100] bg-bg"
          aria-busy="true"
          aria-live="polite"
        />
      )}

      {showGate && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-[2px]"
          role="presentation"
        >
          <div
            className="relative w-full max-w-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edu-ack-title"
            aria-describedby="edu-ack-desc"
          >
            <Card className="shadow-lg">
              <h2 id="edu-ack-title" className="font-display text-xl font-semibold text-ink">
                {t("eduAckTitle")}
              </h2>
              <p id="edu-ack-desc" className="mt-3 text-sm leading-relaxed text-muted">
                {t("eduAckBody")}
              </p>
              <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-border text-accent focus-visible:focus-ring"
                />
                <span>{t("eduAckCheckbox")}</span>
              </label>
              <div className="mt-6 flex justify-end">
                <Button type="button" disabled={!checked} onClick={confirm}>
                  {t("eduAckCta")}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
