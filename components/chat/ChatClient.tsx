"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const LAST_CHAT_KEY = "immifina_last_chat";
/** Skip auto-opening a thread after "New conversation" (see sessionStorage). */
const CHAT_BLANK_INTENT = "immifina_chat_blank";

type Msg = { role: "user" | "assistant"; content: string; at: string };

type ConversationRow = {
  id: string;
  title: string | null;
  language: string | null;
  created_at: string;
};

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    s
  );
}

export function ChatClient() {
  const t = useTranslations("chat");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationParam = searchParams.get("conversation") ?? "";
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollDown = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const refreshConversationList = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations", { credentials: "include" });
      if (!res.ok) return;
      const data = (await res.json()) as { conversations?: ConversationRow[] };
      setConversations(data.conversations ?? []);
    } catch {
      /* ignore */
    }
  }, []);

  const loadMessages = useCallback(
    async (id: string) => {
      setMessagesLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/conversations/${id}`, {
          credentials: "include",
        });
        const data = (await res.json().catch(() => ({}))) as {
          messages?: { role: string; content: string; created_at: string }[];
          error?: string;
        };
        if (!res.ok) {
          setError(
            typeof data.error === "string" ? data.error : t("loadMessagesError")
          );
          return;
        }
        const rows = data.messages ?? [];
        setMessages(
          rows.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
            at: m.created_at,
          }))
        );
        setConversationId(id);
        if (typeof window !== "undefined") {
          localStorage.setItem(LAST_CHAT_KEY, id);
        }
      } catch {
        setError(t("loadMessagesError"));
      } finally {
        setMessagesLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setListLoading(true);
      try {
        const res = await fetch("/api/conversations", { credentials: "include" });
        if (cancelled || !res.ok) return;
        const data = (await res.json()) as { conversations?: ConversationRow[] };
        const list = data.conversations ?? [];
        if (cancelled) return;
        setConversations(list);

        if (
          typeof window !== "undefined" &&
          sessionStorage.getItem(CHAT_BLANK_INTENT) === "1"
        ) {
          sessionStorage.removeItem(CHAT_BLANK_INTENT);
          setMessages([]);
          setConversationId(undefined);
          return;
        }

        let pick: string | undefined;
        if (conversationParam && isUuid(conversationParam)) {
          pick = conversationParam;
        } else if (typeof window !== "undefined") {
          const stored = localStorage.getItem(LAST_CHAT_KEY);
          if (stored && isUuid(stored) && list.some((c) => c.id === stored)) {
            pick = stored;
          }
        }
        if (!pick && list.length > 0) {
          pick = list[0].id;
        }
        if (pick) {
          await loadMessages(pick);
        }
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadMessages, conversationParam]);

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
        credentials: "include",
        body: JSON.stringify({ message: text, conversationId }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        conversationId?: string;
        error?: string;
      };
      if (res.status === 429) {
        setError(t("rateLimited"));
        setMessages((m) => m.slice(0, -1));
        return;
      }
      if (!res.ok) {
        setMessages((m) => m.slice(0, -1));
        setError(
          typeof data.error === "string" && data.error.length > 0
            ? data.error
            : t("error")
        );
        return;
      }
      if (data.conversationId) {
        setConversationId(data.conversationId);
        if (typeof window !== "undefined") {
          localStorage.setItem(LAST_CHAT_KEY, data.conversationId);
        }
      }
      if (data.reply) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: data.reply as string,
            at: new Date().toISOString(),
          },
        ]);
      }
      void refreshConversationList();
    } catch {
      setMessages((m) => m.slice(0, -1));
      setError(t("error"));
    } finally {
      setLoading(false);
      scrollDown();
    }
  }

  function newConversation() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(CHAT_BLANK_INTENT, "1");
      localStorage.removeItem(LAST_CHAT_KEY);
    }
    setMessages([]);
    setConversationId(undefined);
    setError(null);
    router.replace("/chat");
  }

  function selectConversation(id: string) {
    if (id === conversationId) return;
    router.replace(`/chat?conversation=${encodeURIComponent(id)}`);
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      <aside className="shrink-0 md:w-56">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {t("historyTitle")}
        </p>
        <div className="mt-2 max-h-40 overflow-y-auto rounded-control border border-border bg-surface p-1 md:max-h-[min(70vh,640px)]">
          {listLoading ? (
            <p className="px-2 py-3 text-sm text-muted">{t("loadingHistory")}</p>
          ) : conversations.length === 0 ? (
            <p className="px-2 py-3 text-sm text-muted">{t("historyEmpty")}</p>
          ) : (
            <ul className="space-y-0.5">
              {conversations.map((c) => {
                const active = c.id === conversationId;
                const label =
                  (c.title && c.title.trim()) || t("untitledChat");
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => selectConversation(c.id)}
                      className={`w-full rounded-badge px-2 py-2 text-left text-sm transition-colors ${
                        active
                          ? "bg-accent-light font-medium text-accent-text"
                          : "text-ink hover:bg-bg"
                      }`}
                      aria-current={active ? "true" : undefined}
                    >
                      <span className="line-clamp-2">{label}</span>
                      <span className="mt-0.5 block text-xs text-faint">
                        {new Date(c.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[min(70vh,640px)] flex-col rounded-card border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm text-muted">
              {tCommon("language")}:{" "}
              <span className="font-medium text-ink">{locale}</span>
            </p>
            <Button type="button" variant="secondary" onClick={newConversation}>
              {tCommon("newConversation")}
            </Button>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messagesLoading ? (
              <p className="text-sm text-muted">{t("loadingHistory")}</p>
            ) : messages.length === 0 ? (
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
              <p className="animate-pulse text-sm text-muted" role="status">
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
              disabled={messagesLoading}
            />
            <Button type="submit" disabled={loading || messagesLoading}>
              {tCommon("send")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
