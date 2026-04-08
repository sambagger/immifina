import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { localeFromParam } from "@/lib/locale-route";
import { ChatClient } from "@/components/chat/ChatClient";

export default async function ChatPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "chat" });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-3xl text-ink md:text-4xl">{t("title")}</h1>
      <Suspense
        fallback={
          <p className="text-sm text-muted" aria-live="polite">
            {t("loadingHistory")}
          </p>
        }
      >
        <ChatClient />
      </Suspense>
    </div>
  );
}
