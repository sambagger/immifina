import type { z } from "zod";
import { BenefitsInputSchema } from "@/lib/validation";

export type BenefitsInput = z.infer<typeof BenefitsInputSchema>;

export type ProgramMatch = {
  id: string;
  eligibilityKey: "high" | "medium" | "low";
  applyUrl: string;
};

/** Simplified FPL estimate (approximate, educational only) */
function annualFpl(householdSize: number): number {
  const base = 15060;
  const perExtra = 5380;
  return base + Math.max(0, householdSize - 1) * perExtra;
}

const PROGRAMS: Omit<ProgramMatch, "eligibilityKey">[] = [
  {
    id: "medicaid",
    applyUrl: "https://www.medicaid.gov/medicaid/index.html",
  },
  {
    id: "snap",
    applyUrl: "https://www.fns.usda.gov/snap/state-directory",
  },
  {
    id: "wic",
    applyUrl: "https://www.fns.usda.gov/wic/wic-how-apply",
  },
  {
    id: "liheap",
    applyUrl: "https://www.acf.hhs.gov/ocs/help/low-income-home-energy-assistance-program-liheap",
  },
  {
    id: "section8",
    applyUrl: "https://www.hud.gov/program_offices/public_indian_housing/programs/hcv",
  },
  {
    id: "headstart",
    applyUrl: "https://www.acf.hhs.gov/ohs",
  },
  {
    id: "schoolmeals",
    applyUrl:
      "https://www.fns.usda.gov/school-meals-applying-free-and-reduced-price-school-meals",
  },
];

export function matchBenefits(input: BenefitsInput): ProgramMatch[] {
  const fpl = annualFpl(input.householdSize);
  const fplRatio = input.annualIncome / Math.max(fpl, 1);

  return PROGRAMS.map((p) => {
    let eligibilityKey: ProgramMatch["eligibilityKey"] = "low";

    switch (p.id) {
      case "medicaid":
        if (fplRatio <= 1.38) eligibilityKey = "high";
        else if (fplRatio <= 2) eligibilityKey = "medium";
        break;
      case "snap":
        if (fplRatio <= 1.3) eligibilityKey = "high";
        else if (fplRatio <= 2) eligibilityKey = "medium";
        break;
      case "wic":
        if (input.hasChildren && fplRatio <= 1.85) eligibilityKey = "high";
        else if (input.hasChildren && fplRatio <= 2.2) eligibilityKey = "medium";
        else eligibilityKey = "low";
        if (input.hasChildrenUnder5 === true && eligibilityKey === "medium") eligibilityKey = "high";
        break;
      case "liheap":
        if (fplRatio <= 1.5) eligibilityKey = "high";
        else if (fplRatio <= 2) eligibilityKey = "medium";
        break;
      case "section8":
        if (fplRatio <= 0.5) eligibilityKey = "high";
        else if (fplRatio <= 0.8) eligibilityKey = "medium";
        break;
      case "headstart":
        if (input.hasChildren && fplRatio <= 1) eligibilityKey = "high";
        else if (input.hasChildren && fplRatio <= 1.3) eligibilityKey = "medium";
        else eligibilityKey = "low";
        break;
      case "schoolmeals":
        if (input.hasChildren && fplRatio <= 1.85) eligibilityKey = "high";
        else if (input.hasChildren && fplRatio <= 2.5) eligibilityKey = "medium";
        else eligibilityKey = "low";
        break;
      default:
        break;
    }

    if (
      (input.immigrationStatus === "visa_holder" || input.immigrationStatus === "daca") &&
      (p.id === "medicaid" || p.id === "snap")
    ) {
      eligibilityKey =
        eligibilityKey === "high" ? "medium" : eligibilityKey === "medium" ? "low" : "low";
    }

    return { ...p, eligibilityKey };
  }).sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.eligibilityKey] - order[b.eligibilityKey];
  });
}
