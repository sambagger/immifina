"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { type Reward } from "@/lib/rewards";
import { getLevelFromXP, getProgressToNextLevel, LEVELS } from "@/lib/xp";
import { type Badge, BADGES } from "@/lib/badges";

type RewardWithStatus = Reward & { unlocked: boolean; redeemed: boolean };
type BadgeRow = { badge_id: string; earned_at: string };

const CATEGORY_ICONS: Record<string, string> = {
  content: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  feature: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  community: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  export: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3",
};

function RewardCard({
  reward,
  totalXP,
  onRedeem,
}: {
  reward: RewardWithStatus;
  totalXP: number;
  onRedeem: (id: string) => void;
}) {
  const [redeeming, setRedeeming] = useState(false);
  const xpToGo = Math.max(0, reward.xpRequired - totalXP);
  const progress = Math.min(100, (totalXP / reward.xpRequired) * 100);

  async function handleRedeem() {
    if (redeeming || !reward.unlocked) return;
    setRedeeming(true);
    try {
      const res = await apiFetch("/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId: reward.id }),
      });
      if (res.ok) onRedeem(reward.id);
    } finally {
      setRedeeming(false);
    }
  }

  return (
    <div className={`relative flex flex-col rounded-2xl border p-5 transition-all ${
      reward.redeemed
        ? "border-teal-700/40 bg-teal-950/15"
        : reward.unlocked
        ? "border-white/12 bg-[#0a110e]/90 hover:border-white/20"
        : "border-white/6 bg-[#080d0b]/60 opacity-70"
    }`}>
      {/* Lock overlay indicator */}
      {!reward.unlocked && (
        <div className="absolute right-4 top-4">
          <svg className="h-4 w-4 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
      )}
      {reward.redeemed && (
        <div className="absolute right-4 top-4">
          <svg className="h-4 w-4 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}

      {/* Icon */}
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl border ${
        reward.unlocked ? "border-teal-700/40 bg-teal-900/30" : "border-white/8 bg-white/[0.04]"
      }`}>
        <svg className={`h-5 w-5 ${reward.unlocked ? "text-teal-400" : "text-zinc-600"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d={CATEGORY_ICONS[reward.category]} />
        </svg>
      </div>

      <h3 className={`text-sm font-semibold ${reward.unlocked ? "text-white" : "text-zinc-500"}`}>
        {reward.title}
      </h3>
      <p className={`mt-1 flex-1 text-xs leading-relaxed ${reward.unlocked ? "text-zinc-400" : "text-zinc-600"}`}>
        {reward.description}
      </p>

      <div className="mt-4">
        {reward.unlocked ? (
          reward.redeemed ? (
            <span className="text-xs font-medium text-teal-400">Unlocked</span>
          ) : (
            <button
              onClick={handleRedeem}
              disabled={redeeming}
              className="inline-flex min-h-[34px] items-center justify-center rounded-full border border-teal-600/40 bg-teal-900/30 px-4 text-xs font-semibold text-teal-200 transition-colors hover:bg-teal-900/50 disabled:opacity-40"
            >
              {redeeming ? "Unlocking…" : "Unlock now"}
            </button>
          )
        ) : (
          <div className="space-y-1.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full bg-teal-900/60 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="font-figures text-[11px] text-zinc-600">
              {xpToGo} XP to go · {reward.xpRequired} XP required
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function BadgeGrid({ earned }: { earned: BadgeRow[] }) {
  const earnedIds = new Set(earned.map((b) => b.badge_id));
  const allBadges = Object.values(BADGES) as Badge[];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {allBadges.map((badge) => {
        const isEarned = earnedIds.has(badge.id);
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center rounded-2xl border px-3 py-4 text-center transition-colors ${
              isEarned
                ? "border-teal-700/30 bg-teal-950/15"
                : "border-white/6 bg-white/[0.02] opacity-50"
            }`}
          >
            <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full border text-lg ${
              isEarned ? "border-teal-600/40 bg-teal-900/30" : "border-white/8 bg-white/[0.03]"
            }`}>
              {isEarned ? (
                <svg className="h-5 w-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              )}
            </div>
            <p className={`text-xs font-semibold ${isEarned ? "text-zinc-200" : "text-zinc-600"}`}>{badge.label}</p>
            <p className={`mt-0.5 text-[10px] leading-tight ${isEarned ? "text-zinc-500" : "text-zinc-700"}`}>{badge.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<RewardWithStatus[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelName, setLevelName] = useState("Newcomer");
  const [progressPct, setProgressPct] = useState(0);
  const [badges, setBadges] = useState<BadgeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/rewards").then((r) => r.json()),
      apiFetch("/gamification").then((r) => r.json()),
    ]).then(([rewardData, gamData]: [
      { xp: number; rewards: RewardWithStatus[] },
      { xp: number; level: number; levelName: string; progressPct: number; badges: BadgeRow[] }
    ]) => {
      setRewards(rewardData.rewards ?? []);
      setTotalXP(gamData.xp ?? 0);
      setLevel(gamData.level ?? 1);
      setLevelName(gamData.levelName ?? "Newcomer");
      setProgressPct(gamData.progressPct ?? 0);
      setBadges(gamData.badges ?? []);
    }).finally(() => setLoading(false));
  }, []);

  function handleRedeem(rewardId: string) {
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, redeemed: true } : r))
    );
  }

  const currentLevel = getLevelFromXP(totalXP);
  const progress = getProgressToNextLevel(totalXP);

  return (
    <div className="space-y-10">
      {/* Header: XP profile card */}
      <div className="rounded-2xl border border-white/10 bg-[#0a110e]/80 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Your Level</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-white">{levelName}</span>
              <span className="text-lg text-zinc-500">Lv. {level}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-figures text-3xl font-bold text-teal-400">{totalXP.toLocaleString()}</p>
              <p className="text-xs text-zinc-500">total XP</p>
            </div>
          </div>
        </div>

        {/* Level progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
            <span>{currentLevel.name}</span>
            {progress.nextLevelXP && (
              <span>{LEVELS.find((l) => l.minXP === progress.nextLevelXP)?.name ?? ""}</span>
            )}
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-teal-400 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {progress.nextLevelXP ? (
            <p className="mt-1.5 font-figures text-xs text-zinc-500">
              {progress.progressXP} / {progress.nextLevelXP - currentLevel.minXP} XP to next level
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-teal-400 font-medium">Maximum level reached</p>
          )}
        </div>

        {/* Level track */}
        <div className="mt-5 flex items-center gap-0">
          {LEVELS.map((lvl, i) => (
            <div key={lvl.level} className="flex flex-1 flex-col items-center">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-bold transition-colors ${
                lvl.level <= level
                  ? "border-teal-600/60 bg-teal-900/50 text-teal-300"
                  : "border-white/8 bg-white/[0.03] text-zinc-600"
              }`}>
                {lvl.level}
              </div>
              <p className={`mt-1 text-[9px] font-medium ${lvl.level <= level ? "text-zinc-400" : "text-zinc-700"}`}>
                {lvl.name}
              </p>
              {i < LEVELS.length - 1 && (
                <div className="absolute hidden" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rewards */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Rewards</h2>
          <p className="mt-0.5 text-sm text-zinc-400">Reach XP thresholds to unlock content and features.</p>
        </div>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {rewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} totalXP={totalXP} onRedeem={handleRedeem} />
            ))}
          </div>
        )}
      </section>

      {/* Badges */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Badges</h2>
          <p className="mt-0.5 text-sm text-zinc-400">
            Earned for real-world milestones — {badges.length} of {Object.keys(BADGES).length} collected.
          </p>
        </div>
        <BadgeGrid earned={badges} />
      </section>
    </div>
  );
}
