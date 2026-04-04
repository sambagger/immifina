import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email().max(255),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  name: z.string().min(1).max(100),
  preferredLanguage: z.enum(["en", "es", "zh"]),
});

export const LoginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(128),
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
  immigrationStatus: z.enum([
    "citizen",
    "permanent_resident",
    "visa_holder",
    "other",
  ]),
});
