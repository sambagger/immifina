export type RewardId =
  | "premium_lessons"
  | "advanced_forecast"
  | "community_posting"
  | "financial_plan_pdf";

export type Reward = {
  id: RewardId;
  title: string;
  description: string;
  xpRequired: number;
  category: "content" | "feature" | "community" | "export";
};

export const REWARDS: Reward[] = [
  {
    id: "premium_lessons",
    title: "Premium Lesson Pack",
    description: "Unlock advanced lessons on ITINs, credit score optimization, and ITIN mortgages.",
    xpRequired: 200,
    category: "content",
  },
  {
    id: "advanced_forecast",
    title: "Advanced Forecast Scenarios",
    description: "Unlock debt payoff comparison, home-buying timeline, and retirement projection scenarios.",
    xpRequired: 300,
    category: "feature",
  },
  {
    id: "community_posting",
    title: "Community Posting",
    description: "Post questions and answers in the ImmiFina community feed.",
    xpRequired: 500,
    category: "community",
  },
  {
    id: "financial_plan_pdf",
    title: "Personalized Financial Plan PDF",
    description: "Download a custom PDF summarizing your goals, progress, and next steps.",
    xpRequired: 750,
    category: "export",
  },
];

export function isRewardUnlocked(rewardId: RewardId, totalXP: number): boolean {
  const reward = REWARDS.find((r) => r.id === rewardId);
  return reward ? totalXP >= reward.xpRequired : false;
}
