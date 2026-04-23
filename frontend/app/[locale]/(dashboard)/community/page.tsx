"use client";

import { useState, useEffect, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { EducationalDisclaimer } from "@/components/ui/EducationalDisclaimer";

type Post = {
  id: string;
  content: string;
  category: string;
  visa_tag: string | null;
  upvote_count: number;
  answer_count: number;
  created_at: string;
  hasVoted: boolean;
};

type Answer = {
  id: string;
  content: string;
  upvote_count: number;
  is_accepted: boolean;
  created_at: string;
};

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "credit", label: "Credit" },
  { id: "banking", label: "Banking" },
  { id: "taxes", label: "Taxes" },
  { id: "remittance", label: "Remittance" },
  { id: "general", label: "General" },
];

const VISA_TAGS = [
  { id: "h1b", label: "H-1B" },
  { id: "green_card", label: "Green Card" },
  { id: "daca", label: "DACA" },
  { id: "f1", label: "F-1" },
  { id: "other", label: "Other" },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const CATEGORY_COLORS: Record<string, string> = {
  credit: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
  banking: "text-sky-400 bg-sky-950/40 border-sky-800/40",
  taxes: "text-amber-400 bg-amber-950/40 border-amber-800/40",
  remittance: "text-purple-400 bg-purple-950/40 border-purple-800/40",
  general: "text-zinc-400 bg-zinc-800/40 border-zinc-700/40",
};

// ── Answer thread ─────────────────────────────────────────────
function AnswerThread({ postId, canPost, onClose }: { postId: string; canPost: boolean; onClose: () => void }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    apiFetch(`/community/${postId}/answer`)
      .then((r) => r.json())
      .then((d: { answers: Answer[] }) => setAnswers(d.answers ?? []))
      .finally(() => setLoading(false));
    textareaRef.current?.focus();
  }, [postId]);

  async function submit() {
    if (!draft.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await apiFetch(`/community/${postId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft.trim() }),
      });
      if (res.ok) {
        const data = (await res.json()) as { answer: Answer };
        setAnswers((prev) => [...prev, data.answer]);
        setDraft("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-3 border-t border-white/8 pt-3 space-y-3">
      {loading ? (
        <p className="text-xs text-zinc-500">Loading answers…</p>
      ) : answers.length === 0 ? (
        <p className="text-xs text-zinc-500">No answers yet. Be the first to help.</p>
      ) : (
        <div className="space-y-2">
          {answers.map((a) => (
            <div key={a.id} className={`rounded-lg px-3 py-2.5 text-sm ${a.is_accepted ? "border border-teal-700/40 bg-teal-950/20" : "bg-white/[0.03]"}`}>
              {a.is_accepted && (
                <span className="mb-1.5 inline-block text-[10px] font-semibold uppercase tracking-wider text-teal-400">Accepted answer</span>
              )}
              <p className="text-zinc-300 leading-relaxed">{a.content}</p>
              <p className="mt-1 text-[11px] text-zinc-600">{timeAgo(a.created_at)}</p>
            </div>
          ))}
        </div>
      )}

      {canPost ? (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Share what you know…"
            rows={3}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-teal-600/50 focus:outline-none focus:ring-1 focus:ring-teal-600/30"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={submit}
              disabled={submitting || draft.trim().length < 5}
              className="inline-flex min-h-[32px] items-center justify-center rounded-full border border-teal-600/40 bg-teal-900/30 px-4 text-xs font-medium text-teal-200 transition-colors hover:bg-teal-900/50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Posting…" : "Post answer"}
            </button>
            <button onClick={onClose} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-zinc-500">
          Reach <span className="text-teal-400">500 XP</span> to post answers.
        </p>
      )}
    </div>
  );
}

// ── Post card ─────────────────────────────────────────────────
function PostCard({ post, canPost, onVote }: { post: Post; canPost: boolean; onVote: (id: string) => void }) {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div className="rounded-2xl border border-white/8 bg-[#0a110e]/80 p-4 transition-colors hover:border-white/12">
      <div className="flex items-start gap-3">
        {/* Vote */}
        <button
          onClick={() => onVote(post.id)}
          className={`flex shrink-0 flex-col items-center gap-0.5 rounded-xl border px-2.5 py-2 transition-colors ${
            post.hasVoted
              ? "border-teal-600/50 bg-teal-900/30 text-teal-300"
              : "border-white/8 bg-white/[0.03] text-zinc-500 hover:border-white/15 hover:text-zinc-300"
          }`}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>
          <span className="text-xs font-medium font-figures">{post.upvote_count}</span>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.general}`}>
              {post.category}
            </span>
            {post.visa_tag && (
              <span className="inline-flex items-center rounded-full border border-white/8 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-500">
                {VISA_TAGS.find((v) => v.id === post.visa_tag)?.label ?? post.visa_tag}
              </span>
            )}
            <span className="ml-auto text-[11px] text-zinc-600">{timeAgo(post.created_at)}</span>
          </div>

          <p className="text-sm leading-relaxed text-zinc-200">{post.content}</p>

          <button
            onClick={() => setShowAnswers((v) => !v)}
            className="mt-2.5 flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337L5.05 21l1.395-3.72C5.512 15.042 5 13.574 5 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            {post.answer_count} {post.answer_count === 1 ? "answer" : "answers"}
            <span>{showAnswers ? "· hide" : "· view"}</span>
          </button>

          {showAnswers && (
            <AnswerThread
              postId={post.id}
              canPost={canPost}
              onClose={() => setShowAnswers(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── New post modal ────────────────────────────────────────────
function NewPostModal({ onClose, onPost }: { onClose: () => void; onPost: (post: Post) => void }) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [visaTag, setVisaTag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (submitting || content.trim().length < 10) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiFetch("/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), category, visaTag: visaTag || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to post"); return; }
      onPost({ ...data.post, hasVoted: false });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/12 bg-[#0a110e] p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Ask the community</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mb-3 text-xs text-zinc-500">
          Posts are anonymous — your name and account are never shown. Do not share personal details.
        </p>

        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What do you want to know? e.g. Can I build credit with an ITIN?"
          rows={4}
          maxLength={1000}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:border-teal-600/50 focus:outline-none focus:ring-1 focus:ring-teal-600/30"
        />
        <p className="mt-1 text-right text-[11px] text-zinc-600">{content.length}/1000</p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-teal-600/40"
            >
              {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400">Visa type (optional)</label>
            <select
              value={visaTag}
              onChange={(e) => setVisaTag(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-teal-600/40"
            >
              <option value="">Not specified</option>
              {VISA_TAGS.map((v) => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={submit}
            disabled={submitting || content.trim().length < 10}
            className="flex-1 inline-flex min-h-[40px] items-center justify-center rounded-full border border-teal-600/40 bg-teal-900/30 text-sm font-semibold text-teal-200 transition-colors hover:bg-teal-900/50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Posting…" : "Post anonymously"}
          </button>
          <button onClick={onClose} className="px-4 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [canPost, setCanPost] = useState(false);
  const [xp, setXp] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    apiFetch("/gamification")
      .then((r) => r.json())
      .then((d: { xp?: number }) => {
        const totalXP = d.xp ?? 0;
        setXp(totalXP);
        setCanPost(totalXP >= 500);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setCursor(null);
    apiFetch(`/community?category=${category}`)
      .then((r) => r.json())
      .then((d: { posts: Post[]; hasMore: boolean; nextCursor: string | null }) => {
        setPosts(d.posts ?? []);
        setHasMore(d.hasMore ?? false);
        setCursor(d.nextCursor ?? null);
      })
      .finally(() => setLoading(false));
  }, [category]);

  async function loadMore() {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await apiFetch(`/community?category=${category}&cursor=${encodeURIComponent(cursor)}`);
      const d = (await res.json()) as { posts: Post[]; hasMore: boolean; nextCursor: string | null };
      setPosts((prev) => [...prev, ...(d.posts ?? [])]);
      setHasMore(d.hasMore ?? false);
      setCursor(d.nextCursor ?? null);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleVote(postId: string) {
    const res = await apiFetch(`/community/${postId}/vote`, { method: "POST" });
    if (!res.ok) return;
    const { voted } = (await res.json()) as { voted: boolean };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, hasVoted: voted, upvote_count: voted ? p.upvote_count + 1 : p.upvote_count - 1 }
          : p
      )
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white md:text-3xl">Community</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Anonymous questions and answers from immigrants navigating U.S. finances.
          </p>
        </div>
        {canPost ? (
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 inline-flex min-h-[40px] items-center gap-2 rounded-full border border-teal-600/40 bg-teal-900/30 px-5 text-sm font-semibold text-teal-200 transition-colors hover:bg-teal-900/50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Ask
          </button>
        ) : (
          <div className="shrink-0 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2.5 text-center">
            <p className="text-xs text-zinc-500">Post unlocks at</p>
            <p className="font-figures text-sm font-semibold text-teal-400">{xp} / 500 XP</p>
            <div className="mt-1.5 h-1 w-24 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-teal-400 transition-all" style={{ width: `${Math.min(100, (xp / 500) * 100)}%` }} />
            </div>
          </div>
        )}
      </div>

      <EducationalDisclaimer topic="community" />

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              category === c.id
                ? "border-teal-600/50 bg-teal-900/40 text-teal-300"
                : "border-white/8 text-zinc-400 hover:border-white/15 hover:text-zinc-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-sm text-zinc-500">No posts yet in this category.</p>
          {canPost && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-3 text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              Be the first to ask →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} canPost={canPost} onVote={handleVote} />
          ))}
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full rounded-full border border-white/8 py-2.5 text-sm text-zinc-400 transition-colors hover:border-white/15 hover:text-zinc-200 disabled:opacity-40"
            >
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          )}
        </div>
      )}

      {showModal && (
        <NewPostModal
          onClose={() => setShowModal(false)}
          onPost={(post) => setPosts((prev) => [post, ...prev])}
        />
      )}
    </div>
  );
}
