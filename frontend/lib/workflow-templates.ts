/**
 * ImmiFina Workflow Templates
 *
 * Each primary goal has a series of concrete, ordered steps.
 * Philosophy: explain WHY before WHAT. Users deserve to understand
 * the reasoning — not just a to-do list.
 *
 * chatPrompt: pre-seeded question for the ImmiFina chat that's
 * perfectly targeted to where the user is in their journey.
 */

export type PrimaryGoal =
  | "build_credit"
  | "bank_account"
  | "save_plan"
  | "remittance"
  | "taxes"
  | "home"
  | "business";

export type UserProfile = {
  has_ssn?: boolean | null;
  has_itin?: boolean | null;
  years_in_us?: number | null;
  immigration_situation?: string | null;
  employment_status?: string | null;
  monthly_income?: number | null;
  primary_goal?: string | null;
};

export type WorkflowStep = {
  title: string;
  why: string;
  actions: string[];
  links?: { label: string; href: string }[];
  chatPrompt?: string;
  estimatedDays?: number;
  /** Return true if this step should be skipped for this user's profile */
  skipIf?: (profile: UserProfile) => boolean;
};

export type WorkflowMeta = {
  label: string;
  description: string;
  completionMessage: string;
  steps: WorkflowStep[];
};

export const WORKFLOWS: Record<PrimaryGoal, WorkflowMeta> = {

  // ─────────────────────────────────────────────────────────────
  build_credit: {
    label: "Build U.S. Credit",
    description: "Establish a credit history from scratch — even without a Social Security Number.",
    completionMessage:
      "You've laid the foundation for your U.S. credit history. Lenders now have a track record to judge you on — not just your background.",
    steps: [
      {
        title: "Find out if you can get an SSN or ITIN",
        why: "Most credit-building tools require either an SSN or an ITIN. Knowing which one you qualify for determines your fastest path forward.",
        skipIf: (p) => !!(p.has_ssn || p.has_itin),
        actions: [
          "If you have work authorization, you're eligible for an SSN — apply at your local Social Security Administration office.",
          "If you don't have an SSN (or are ineligible), apply for an ITIN using IRS Form W-7. Many banks and credit card issuers accept ITINs.",
          "You can apply for an ITIN yourself or use a free VITA tax site to help you prepare Form W-7.",
        ],
        links: [
          { label: "IRS ITIN info (irs.gov)", href: "https://www.irs.gov/individuals/individual-taxpayer-identification-number" },
          { label: "Find a VITA site near you", href: "https://www.irs.gov/individuals/find-a-location-for-free-tax-prep" },
        ],
        chatPrompt: "I want to build credit in the U.S. I'm not sure if I qualify for an SSN or ITIN — can you walk me through the difference and which one I need?",
        estimatedDays: 7,
      },
      {
        title: "Open a secured credit card",
        why: "A secured card works like a regular credit card but you deposit money upfront as collateral. Because the bank's risk is low, they're far more willing to approve people with no U.S. credit history — including immigrants.",
        actions: [
          "Look for a secured card with no annual fee (or a low one), that reports to all three credit bureaus (Equifax, TransUnion, Experian).",
          "Self, Discover it Secured, and OpenSky are commonly mentioned options — but policies change, so compare current offers.",
          "Some credit unions accept ITINs — calling your local credit union is worth 5 minutes of your time.",
          "Start with a $200–$500 deposit. This becomes your credit limit.",
        ],
        links: [
          { label: "Consumer Financial Protection Bureau: Secured cards", href: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-secured-credit-card-en-334/" },
        ],
        chatPrompt: "I'm ready to open a secured credit card. What should I look for when comparing options, and are there cards that accept an ITIN instead of an SSN?",
        estimatedDays: 14,
      },
      {
        title: "Set up autopay and use the card lightly",
        why: "Your payment history is the single biggest factor in your credit score (about 35%). Even one missed payment can set you back months. Keeping your balance low (under 30% of your limit) also helps.",
        actions: [
          "Set up automatic minimum payment from your bank account so you never miss a due date.",
          "Use the card for small, regular purchases you'd make anyway — groceries, a phone bill.",
          "Pay the full balance every month if you can. This avoids interest and builds the best history.",
          "Keep your balance below 30% of your credit limit at all times (e.g., under $150 on a $500 limit).",
        ],
        chatPrompt: "I just got my secured card. How should I use it each month to build credit as fast as possible without paying interest?",
        estimatedDays: 180,
      },
      {
        title: "Check your credit score after 6 months",
        why: "It typically takes 3–6 months of activity to generate your first credit score. Checking it lets you see your progress — and catch any errors early (errors are common and can be disputed for free).",
        actions: [
          "Check your score for free at AnnualCreditReport.com (the official federally mandated site) or through your bank/card app.",
          "Look for errors on your report — wrong names, accounts you don't recognize. Dispute any errors with the bureau directly.",
          "A score above 580 is considered \"fair\" and opens more doors. Above 670 is \"good.\"",
        ],
        links: [
          { label: "Annual Credit Report (official)", href: "https://www.annualcreditreport.com" },
          { label: "How to dispute an error (CFPB)", href: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/answers/key-terms/#dispute" },
        ],
        chatPrompt: "It's been 6 months since I opened my secured card. What should my credit score look like now, and how do I read my credit report for the first time?",
        estimatedDays: 7,
      },
      {
        title: "Graduate to an unsecured card or product change",
        why: "After 12–18 months of on-time payments, many secured card issuers will upgrade your account to an unsecured card and return your deposit. This is a significant milestone — your credit limit usually increases and you get your deposit back.",
        actions: [
          "Call your card issuer and ask about their \"graduation\" process or product change policy.",
          "If they upgrade you, your account history carries over — don't close the old account.",
          "With a stronger score, you can now qualify for better cards, loans, or rent without a guarantor.",
        ],
        chatPrompt: "I've had my secured card for over a year. How do I ask my card issuer to upgrade me to an unsecured card, and what happens to my deposit?",
        estimatedDays: 30,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  bank_account: {
    label: "Open a Bank Account",
    description: "Get a safe place to keep your money and stop paying fees for cashing checks.",
    completionMessage:
      "You now have a real U.S. bank account. Your money is safe, FDIC-insured, and you can receive direct deposits, pay bills online, and stop paying check-cashing fees.",
    steps: [
      {
        title: "Understand what ID you can use",
        why: "Many immigrants believe they need an SSN to open a bank account. Most don't. Banks can accept passports, foreign IDs, ITINs, and sometimes Matricula Consular cards. Knowing this upfront saves you from rejection.",
        actions: [
          "Gather what you have: foreign passport, national ID, ITIN letter, or consular ID.",
          "Look for banks and credit unions that explicitly accept ITIN (not SSN) and foreign passports.",
          "Community Development Financial Institutions (CDFIs) and credit unions are often more immigrant-friendly than large national banks.",
        ],
        chatPrompt: "I want to open a U.S. bank account but I don't have an SSN. What ID documents do banks typically accept for immigrants?",
        estimatedDays: 3,
      },
      {
        title: "Find the right account type",
        why: "\"Second-chance\" checking accounts and accounts designed for people without a U.S. credit history exist specifically because millions of immigrants and low-income residents have been excluded from traditional banking. You have options.",
        actions: [
          "Look for accounts with no or low minimum balance requirements.",
          "Ask about 'second-chance' checking if you've had banking issues before (ChexSystems report).",
          "Consider online banks — many have no fees and accept ITIN applicants.",
          "Credit unions in immigrant communities often have no-fee accounts and bilingual staff.",
        ],
        links: [
          { label: "FDIC BankFind — find FDIC-insured banks", href: "https://banks.fdic.gov/bankfind-suite/" },
          { label: "CFPB: Picking a bank account", href: "https://www.consumerfinance.gov/consumer-tools/bank-accounts/" },
        ],
        chatPrompt: "What types of bank accounts are best for someone who is new to the U.S. and doesn't have a credit history or SSN?",
        estimatedDays: 7,
      },
      {
        title: "Open the account",
        why: "Walking in prepared makes all the difference. Banks are required to follow Know Your Customer rules but can't discriminate against you based on national origin.",
        actions: [
          "Bring your ID (passport + ITIN letter, or whatever the bank confirmed they accept).",
          "Bring an opening deposit — typically $25–$100 for basic checking accounts.",
          "Ask specifically: 'Do you report to ChexSystems?' and 'Is there a monthly fee, and how do I avoid it?'",
          "If rejected, ask for the reason in writing. You have the right to know.",
        ],
        chatPrompt: "I'm going to open a bank account this week. What questions should I ask the banker, and what should I watch out for in the account terms?",
        estimatedDays: 1,
      },
      {
        title: "Set up direct deposit",
        why: "Direct deposit means your paycheck goes straight to your account — faster, safer, and fee-free. Many banks also waive monthly fees when you have direct deposit set up.",
        actions: [
          "Give your employer your bank's routing number and your account number.",
          "Check if your bank has a direct deposit form or if your employer needs a voided check.",
          "Direct deposits typically arrive 1–2 days earlier than paper checks.",
        ],
        chatPrompt: "I just opened my bank account. How do I set up direct deposit for my paycheck? What information does my employer need?",
        estimatedDays: 7,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  save_plan: {
    label: "Build a Savings Plan",
    description: "Create a savings habit that fits your income and sends money to family back home.",
    completionMessage:
      "You've built a real savings foundation — an emergency fund, a savings habit, and a plan for the future. Financial security is a process, not a destination, and you've started yours.",
    steps: [
      {
        title: "Calculate your true monthly surplus",
        why: "You can't save what you don't track. Most people underestimate spending. Getting your real numbers takes 30 minutes and changes everything.",
        actions: [
          "Write down your take-home pay (after taxes and deductions).",
          "List all fixed expenses: rent, utilities, phone, subscriptions, loan payments.",
          "Estimate variable expenses: food, transport, clothing, entertainment.",
          "Don't forget remittances to family — this is a real expense that deserves respect, not shame.",
          "Surplus = take-home - all expenses. This is your true savings capacity.",
        ],
        chatPrompt: "Can you help me figure out how much I can realistically save each month? I'll tell you my income and expenses.",
        estimatedDays: 1,
      },
      {
        title: "Build a 1-month emergency fund first",
        why: "Before investing or aggressive saving, you need a safety net. Even a single month of expenses saved prevents a car repair or medical bill from derailing your entire financial plan.",
        actions: [
          "Target: one month of your total monthly expenses in a separate savings account.",
          "Open a high-yield savings account (many online banks offer 4–5% APY — search current rates).",
          "Set up an automatic transfer of even $25–$50 per paycheck to this account.",
          "Don't touch this money except for true emergencies.",
        ],
        chatPrompt: "I want to build a 1-month emergency fund. How do I find a high-yield savings account and set up automatic transfers?",
        estimatedDays: 90,
      },
      {
        title: "Set a savings goal with a deadline",
        why: "\"Save more money\" is not a goal. \"Save $1,000 by December\" is. Specific goals with deadlines activate different decision-making than vague intentions.",
        actions: [
          "Pick ONE primary savings goal: emergency fund, family trip back home, down payment, or other.",
          "Calculate: how much per month do you need to reach it by your deadline?",
          "Write it down somewhere visible. This sounds trivial — research shows it works.",
          "Use ImmiFina's forecast tool to model your savings trajectory.",
        ],
        chatPrompt: "I want to set a concrete savings goal. Can you help me work out how much I need to save each month to reach a specific amount by a certain date?",
        estimatedDays: 7,
      },
      {
        title: "Automate everything possible",
        why: "Willpower is unreliable. Systems aren't. Automating savings removes the decision entirely — you never see the money, so you don't spend it.",
        actions: [
          "Set up automatic transfers from checking to savings on payday.",
          "If your employer allows split direct deposit, send a fixed amount directly to savings.",
          "Review subscriptions — cancel anything unused. Even $15/month is $180/year.",
          "Set a calendar reminder every 3 months to review and increase your automatic savings amount.",
        ],
        chatPrompt: "How do I automate my savings so I save consistently without having to remember every month?",
        estimatedDays: 7,
      },
      {
        title: "Explore employer benefits and tax-advantaged accounts",
        why: "If your employer offers a 401(k) match, not participating is leaving free money on the table. Even a small match dramatically accelerates long-term savings. ITIN holders can often participate too.",
        actions: [
          "Ask your HR department if you have access to a 401(k) or similar retirement account.",
          "If there's an employer match, contribute at least enough to capture the full match.",
          "ITIN holders CAN open IRAs (Individual Retirement Accounts) even without an SSN.",
          "Consider consulting a free financial counselor through a nonprofit for personalized guidance.",
        ],
        chatPrompt: "Can immigrants with an ITIN participate in 401(k) plans or open an IRA? And what does 'employer match' actually mean?",
        estimatedDays: 14,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  remittance: {
    label: "Send Money Home Smarter",
    description: "Stop overpaying in fees and poor exchange rates when sending money to your family.",
    completionMessage:
      "You now have a reliable, low-cost way to support your family back home. Over a year, smarter transfers can save you hundreds of dollars — money that stays in your family's hands.",
    steps: [
      {
        title: "Understand what you're currently paying",
        why: "Hidden fees and poor exchange rates are how remittance companies make most of their money. A transfer that looks \"free\" might be charging you 3–5% in a bad exchange rate. You need to compare the total cost, not just the fee.",
        actions: [
          "Find your last 2–3 receipts from your current transfer provider.",
          "Calculate: how many dollars did you send vs. how many did the recipient actually receive?",
          "The difference (including fees AND exchange rate margin) is your true cost.",
          "Use the World Bank's Remittance Prices Worldwide tool to see average costs for your corridor.",
        ],
        links: [
          { label: "World Bank Remittance Prices", href: "https://remittanceprices.worldbank.org/" },
        ],
        chatPrompt: "I want to understand how much I'm actually paying to send money home. Can you explain how exchange rate margins work and how to calculate the true cost of a transfer?",
        estimatedDays: 1,
      },
      {
        title: "Compare providers for your specific corridor",
        why: "The best provider for Mexico-to-Guatemala transfers is different from the best for US-to-Philippines. Rates and fees vary dramatically by destination country, currency, and transfer method.",
        actions: [
          "Use Wise (formerly TransferWise), Remitly, or WorldRemit and get quotes for your exact amount to your destination.",
          "Compare: exchange rate, flat fee, delivery speed, and recipient pickup options.",
          "Check if your recipient needs a bank account or if cash pickup is available in their area.",
          "Beware of 'promotional' first-transfer rates — calculate the ongoing cost after the promotion ends.",
        ],
        links: [
          { label: "Compare rates on monito.com", href: "https://www.monito.com" },
        ],
        chatPrompt: "I need to compare remittance providers for sending money to [my country]. What should I look for beyond just the transfer fee?",
        estimatedDays: 3,
      },
      {
        title: "Set up your preferred provider and first transfer",
        why: "Verification can take a few days the first time. Getting set up before you need to send money avoids last-minute rushes and the temptation to use a more expensive walk-in service.",
        actions: [
          "Create your account and complete ID verification (usually a photo ID and selfie).",
          "Add your bank account or debit card as the funding method.",
          "Add your recipient's details — for bank transfers you'll need their bank, branch code, and account number.",
          "Send a small test transfer first to confirm everything works before sending a large amount.",
        ],
        chatPrompt: "I'm setting up a new remittance account for the first time. What information do I need about my recipient to complete the transfer?",
        estimatedDays: 7,
      },
      {
        title: "Set a remittance schedule and budget",
        why: "Treating remittances as a fixed line item in your budget — like rent — makes it predictable for both you and your family, and prevents you from scrambling when the pressure to send money comes.",
        actions: [
          "Decide on a regular transfer amount and schedule (monthly, bi-weekly, etc.).",
          "Many apps let you set up recurring transfers automatically.",
          "Communicate the schedule with your family so they can plan around it.",
          "Include remittances in your monthly budget as a non-negotiable expense.",
        ],
        chatPrompt: "How do I set a sustainable remittance budget that lets me support my family without putting my own financial stability at risk?",
        estimatedDays: 1,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  taxes: {
    label: "File My U.S. Taxes",
    description: "Understand your filing obligations and file correctly — even without an SSN.",
    completionMessage:
      "You've filed your U.S. taxes correctly. This builds your tax history, which matters for visa renewals, mortgage applications, and DACA renewals. Keep copies of everything you filed.",
    steps: [
      {
        title: "Understand if you need to file",
        why: "Most people who earn income in the U.S. must file a federal tax return — regardless of immigration status. Filing protects you legally and builds a documented financial history. Not filing when you should can have serious consequences.",
        actions: [
          "Generally, if you earned more than $13,850 (2023) as a single filer, you're required to file.",
          "Even if you earned less, filing may get you a refund — especially if taxes were withheld from your paycheck.",
          "DACA holders, visa holders, and undocumented immigrants who earn U.S. income are generally required to file.",
          "Your filing status (single, married, head of household) affects your required threshold.",
        ],
        chatPrompt: "I'm not sure if I need to file U.S. taxes. I'm [immigration status] and I earned [approximate amount] last year. Can you help me understand my obligations?",
        estimatedDays: 1,
      },
      {
        title: "Get an ITIN if you don't have an SSN",
        why: "You need either an SSN or an ITIN to file a U.S. tax return. An ITIN (Individual Taxpayer Identification Number) is issued by the IRS specifically for people who are required to file but don't have an SSN.",
        skipIf: (p) => !!(p.has_ssn || p.has_itin),
        actions: [
          "File IRS Form W-7 to apply for an ITIN — you do this with your first tax return.",
          "VITA (Volunteer Income Tax Assistance) sites help you apply for an ITIN and file your return for free.",
          "Bring: your completed tax return, original identity documents (passport), and foreign status documents.",
          "Processing takes 7–11 weeks — apply as early as possible.",
        ],
        links: [
          { label: "IRS ITIN page", href: "https://www.irs.gov/individuals/individual-taxpayer-identification-number" },
          { label: "Find a VITA site", href: "https://www.irs.gov/individuals/find-a-location-for-free-tax-prep" },
        ],
        chatPrompt: "How do I apply for an ITIN so I can file my taxes? What documents do I need and how long does it take?",
        estimatedDays: 14,
      },
      {
        title: "Gather your tax documents",
        why: "Filing is much faster and less stressful when you have everything in one place before you sit down. Missing a form means delays or an amended return.",
        actions: [
          "W-2: from every employer (should arrive by January 31 for the prior year).",
          "1099 forms: if you did freelance/contract work, or received interest/dividends.",
          "Records of any deductible expenses if you're self-employed.",
          "Last year's tax return if you have one — useful as reference.",
          "Your ITIN number (if you already have one) or your SSN.",
        ],
        chatPrompt: "I'm getting ready to file my taxes. Can you explain what each of my tax forms means — W-2, 1099, etc.?",
        estimatedDays: 7,
      },
      {
        title: "File your return (free options available)",
        why: "You do not need to pay a tax preparer. Free options exist for most immigrants and working people. Paid preparers can be helpful but also make mistakes — and you're the one legally responsible.",
        actions: [
          "VITA sites prepare and file your return for free if your income is under ~$64,000.",
          "IRS Free File is available if your income is under $79,000.",
          "If you have an ITIN (not SSN), most paid software also supports ITIN filing.",
          "Keep a copy of your filed return and all supporting documents for at least 3 years.",
        ],
        links: [
          { label: "IRS Free File", href: "https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free" },
          { label: "VITA locator", href: "https://www.irs.gov/individuals/find-a-location-for-free-tax-prep" },
        ],
        chatPrompt: "What are my options for filing my taxes for free? I want to understand VITA vs. IRS Free File and which is right for me.",
        estimatedDays: 3,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  home: {
    label: "Buy a Home",
    description: "Navigate the U.S. home-buying process as an immigrant — it's more possible than you think.",
    completionMessage:
      "You've completed your home-buying foundation. You understand the process, have your credit and savings in order, and know your financing options as an immigrant buyer.",
    steps: [
      {
        title: "Understand your eligibility",
        why: "Permanent residents (green card holders), visa holders, DACA recipients, and even undocumented immigrants have bought homes in the U.S. Immigration status affects your loan options, not your legal right to own property.",
        actions: [
          "Green card holders: eligible for conventional loans and FHA loans on the same terms as citizens.",
          "Visa holders (H-1B, O-1, etc.): eligible for many loan programs — lenders may require additional documentation.",
          "DACA holders: some lenders offer FHA loans to DACA recipients; policies vary by lender.",
          "No SSN? ITIN mortgages exist at some community banks and credit unions.",
        ],
        chatPrompt: "Can immigrants buy homes in the U.S.? I'm [immigration status] — what mortgage options might be available to me?",
        estimatedDays: 3,
      },
      {
        title: "Build your credit and savings",
        why: "Most mortgages require a credit score of at least 580–620 and a down payment of 3.5–20% of the home price. These take time to build — starting early dramatically expands your options.",
        actions: [
          "Aim for a credit score of at least 620 (580 for FHA loans).",
          "Save for a down payment: 3.5% for FHA (with 580+ score), 3% for some conventional loans.",
          "Down payment assistance programs exist in many states for first-time buyers with lower incomes.",
          "Keep your debt-to-income ratio (DTI) below 43% — this is monthly debt payments / gross monthly income.",
        ],
        chatPrompt: "How much do I need saved for a down payment, and how does my credit score affect the mortgage rate I'll get?",
        estimatedDays: 365,
      },
      {
        title: "Get pre-approved for a mortgage",
        why: "Pre-approval tells you exactly how much you can borrow and makes sellers take you seriously. It's not a commitment — just information.",
        actions: [
          "Shop at least 3 lenders — rates can vary by 0.5% or more, which adds up to thousands over a 30-year loan.",
          "For ITIN borrowers: specifically search for 'ITIN mortgage lenders' in your state.",
          "Gather: 2 years of tax returns, 2 months of pay stubs, 2 months of bank statements, ITIN/SSN.",
          "Compare Annual Percentage Rate (APR), not just the interest rate — APR includes fees.",
        ],
        chatPrompt: "I'm ready to get pre-approved for a mortgage. What documents do I need, and how do I compare offers from different lenders?",
        estimatedDays: 30,
      },
      {
        title: "Work with a real estate agent and make an offer",
        why: "A buyer's agent is typically free to you — their commission is paid by the seller. But they work on your behalf. Finding a good agent who understands immigrant buyer needs makes the process far less overwhelming.",
        actions: [
          "Ask for referrals from community members, religious organizations, or immigrant networks.",
          "Look for agents who speak your language or have experience with immigrant buyers.",
          "Your agent will guide you through making an offer, negotiating, inspection, and closing.",
          "Never skip the home inspection — it can reveal serious problems before you commit.",
        ],
        chatPrompt: "How do I find a real estate agent as an immigrant buyer? What questions should I ask them before hiring them?",
        estimatedDays: 90,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  business: {
    label: "Start a Business",
    description: "Launch a legal business in the U.S. — immigrants start businesses at higher rates than the general population.",
    completionMessage:
      "You've built your business foundation — a legal structure, a business bank account, and clarity on your tax obligations. You're running a real business now.",
    steps: [
      {
        title: "Choose a business structure",
        why: "Your business structure affects your taxes, legal liability, and how you're seen by clients. Most solo immigrant entrepreneurs start as a Sole Proprietor or LLC. You don't need a green card or SSN to form an LLC.",
        actions: [
          "Sole Proprietor: simplest, no filing needed. You and the business are legally the same entity.",
          "LLC (Limited Liability Company): separates you from the business legally, protects personal assets. Can be formed with an ITIN.",
          "Many states allow non-citizens and non-residents to form LLCs.",
          "Consult a small business development center (SBDC) — they offer free advising.",
        ],
        links: [
          { label: "Find your local SBDC", href: "https://www.sba.gov/local-assistance/resource-partners/small-business-development-centers-sbdc" },
          { label: "SBA: Choose a business structure", href: "https://www.sba.gov/business-guide/launch-your-business/choose-business-structure" },
        ],
        chatPrompt: "I want to start a business but I'm not a U.S. citizen. Can I form an LLC? What's the difference between a Sole Proprietorship and an LLC?",
        estimatedDays: 14,
      },
      {
        title: "Get an EIN (Employer Identification Number)",
        why: "An EIN is a tax ID for your business — like an SSN but for companies. You need it to open a business bank account, pay employees, and file business taxes. Non-citizens can apply for an EIN using an ITIN.",
        actions: [
          "Apply for an EIN online at IRS.gov — it's free and usually instant.",
          "If you don't have an SSN, you can still get an EIN by calling the IRS and completing Form SS-4.",
          "An EIN also allows you to avoid giving your personal SSN/ITIN to clients on 1099 forms.",
        ],
        links: [
          { label: "Apply for EIN (IRS)", href: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" },
        ],
        chatPrompt: "How do I get an EIN for my new business if I only have an ITIN, not an SSN?",
        estimatedDays: 1,
      },
      {
        title: "Open a business bank account",
        why: "Mixing business and personal money is the #1 bookkeeping mistake new business owners make. It makes taxes harder, reduces legal protection if you have an LLC, and makes your business look less credible.",
        actions: [
          "Most banks require an EIN and business formation documents (articles of incorporation or LLC operating agreement).",
          "Look for business checking accounts with no or low monthly fees if you're just starting out.",
          "Online banks (Mercury, Relay) often have simpler requirements and are immigrant-friendly.",
          "Keep all business income and expenses in this account only.",
        ],
        chatPrompt: "I just got my EIN. How do I open a business bank account, and what documents will they ask for?",
        estimatedDays: 7,
      },
      {
        title: "Set up basic bookkeeping and understand your taxes",
        why: "Self-employment taxes in the U.S. are higher than you might expect — about 15.3% for Social Security and Medicare, plus income tax. Knowing this upfront prevents a nasty surprise at tax time.",
        actions: [
          "Set aside 25–30% of every payment you receive for taxes (self-employment + income tax).",
          "Quarterly estimated taxes are due in April, June, September, and January.",
          "Track every business expense — software, equipment, home office, mileage — they reduce your tax bill.",
          "Free tool: Wave accounting (free for small businesses). Paid: QuickBooks, FreshBooks.",
          "Consider a free consultation with SCORE (mentors) or your local SBDC.",
        ],
        links: [
          { label: "SCORE free mentoring", href: "https://www.score.org" },
          { label: "IRS self-employment taxes", href: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes" },
        ],
        chatPrompt: "I'm self-employed. How do I figure out how much to set aside for taxes each quarter, and what business expenses can I deduct?",
        estimatedDays: 7,
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────
// Helper utilities
// ─────────────────────────────────────────────────────────────

/** Get a workflow by goal type. Returns undefined for unknown goal types. */
export function getWorkflow(goalType: string): WorkflowMeta | undefined {
  return WORKFLOWS[goalType as PrimaryGoal];
}

/** Total number of steps in a workflow. */
export function getStepCount(goalType: string): number {
  return getWorkflow(goalType)?.steps.length ?? 0;
}

/** Current step object (0-indexed). Returns undefined if out of range. */
export function getCurrentStep(goalType: string, stepIndex: number): WorkflowStep | undefined {
  return getWorkflow(goalType)?.steps[stepIndex];
}

/** Progress percentage (0–100). */
export function getProgressPct(goalType: string, currentStep: number): number {
  const total = getStepCount(goalType);
  if (total === 0) return 0;
  return Math.round((currentStep / total) * 100);
}

/** Check if goal is fully complete (current step >= total steps). */
export function isGoalComplete(goalType: string, currentStep: number): boolean {
  return currentStep >= getStepCount(goalType);
}

/**
 * Returns the step index a user should START at based on their profile.
 * Skips steps whose skipIf() returns true for the user's profile.
 * This prevents showing irrelevant steps (e.g. "get an ITIN" to someone who has an SSN).
 */
export function getSmartStartStep(goalType: string, profile: UserProfile): number {
  const workflow = getWorkflow(goalType);
  if (!workflow) return 0;
  for (let i = 0; i < workflow.steps.length; i++) {
    const step = workflow.steps[i];
    if (!step.skipIf || !step.skipIf(profile)) return i;
  }
  return 0;
}

/**
 * Get the next non-skipped step index after the current one.
 * Used when going forward to skip over irrelevant steps.
 */
export function getNextStep(goalType: string, currentStep: number, profile: UserProfile): number {
  const workflow = getWorkflow(goalType);
  if (!workflow) return currentStep + 1;
  for (let i = currentStep + 1; i < workflow.steps.length; i++) {
    const step = workflow.steps[i];
    if (!step.skipIf || !step.skipIf(profile)) return i;
  }
  return currentStep + 1;
}

/**
 * Get the previous non-skipped step index before the current one.
 * Used for the go-back button.
 */
export function getPrevStep(goalType: string, currentStep: number, profile: UserProfile): number {
  const workflow = getWorkflow(goalType);
  if (!workflow) return Math.max(0, currentStep - 1);
  for (let i = currentStep - 1; i >= 0; i--) {
    const step = workflow.steps[i];
    if (!step.skipIf || !step.skipIf(profile)) return i;
  }
  return currentStep;
}

/** All goal types as an ordered list (for the goal-selection UI). */
export const ALL_GOALS: PrimaryGoal[] = [
  "build_credit",
  "bank_account",
  "save_plan",
  "remittance",
  "taxes",
  "home",
  "business",
];
