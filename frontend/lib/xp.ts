export const XP_VALUES = {
  lesson_complete: 50,
  quiz_pass: 75,
  step_complete: 100,
  goal_complete: 500,
  streak_7: 150,
} as const;

export type XPEventType = keyof typeof XP_VALUES;

export type Level = {
  level: number;
  name: string;
  minXP: number;
};

export const LEVELS: Level[] = [
  { level: 1, name: "Newcomer",  minXP: 0 },
  { level: 2, name: "Explorer",  minXP: 250 },
  { level: 3, name: "Builder",   minXP: 750 },
  { level: 4, name: "Achiever",  minXP: 1500 },
  { level: 5, name: "Navigator", minXP: 3000 },
];

export function getLevelFromXP(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(currentLevel: number): Level | null {
  return LEVELS.find((l) => l.level === currentLevel + 1) ?? null;
}

export function getProgressToNextLevel(xp: number): {
  currentLevelXP: number;
  nextLevelXP: number | null;
  progressXP: number;
  progressPct: number;
} {
  const current = getLevelFromXP(xp);
  const next = getNextLevel(current.level);
  if (!next) {
    return { currentLevelXP: current.minXP, nextLevelXP: null, progressXP: xp - current.minXP, progressPct: 100 };
  }
  const span = next.minXP - current.minXP;
  const earned = xp - current.minXP;
  return {
    currentLevelXP: current.minXP,
    nextLevelXP: next.minXP,
    progressXP: earned,
    progressPct: Math.min(100, Math.round((earned / span) * 100)),
  };
}
