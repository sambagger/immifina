"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { EducationalDisclaimer } from "@/components/ui/EducationalDisclaimer";
import { apiFetch } from "@/lib/api";

const LAST_CHAT_KEY = "immifina_last_chat";
const CHAT_BLANK_INTENT = "immifina_chat_blank";

type Msg = { role: "user" | "assistant"; content: string; at: string };
type ConversationRow = { id: string; title: string | null; language: string | null; created_at: string };

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
}

const STARTER_PROMPTS = [
  "How do I open a bank account without a Social Security Number?",
  "What is a secured credit card and how does it help build credit?",
  "How do I read my first US paycheck?",
  "What government benefits can I apply for as an immigrant?",
  "How do I send money home cheaply and safely?",
  "What is the difference between an SSN and an ITIN?",
];

export function ChatClient() {
  const t = useTranslations("chat");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationParam = searchParams.get("conversation") ?? "";
  const preloadedQuestion = searchParams.get("q") ?? "";
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollDown = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const refreshConversationList = useCallback(async () => {
    try {
      const res = await apiFetch("/conversations");
      if (!res.ok) return;
      const data = (await res.json()) as { conversations?: ConversationRow[] };
      setConversations(data.conversations ?? []);
    } catch { /* ignore */ }
  }, []);

  const loadMessages = useCallback(async (id: string) => {
    setMessagesLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/conversations/${id}`);
      const data = (await res.json().catch(() => ({}))) as {
        messages?: { role: string; content: string; created_at: string }[];
        error?: string;
      };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : t("loadMessagesError"));
        return;
      }
      setMessages((data.messages ?? []).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
        at: m.created_at,
      })));
      setConversationId(id);
      if (typeof window !== "undefined") localStorage.setItem(LAST_CHAT_KEY, id);
    } catch {
      setError(t("loadMessagesError"));
    } finally {
      setMessagesLoading(false);
    }
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setListLoading(true);
      try {
        const res = await apiFetch("/conversations");
        if (cancelled || !res.ok) return;
        const data = (await res.json()) as { conversations?: ConversationRow[] };
        const list = data.conversations ?? [];
        if (cancelled) return;
        setConversations(list);

        if (typeof window !== "undefined" && sessionStorage.getItem(CHAT_BLANK_INTENT) === "1") {
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
          if (stored && isUuid(stored) && list.some((c) => c.id === stored)) pick = stored;
        }
        if (!pick && list.length > 0) pick = list[0].id;
        if (pick) await loadMessages(pick);
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [loadMessages, conversationParam]);

  // Auto-send pre-loaded question from ?q= URL param (e.g., from Journey card "Ask ImmiFina")
  const hasSentPreload = useRef(false);
  useEffect(() => {
    if (!preloadedQuestion || hasSentPreload.current || listLoading) return;
    hasSentPreload.current = true;
    // Start a fresh conversation
    setMessages([]);
    setConversationId(undefined);
    // Small delay so the UI renders the blank state first
    const t = setTimeout(() => send(preloadedQuestion), 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preloadedQuestion, listLoading]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setError(null);
    const at = new Date().toISOString();
    setMessages((m) => [...m, { role: "user", content: msg, at }]);
    setLoading(true);
    setTimeout(scrollDown, 50);
    try {
      const res = await apiFetch("/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, conversationId }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        reply?: string; conversationId?: string; error?: string;
      };
      if (res.status === 429) {
        setError(t("rateLimited"));
        setMessages((m) => m.slice(0, -1));
        return;
      }
      if (!res.ok) {
        setMessages((m) => m.slice(0, -1));
        setError(typeof data.error === "string" && data.error.length > 0 ? data.error : t("error"));
        return;
      }
      if (data.conversationId) {
        setConversationId(data.conversationId);
        if (typeof window !== "undefined") localStorage.setItem(LAST_CHAT_KEY, data.conversationId);
      }
      if (data.reply) {
        setMessages((m) => [...m, { role: "assistant", content: data.reply as string, at: new Date().toISOString() }]);
      }
      void refreshConversationList();
    } catch {
      setMessages((m) => m.slice(0, -1));
      setError(t("error"));
    } finally {
      setLoading(false);
      setTimeout(scrollDown, 50);
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

  const isEmpty = !messagesLoading && messages.length === 0;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      {/* Sidebar */}
      <aside className="shrink-0 md:w-52">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {t("historyTitle")}
          </p>
          <button
            type="button"
            onClick={newConversation}
            className="rounded-badge border border-white/15 bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            + New
          </button>
        </div>
        <div className="max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-1 md:max-h-[min(70vh,600px)]">
          {listLoading ? (
            <p className="px-2 py-3 text-sm text-zinc-500">{t("loadingHistory")}</p>
          ) : conversations.length === 0 ? (
            <p className="px-2 py-3 text-sm text-zinc-500">{t("historyEmpty")}</p>
          ) : (
            <ul className="space-y-0.5">
              {conversations.map((c) => {
                const active = c.id === conversationId;
                const label = (c.title && c.title.trim()) || t("untitledChat");
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => selectConversation(c.id)}
                      className={`w-full rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                        active
                          ? "bg-teal-950/60 font-medium text-landing-title"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }`}
                      aria-current={active ? "true" : undefined}
                    >
                      <span className="line-clamp-2 leading-snug">{label}</span>
                      <span className="mt-0.5 block text-[10px] text-zinc-600">
                        {new Date(c.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* Main chat */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[min(72vh,660px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-xs font-medium text-zinc-500">
              {tCommon("language")}: <span className="text-zinc-300">{locale.toUpperCase()}</span>
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messagesLoading ? (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="animate-pulse">●</span> {t("loadingHistory")}
              </div>
            ) : isEmpty ? (
              <div className="flex h-full flex-col items-center justify-center gap-6 py-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-300">{t("empty")}</p>
                  <p className="mt-1 text-xs text-zinc-500">Try one of these to get started:</p>
                </div>
                <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => { setInput(prompt); inputRef.current?.focus(); }}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left text-xs leading-snug text-zinc-400 transition-colors hover:border-teal-500/30 hover:bg-teal-950/40 hover:text-zinc-200"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={`${m.at}-${i}`}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-teal-900/70 text-white"
                        : "rounded-bl-sm border border-white/10 bg-white/[0.06] text-zinc-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    <time className="mt-1.5 block text-[10px] opacity-40" dateTime={m.at}>
                      {new Date(m.at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                    </time>
                  </div>
                </div>
              ))
            )}

            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.06] px-4 py-3">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2.5" role="alert">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            className="border-t border-white/10 p-3"
            onSubmit={(e) => { e.preventDefault(); void send(); }}
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
                rows={1}
                maxLength={2000}
                disabled={messagesLoading}
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-teal-500/50 disabled:opacity-50"
                style={{ maxHeight: "160px" }}
              />
              <button
                type="submit"
                disabled={loading || messagesLoading || !input.trim()}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1d6b4f] text-white transition-[background-color,opacity] hover:bg-[#185a42] disabled:opacity-40"
                aria-label={tCommon("send")}
              >
                <svg className="h-4 w-4 rotate-90" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-zinc-600 text-right">Enter to send · Shift+Enter for new line</p>
          </form>
        </div>

        <EducationalDisclaimer topic="general" className="mt-4 shrink-0" />
      </div>
    </div>
  );
}
