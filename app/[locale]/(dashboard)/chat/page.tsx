import { getTranslations } from "next-intl/server";
import { ChatClient } from "@/components/chat/ChatClient";

export default async function ChatPage() {
  const t = await getTranslations("chat");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-3xl text-ink md:text-4xl">{t("title")}</h1>
      <ChatClient />
    </div>
  );
}
