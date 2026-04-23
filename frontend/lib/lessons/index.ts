export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Lesson = {
  slug: string;
  title: string;
  why: string;
  goalType: string;
  stepIndex: number;
  screens: string[];
  quiz: QuizQuestion[];
};

export const LESSONS: Lesson[] = [
  // ── build_credit / step 0: SSN vs ITIN ──────────────────────
  {
    slug: "ssn-vs-itin",
    title: "SSN vs. ITIN: Which Do You Need?",
    why: "Without an SSN or ITIN, most credit-building tools are closed to you. Knowing which one you qualify for is the first step.",
    goalType: "build_credit",
    stepIndex: 0,
    screens: [
      "A Social Security Number (SSN) is issued by the Social Security Administration to U.S. citizens, permanent residents, and eligible work visa holders (like H-1B). If you have work authorization, you almost certainly qualify.",
      "An Individual Taxpayer Identification Number (ITIN) is issued by the IRS. It is for people who need to file U.S. taxes but don't qualify for an SSN — including many visa holders and undocumented immigrants. ITINs start with the digit 9.",
      "For credit-building purposes, an ITIN works at many major banks and credit card issuers. Discover, Capital One, and several credit unions accept ITINs for secured card applications.",
      "To get an ITIN, you file IRS Form W-7. You'll need a valid passport or two other identity documents. Free help is available at VITA (Volunteer Income Tax Assistance) sites nationwide.",
    ],
    quiz: [
      {
        question: "Who is eligible for a Social Security Number?",
        options: [
          "Anyone living in the U.S., regardless of status",
          "U.S. citizens, permanent residents, and eligible work visa holders",
          "Only U.S. citizens and green card holders",
          "Anyone who pays U.S. taxes",
        ],
        correctIndex: 1,
        explanation: "SSNs go to citizens, permanent residents, and those with certain work authorizations. An ITIN is the alternative for others who need to interact with the U.S. financial system.",
      },
      {
        question: "What is an ITIN used for?",
        options: [
          "Proving U.S. citizenship",
          "Applying for Social Security benefits",
          "Filing U.S. taxes and accessing some financial products when you don't have an SSN",
          "Opening any bank account automatically",
        ],
        correctIndex: 2,
        explanation: "The ITIN is a tax-processing number. It doesn't prove work authorization, but it opens doors to banking and credit for people who don't qualify for an SSN.",
      },
      {
        question: "Where can you get free help applying for an ITIN?",
        options: [
          "The Department of Motor Vehicles",
          "Your employer's HR department",
          "VITA (Volunteer Income Tax Assistance) sites",
          "Any U.S. bank branch",
        ],
        correctIndex: 2,
        explanation: "VITA sites are IRS-certified free tax preparation locations that can also help you file Form W-7 to get an ITIN.",
      },
    ],
  },

  // ── build_credit / step 1: secured cards ────────────────────
  {
    slug: "secured-cards",
    title: "How Secured Credit Cards Work",
    why: "A secured card is the most accessible credit-building tool for immigrants. Understanding how it works prevents costly mistakes.",
    goalType: "build_credit",
    stepIndex: 1,
    screens: [
      "A secured credit card requires a cash deposit — usually $200–$500 — that becomes your credit limit. If you spend $150 and don't pay, the bank keeps your deposit. This is how they take on someone with no credit history.",
      "The card reports your payment behavior to the three major credit bureaus: Equifax, TransUnion, and Experian. Every on-time payment is recorded. After 6–12 months, you'll have a real credit score.",
      "When choosing a secured card, prioritize: (1) reports to all 3 bureaus, (2) no annual fee or a low one, (3) a path to upgrade to an unsecured card after 12 months. Cards from Discover, Capital One, and many credit unions fit this profile.",
      "The single most important rule: pay your full balance every month. You do not need to carry a balance to build credit — that's a myth. Carrying a balance costs you interest and slightly hurts your score by raising your 'utilization ratio'.",
    ],
    quiz: [
      {
        question: "Why does a secured credit card require a deposit?",
        options: [
          "To earn interest for the bank",
          "To protect the bank if you don't pay — it's their collateral",
          "To fund a savings account in your name",
          "Because all credit cards require deposits",
        ],
        correctIndex: 1,
        explanation: "The deposit is collateral. It lowers the bank's risk, which is why they'll approve someone with no U.S. credit history.",
      },
      {
        question: "How does a secured card help build your credit score?",
        options: [
          "The deposit itself is counted as an asset in your credit file",
          "The bank reports your on-time payments to the credit bureaus",
          "Spending money with the card directly increases your score",
          "Having a bank account at the issuing bank boosts your score",
        ],
        correctIndex: 1,
        explanation: "Credit bureaus score you based on payment history. Every on-time payment goes on record. After enough months, you have a real, scoreable history.",
      },
      {
        question: "Do you need to carry a balance to build credit?",
        options: [
          "Yes, carrying a small balance each month shows lenders you use credit",
          "No — paying in full each month builds credit and avoids interest charges",
          "Only for the first 6 months",
          "It depends on the card issuer",
        ],
        correctIndex: 1,
        explanation: "You build credit by making payments, not by carrying debt. Paying in full avoids interest and actually helps your credit utilization ratio.",
      },
    ],
  },

  // ── bank_account / step 0 ────────────────────────────────────
  {
    slug: "bank-account-basics",
    title: "Opening a U.S. Bank Account as an Immigrant",
    why: "A bank account is the foundation of U.S. financial life. Many immigrants don't know which documents to bring or which banks accept them.",
    goalType: "bank_account",
    stepIndex: 0,
    screens: [
      "You don't need a Social Security Number to open a bank account. Many banks accept an ITIN (Individual Taxpayer Identification Number) and a foreign passport. Some also accept a Matricula Consular (Mexican consular ID) or other government-issued foreign ID.",
      "Banks that are known to be immigrant-friendly include: Bank of America, Wells Fargo, Chase (many branches), and several credit unions. Online banks like Chime and SoFi have very simple sign-up processes and few ID requirements.",
      "There are two types of accounts to know: Checking accounts are for daily spending — linked to a debit card. Savings accounts earn interest on money you park there. Open both if you can; they serve different purposes.",
      "Watch out for monthly fees. Many banks charge $10–$15/month unless you maintain a minimum balance or set up direct deposit. Look for 'no-fee checking' or accounts with easy fee waivers.",
    ],
    quiz: [
      {
        question: "Do you need a Social Security Number to open a U.S. bank account?",
        options: [
          "Yes, all banks require an SSN",
          "No, many banks accept an ITIN and a foreign passport",
          "Only if you're opening a savings account",
          "Only at credit unions, not commercial banks",
        ],
        correctIndex: 1,
        explanation: "An ITIN (or sometimes just a foreign passport) is accepted at many banks. SSN is not required by law to open an account.",
      },
      {
        question: "What is the main difference between a checking and savings account?",
        options: [
          "Checking accounts earn higher interest rates",
          "Savings accounts come with a debit card",
          "Checking is for daily spending; savings is for storing money and earning interest",
          "There is no practical difference",
        ],
        correctIndex: 2,
        explanation: "Checking = daily use with a debit card. Savings = where you park money to earn interest. Ideally you have both.",
      },
      {
        question: "How can you avoid monthly bank fees?",
        options: [
          "Keep a large balance or set up direct deposit, or choose a no-fee account",
          "Use your debit card at least 10 times per month",
          "Only withdraw cash from ATMs",
          "Fees are unavoidable at all major U.S. banks",
        ],
        correctIndex: 0,
        explanation: "Most bank fees are waivable. Look for no-fee accounts (many online banks have them) or meet simple conditions like direct deposit.",
      },
    ],
  },

  // ── paycheck-deductions ──────────────────────────────────────
  {
    slug: "paycheck-deductions",
    title: "Understanding Your U.S. Paycheck",
    why: "Most immigrants are confused by the gap between their salary and what lands in their account. Every deduction line has a reason — and some are money in your pocket later.",
    goalType: "save_plan",
    stepIndex: 0,
    screens: [
      "Your gross pay is your full salary before deductions. Your net pay ('take-home') is what you actually receive. The difference goes to taxes and benefits.",
      "FICA taxes are two mandatory federal deductions: Social Security (6.2% of wages) and Medicare (1.45%). These fund retirement and healthcare programs you may or may not access, but you still pay them on every paycheck.",
      "Federal income tax is withheld based on the W-4 form you filled out when you started. The more allowances you claimed, the less is withheld. If too little is withheld, you owe money in April; too much, and you get a refund.",
      "Pre-tax deductions (like 401k contributions or health insurance premiums) come out before taxes are calculated — which means they reduce your taxable income. A $200/month 401k contribution doesn't reduce your take-home by $200; it reduces it by less, because you're paying less tax.",
    ],
    quiz: [
      {
        question: "What is 'gross pay'?",
        options: [
          "Your take-home pay after all deductions",
          "Your full salary before any taxes or deductions",
          "The amount deposited into your bank account",
          "Your annual salary divided by 12",
        ],
        correctIndex: 1,
        explanation: "Gross pay is the top-line number — before anything is taken out. Net pay is what you receive after taxes and deductions.",
      },
      {
        question: "What are FICA taxes?",
        options: [
          "State income taxes paid to your state government",
          "Federal Social Security and Medicare taxes — mandatory for all U.S. workers",
          "A tax only paid by self-employed workers",
          "Optional deductions for retirement savings",
        ],
        correctIndex: 1,
        explanation: "FICA = Federal Insurance Contributions Act. It funds Social Security (6.2%) and Medicare (1.45%). Virtually everyone who works in the U.S. pays them.",
      },
      {
        question: "Why are pre-tax deductions (like 401k) beneficial?",
        options: [
          "They eliminate all federal taxes on your paycheck",
          "They reduce your taxable income, so you pay less tax overall",
          "They are matched by the government dollar for dollar",
          "They don't affect your take-home pay at all",
        ],
        correctIndex: 1,
        explanation: "Pre-tax deductions lower the income that gets taxed, reducing your overall tax bill. A $200 pre-tax 401k contribution might only reduce take-home by ~$150 after the tax savings.",
      },
    ],
  },

  // ── remittance / step 0 ──────────────────────────────────────
  {
    slug: "remittance-fees",
    title: "How Remittance Fees Actually Work",
    why: "Immigrants send over $600 billion home every year. Understanding the true cost of a transfer can save you hundreds of dollars annually.",
    goalType: "remittance",
    stepIndex: 0,
    screens: [
      "There are two ways a remittance provider makes money: transfer fees (a flat charge per transfer, like $5) and exchange rate margins (they give you a worse rate than the mid-market rate and keep the difference). Most providers use both.",
      "The mid-market rate is the 'real' exchange rate you see on Google. No provider gives you this rate — they mark it up. A 2% margin on a $1,000 transfer costs you $20 in hidden fees, even if the advertised transfer fee is $0.",
      "To compare providers honestly, use a website like Wise's rate comparison or Monito.com. Enter the exact amount you're sending and compare total recipient amounts — not just advertised fees.",
      "The best providers for most corridors (Mexico, Philippines, India, Central America) are currently Wise, Remitly, and Sendwave. Bank wires are almost always the most expensive option — often 3–6% total cost.",
    ],
    quiz: [
      {
        question: "How do remittance providers often make money beyond transfer fees?",
        options: [
          "By charging the recipient a receiving fee",
          "By marking up the exchange rate (giving you a worse rate than the market rate)",
          "By requiring a monthly subscription",
          "By investing your money while it's in transit",
        ],
        correctIndex: 1,
        explanation: "Exchange rate margins are often larger than the advertised fee. A '0 transfer fee' provider might still cost more than a '$5 fee' provider if their exchange rate is worse.",
      },
      {
        question: "What is the mid-market exchange rate?",
        options: [
          "The rate banks use internally and advertise to customers",
          "The 'real' exchange rate between two currencies, found on Google or XE.com",
          "A rate set by the U.S. Federal Reserve",
          "The average of all remittance provider rates",
        ],
        correctIndex: 1,
        explanation: "The mid-market rate is what currencies actually trade at. No retail provider gives you this rate — understanding it lets you measure how much you're paying in hidden margin.",
      },
      {
        question: "What is the most reliable way to compare remittance providers?",
        options: [
          "Look at the advertised transfer fee only",
          "Check which provider has the most app store reviews",
          "Compare the total amount the recipient actually receives for a specific transfer",
          "Use the provider your employer recommends",
        ],
        correctIndex: 2,
        explanation: "The only honest comparison is: how many pesos/rupees/etc. does my recipient get? That number accounts for all fees and exchange rate margins combined.",
      },
    ],
  },
];

export function getLessonBySlug(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonsForStep(goalType: string, stepIndex: number): Lesson[] {
  return LESSONS.filter((l) => l.goalType === goalType && l.stepIndex === stepIndex);
}
