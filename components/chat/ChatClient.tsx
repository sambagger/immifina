"use client";

import { useCallback, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Msg = { role: "user" | "assistant"; content: string; at: string };

export function ChatClient() {
  const t = useTranslations("chat");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollDown = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError(null);
    const at = new Date().toISOString();
    setMessages((m) => [...m, { role: "user", content: text, at }]);
    setLoading(true);
    scrollDown();
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        conversationId?: string;
        error?: string;
      };
      if (res.status === 429) {
        setError(t("rateLimited"));
        return;
      }
      if (!res.ok) {
        setError(
          typeof data.error === "string" && data.error.length > 0
            ? data.error
            : t("error")
        );
        return;
      }
      if (data.conversationId) setConversationId(data.conversationId);
      if (data.reply) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.reply as string, at: new Date().toISOString() },
        ]);
      }
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
      scrollDown();
    }
  }

  function newConversation() {
    setMessages([]);
    setConversationId(undefined);
    setError(null);
  }

  return (
    <div className="flex h-[min(70vh,640px)] flex-col rounded-card border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm text-muted">
          {tCommon("language")}: <span className="font-medium text-ink">{locale}</span>
        </p>
        <Button type="button" variant="secondary" onClick={newConversation}>
          {tCommon("newConversation")}
        </Button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted">{t("empty")}</p>
        ) : (
          messages.map((m, i) => (
            <div
              key={`${m.at}-${i}`}
              className={`max-w-[90%] rounded-control border px-3 py-2 text-sm ${
                m.role === "user"
                  ? "ml-auto border-border-strong bg-accent-light text-accent-text"
                  : "border-border bg-bg text-ink"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
              <time className="mt-1 block text-xs text-faint" dateTime={m.at}>
                {new Date(m.at).toLocaleString()}
              </time>
            </div>
          ))
        )}
        {loading ? (
          <p className="text-sm text-muted animate-pulse" role="status">
            {t("thinking")}
          </p>
        ) : null}
        {error ? (
          <p className="whitespace-pre-wrap text-sm text-red" role="alert">
            {error}
          </p>
        ) : null}
        <div ref={bottomRef} />
      </div>
      <form
        className="flex gap-2 border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          className="flex-1"
          maxLength={2000}
        />
        <Button type="submit" disabled={loading}>
          {tCommon("send")}
        </Button>
      </form>
    </div>
  );
}
