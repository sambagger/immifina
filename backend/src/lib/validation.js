import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email().max(255),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
  name: z.string().min(1).max(100),
  preferredLanguage: z.enum(["en", "es", "zh"]),
});

export const LoginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(128),
});

export const WaitlistSchema = z.object({
  email: z.string().email().max(255),
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().uuid().optional(),
});

export const ForecastInputSchema = z.object({
  monthlyIncome: z.number().min(0).max(999999),
  monthlyExpenses: z.number().min(0).max(999999),
  currentSavings: z.number().min(0).max(999999999),
  monthlySavingsGoal: z.number().min(0).max(999999),
  yearsToProject: z.number().int().min(1).max(30),
});

export const BenefitsInputSchema = z.object({
  householdSize: z.number().int().min(1).max(20),
  annualIncome: z.number().min(0).max(999999),
  state: z.string().length(2),
  hasChildren: z.boolean(),
  hasChildrenUnder5: z.boolean().optional(),
  pregnantOrNewborn: z.boolean().optional(),
  immigrationStatus: z.enum(["citizen", "permanent_resident", "visa_holder", "daca", "other"]),
});

export const ProfilePatchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  preferredLanguage: z.enum(["en", "es", "zh"]).optional(),
  monthlyIncome: z.number().min(0).max(999999).optional(),
  monthlyExpenses: z.number().min(0).max(999999).optional(),
  currentSavings: z.number().min(0).max(999999999).optional(),
  monthlySavingsGoal: z.number().min(0).max(999999).optional(),
  householdSize: z.number().int().min(1).max(20).optional(),
  stateOfResidence: z.string().length(2).nullable().optional(),
  hasChildren: z.boolean().optional(),
  immigrationSituation: z.enum(["us_citizen", "green_card", "visa", "daca", "other"]).optional(),
  hasSsn: z.boolean().optional(),
  hasItin: z.boolean().optional(),
  yearsInUs: z.number().int().min(0).max(80).optional(),
  countryOfOrigin: z.string().min(1).max(80).optional(),
  primaryGoal: z.enum(["build_credit", "bank_account", "save_plan", "remittance", "taxes", "home", "business"]).optional(),
  employmentStatus: z.enum(["employed", "self_employed", "unemployed", "student"]).optional(),
  childrenUnder18: z.boolean().optional(),
  currentDebt: z.number().min(0).max(999999999).optional(),
  expenseHousing: z.number().min(0).max(999999).optional(),
  expenseFood: z.number().min(0).max(999999).optional(),
  expenseTransport: z.number().min(0).max(999999).optional(),
  expenseUtilities: z.number().min(0).max(999999).optional(),
  expenseRemittance: z.number().min(0).max(999999).optional(),
  expenseOther: z.number().min(0).max(999999).optional(),
  monthlyCanSave: z.number().min(0).max(999999).optional(),
  completeOnboarding: z.boolean().optional(),
});
