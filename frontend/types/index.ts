export type UserLanguage = "en" | "es" | "zh";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  preferred_language: UserLanguage;
}

export interface FinancialProfile {
  monthly_income: number;
  monthly_expenses: number;
  current_savings: number;
  monthly_savings_goal: number;
  household_size: number;
  state_of_residence: string | null;
  has_children: boolean;
}

export interface ConversationSummary {
  id: string;
  title: string | null;
  created_at: string;
}

export interface BenefitProgram {
  id: string;
  nameKey: string;
  coversKey: string;
  eligibilityKey: string;
  applyUrl: string;
  languageResourcesKey: string;
  /** Rough match score 0–1 for sorting */
  matchScore: number;
}

export interface RemittanceProviderRow {
  name: string;
  feeUsd: number;
  exchangeRateNote: string;
  recipientGetsUsd: number;
  speed: string;
  rating: number;
  url: string;
}
