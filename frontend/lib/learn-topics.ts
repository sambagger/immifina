/**
 * ImmiFina Learn — Topic content
 * Each topic has steps. Steps can have an optional interactiveId
 * that maps to a calculator rendered by LearnTopicViewer.
 */

export type LearnStep = {
  title: string;
  body: string;           // Main explanation (supports \n\n for paragraphs)
  facts?: string[];       // Key facts / bullet points
  warning?: string;       // Amber callout
  tip?: string;           // Green callout
  interactiveId?: string; // Which calculator to show
};

export type LearnTopic = {
  slug: string;
  title: string;
  icon: string;
  tagline: string;
  color: string;          // Tailwind border/bg color token for the card
  steps: LearnStep[];
};

export const LEARN_TOPICS: LearnTopic[] = [
  // ─── BANKING ─────────────────────────────────────────────────────────────
  {
    slug: "banking",
    title: "Opening a Bank Account",
    icon: "🏦",
    tagline: "How to get your first U.S. bank account — even without an SSN.",
    color: "blue",
    steps: [
      {
        title: "Why a bank account matters",
        body: "In the U.S., almost everything financial runs through a bank account — your employer deposits your paycheck there, you pay rent from it, and it's required for most credit applications.\n\nWithout one, you rely on check cashing stores that charge 1–3% of every check. On a $1,000 paycheck, that's $10–$30 every two weeks — over $700 per year just to access your own money.",
        facts: [
          "Check cashers typically charge 1–3% per transaction",
          "Prepaid debit cards often charge $5–$10/month in fees",
          "A free checking account from a credit union costs $0/month",
          "Having a bank account is required to build credit history",
        ],
        tip: "Even if you plan to send most of your money home, a U.S. bank account saves you money and opens doors to credit, loans, and formal financial life here.",
      },
      {
        title: "What documents you need",
        body: "Banks are required by law to verify your identity. What they accept varies — but most accept more than you'd expect.\n\nYou do NOT need a Social Security Number to open a bank account. Many banks accept an ITIN (Individual Taxpayer Identification Number) or foreign passport instead.",
        facts: [
          "Government-issued photo ID: passport, consular ID (matrícula), or state ID",
          "Proof of address: utility bill, lease, or mail in your name (some banks waive this)",
          "SSN or ITIN — but many banks accept foreign passport + ITIN or just a foreign passport",
          "Some banks require an opening deposit ($0–$100)",
        ],
        warning: "Avoid sharing your immigration documents unnecessarily. Banks are not immigration enforcement — they are required to keep your information private.",
        tip: "Credit unions and community banks are often more flexible with documentation than large national banks.",
      },
      {
        title: "Types of accounts",
        body: "There are two main types of bank accounts. Most people start with a checking account and add savings later.",
        facts: [
          "Checking account: for everyday spending — debit card, bill pay, direct deposit",
          "Savings account: for keeping money safe — earns a little interest, limited withdrawals",
          "Second-chance checking: for people who were denied due to past banking problems (ChexSystems)",
          "Credit union accounts: often lower fees and more community-focused than big banks",
        ],
        tip: "Look for accounts with no monthly fee, no minimum balance, and free ATM access. Many online banks and credit unions offer all three.",
      },
      {
        title: "Choosing the right bank",
        body: "Not all banks are immigrant-friendly. Some specifically market to people without SSNs or with international backgrounds.\n\nKey things to compare: monthly fees, minimum balance requirements, ATM network, and whether they accept your ID.",
        facts: [
          "Large national banks (Chase, BofA, Wells Fargo): widely available, variable on ITIN acceptance",
          "Credit unions: nonprofit, member-owned, often more flexible",
          "Online banks (Chime, Current, Varo): no fees, but no cash deposits",
          "BankOn certified accounts: designed for underbanked communities, guaranteed low fees",
        ],
        interactiveId: "bank-fee-calculator",
        tip: "Search 'BankOn accounts near me' at joinbankon.org — these accounts are certified to have low fees and accept alternative IDs.",
      },
      {
        title: "Opening your account",
        body: "Once you've chosen a bank, opening an account takes 15–30 minutes in person or online. Here's exactly what to expect.",
        facts: [
          "Step 1: Gather your ID, proof of address, and opening deposit if required",
          "Step 2: Visit a branch or go to the bank's website",
          "Step 3: Fill out the application — name, address, date of birth, ID number",
          "Step 4: The bank runs a ChexSystems check (banking history, not credit)",
          "Step 5: Fund the account if there's a minimum deposit",
          "Step 6: You'll get a debit card in 5–7 business days",
        ],
        tip: "If you're denied, ask why — it may be a ChexSystems issue from a previous account, not your immigration status. Second-chance accounts exist specifically for this.",
      },
    ],
  },

  // ─── CREDIT ──────────────────────────────────────────────────────────────
  {
    slug: "credit",
    title: "Building Credit",
    icon: "💳",
    tagline: "How credit scores work and how to build yours from zero.",
    color: "teal",
    steps: [
      {
        title: "What is a credit score?",
        body: "A credit score is a number from 300 to 850 that tells lenders how likely you are to repay borrowed money. The higher the number, the better.\n\nYour score is calculated from your credit report — a record of every loan, credit card, and payment you've made in the U.S. If you just arrived, you have no report and no score. This is called being 'credit invisible.'",
        facts: [
          "300–579: Poor — most lenders won't approve you",
          "580–669: Fair — limited options, higher interest rates",
          "670–739: Good — most loans available at reasonable rates",
          "740–799: Very Good — most products available",
          "800–850: Exceptional — best rates on everything",
        ],
        tip: "Having no credit score is different from having a bad score. Lenders can't see your history from your home country — you're starting fresh, not starting behind.",
      },
      {
        title: "What affects your score",
        body: "Five factors make up your credit score. Payment history and credit utilization matter the most by far.",
        facts: [
          "Payment history (35%): Did you pay on time? Late or missed payments hurt the most",
          "Credit utilization (30%): How much of your credit limit are you using? Keep it under 30%",
          "Length of history (15%): How long have you had accounts? Older is better",
          "Credit mix (10%): Do you have different types — cards, loans? Variety helps",
          "New inquiries (10%): Did you apply for a lot of credit recently? Too many hurts",
        ],
        warning: "Paying the minimum is not the same as paying on time — it helps your payment history, but carrying a high balance hurts your utilization score.",
        interactiveId: "credit-score-estimator",
      },
      {
        title: "How immigrants build credit from zero",
        body: "Since your home country credit history doesn't transfer, you need to create a U.S. credit file from scratch. There are three main paths.",
        facts: [
          "Secured credit card: You deposit $200–$500, use the card for small purchases, and pay it off every month. The bank reports your payments to the credit bureaus, building your file.",
          "Credit builder loan: A special loan where the money is held in a savings account while you make payments. When done, you get the money and a 12-month payment history.",
          "Become an authorized user: A trusted family member or friend adds you to their existing card. You get their history without needing to apply.",
        ],
        tip: "The fastest path: open a secured card, use it only for 1–2 small purchases per month, and pay the full balance every month. You can see a real score in 6 months.",
      },
      {
        title: "ITIN holders and credit",
        body: "If you have an ITIN (no SSN), you can still build credit — it just takes a few more steps to find the right lender.\n\nSome credit card issuers and credit unions specifically work with ITIN holders. These are often smaller institutions or fintechs that serve the immigrant community.",
        facts: [
          "Self Financial: credit builder loans that accept ITIN",
          "Nova Credit: translates credit history from 15+ countries to U.S. equivalent",
          "Mission Asset Fund: zero-interest lending circles that build credit",
          "Many credit unions: local credit unions often more flexible than big banks",
        ],
        tip: "Nova Credit works with AmEx, MPOWER, and others to let you use foreign credit history when applying for U.S. products. Check nova-credit.com if you have credit in your home country.",
      },
      {
        title: "Products and traps to avoid",
        body: "Not all credit products are equal. Some are designed to look helpful but trap people in high-cost debt.",
        facts: [
          "Predatory secured cards: Some charge application fees + annual fees + monthly fees that eat your deposit. Avoid cards with a fee over $40/year.",
          "Payday loans: APR of 300–500%. These do NOT build credit and create debt cycles.",
          "Rent-to-own stores: Furniture and electronics at 3–4x retail price. Not worth it.",
          "Store credit cards: Very high APR (25–30%). Only useful if paid in full every month.",
        ],
        warning: "If someone promises to 'fix' your credit for a fee, it's almost certainly a scam. Negative information on your credit report cannot legally be removed before 7 years unless it's an error.",
        tip: "Free nonprofit credit counseling is available through NFCC.org. They'll review your situation at no cost and give you a real plan.",
      },
    ],
  },

  // ─── TAXES ───────────────────────────────────────────────────────────────
  {
    slug: "taxes",
    title: "Filing Your Taxes",
    icon: "🧾",
    tagline: "Who has to file, what forms you'll get, and how to do it free.",
    color: "amber",
    steps: [
      {
        title: "Who has to file taxes?",
        body: "In the U.S., almost everyone who earns money must file a federal tax return — including immigrants, visa holders, and ITIN holders. This is not optional.\n\nThe IRS taxes income earned in the U.S. regardless of immigration status. Filing is also how you claim a refund if you paid too much through paycheck withholding.",
        facts: [
          "U.S. citizens and green card holders: must file on worldwide income",
          "Visa holders and undocumented workers: must file on U.S.-earned income",
          "ITIN holders: file exactly like SSN holders — same forms, same deadlines",
          "Filing deadline: April 15 each year (extensions available)",
        ],
        tip: "Filing taxes even without legal status actually helps your case if you ever apply for a visa or green card — it shows you've been compliant with tax law.",
      },
      {
        title: "SSN vs ITIN — what you need to file",
        body: "To file taxes, you need either a Social Security Number (SSN) or an ITIN. The IRS created ITIN specifically for people who have a tax filing requirement but aren't eligible for an SSN.\n\nApplying for an ITIN requires submitting Form W-7 with your first tax return. Once you have it, you'll use it on all future returns.",
        facts: [
          "SSN: issued by Social Security Administration to those authorized to work",
          "ITIN: issued by the IRS, starts with '9', used only for tax purposes",
          "ITIN does NOT authorize you to work, claim Social Security benefits, or change immigration status",
          "ITIN expires if not used on a return for 3 consecutive years",
        ],
        tip: "You can apply for an ITIN at a VITA site — they're certified to certify your identity documents on-site, which saves you from mailing your passport to the IRS.",
      },
      {
        title: "Tax forms you'll receive",
        body: "Employers and financial institutions are required to send you forms summarizing what you earned and what taxes were withheld. These arrive by mail in January–February each year.",
        facts: [
          "W-2: From your employer — shows wages earned and taxes withheld",
          "1099-NEC: If you're self-employed or did contract work",
          "1099-INT: Interest earned from a bank account",
          "1042-S: For foreign nationals receiving certain types of income",
          "1095: Health insurance coverage form (may be needed to avoid a penalty)",
        ],
        warning: "Keep all your tax forms in one folder. If you get a W-2, you MUST report that income — the IRS already has a copy from your employer.",
      },
      {
        title: "Calculate your take-home pay",
        body: "Before you file, it helps to understand why your paycheck is smaller than your salary. Several deductions come out automatically.\n\nFederal income tax, Social Security, and Medicare (FICA) are taken out of every paycheck. The amounts depend on your income and how you filled out your W-4.",
        facts: [
          "Federal income tax: 10–37% depending on income bracket",
          "Social Security (FICA): 6.2% of wages up to $168,600",
          "Medicare: 1.45% of all wages",
          "State income tax: 0% (TX, FL, WA, etc.) to ~13% (CA)",
        ],
        interactiveId: "take-home-calculator",
      },
      {
        title: "Free tax help: VITA",
        body: "VITA (Volunteer Income Tax Assistance) is an IRS program that provides free tax preparation for people who generally earn $67,000 or less. All volunteers are IRS-certified.\n\nVITA sites are especially helpful for immigrants — many have multilingual staff, can handle ITIN applications, and understand the specific situations immigrants face.",
        facts: [
          "100% free — no charge for federal or state returns",
          "Available February through April 15 each year",
          "Many sites speak Spanish, Chinese, Vietnamese, and other languages",
          "ITIN holders are welcome — VITA volunteers are trained on this",
          "Find a site: call 1-800-906-9887 or visit irs.gov/vita",
        ],
        tip: "Bring: all your W-2s / 1099s, last year's tax return (if you have it), your ID, your ITIN or SSN, and bank account info for direct deposit of your refund.",
      },
    ],
  },

  // ─── REMITTANCE ──────────────────────────────────────────────────────────
  {
    slug: "remittance",
    title: "Sending Money Home",
    icon: "💸",
    tagline: "How to compare services and keep more of your money.",
    color: "purple",
    steps: [
      {
        title: "How remittances work",
        body: "A remittance is money you send from the U.S. to family in another country. The U.S. is the world's largest sender of remittances — immigrants send over $150 billion home every year.\n\nTransfer services make money two ways: a flat transfer fee (shown upfront) and a markup on the exchange rate (often hidden). The exchange rate markup is frequently larger than the fee.",
        facts: [
          "Over 50 million immigrants in the U.S. send money abroad regularly",
          "Average transfer fee: $5–$15 for $200 sent",
          "Exchange rate markup: typically 1–5% above the mid-market rate",
          "Total cost on $200: can range from $2 (Wise) to $20+ (some banks)",
        ],
        tip: "Always check the total cost — fee PLUS exchange rate — not just the advertised fee. Some services advertise '$0 fee' but make it up on the exchange rate.",
      },
      {
        title: "Understanding exchange rates",
        body: "The exchange rate determines how many pesos, quetzales, or rupees your dollars become. There are two rates to know: the mid-market rate (the real rate) and the rate you're offered (always worse).\n\nThe difference between those two rates is the provider's profit margin. A 2% markup on $500 is $10 — often more than the stated fee.",
        facts: [
          "Mid-market rate: the real exchange rate, shown on Google or xe.com",
          "Transfer rate: what you're offered — always slightly worse",
          "Spread: the difference — this is profit for the company",
          "A 2% spread on $300 = $6 hidden fee on top of any stated fee",
        ],
        interactiveId: "remittance-calculator",
        tip: "Search 'USD to MXN' on Google to see the real mid-market rate. Then compare what each provider offers to see the real cost.",
      },
      {
        title: "Comparing the main services",
        body: "The best service depends on where you're sending to and how your recipient wants to receive the money. Here's a general comparison.",
        facts: [
          "Wise: usually lowest total cost, bank-to-bank, best for large amounts",
          "Remitly: competitive for Latin America and Asia, cash pickup available",
          "WorldRemit: wide country coverage, mobile wallet options",
          "Western Union / MoneyGram: most locations worldwide, higher fees",
          "Your bank's wire: often most expensive — $25–$45 per transfer",
          "Cash App / Zelle: US-only, not for international",
        ],
        warning: "Bank international wires are almost always the most expensive option. Never use your bank's wire transfer without comparing alternatives first.",
        tip: "Use Remitly's comparison tool or send.transferwise.com/compare to see total cost side by side for your specific corridor.",
      },
      {
        title: "Calculate your transfer cost",
        body: "Use this calculator to see how much you keep after fees and exchange rate markups, and estimate annual savings if you switch services.",
        interactiveId: "remittance-fee-calculator",
        facts: [
          "Small differences add up: saving $8 per transfer × 24 transfers/year = $192/year",
          "Most people send money 2–4 times per month",
          "Cash pickup vs bank deposit can affect which service is cheapest",
        ],
      },
    ],
  },

  // ─── PAYCHECK ────────────────────────────────────────────────────────────
  {
    slug: "paycheck",
    title: "Understanding Your Paycheck",
    icon: "📄",
    tagline: "Why your take-home is less than your salary — and what every deduction means.",
    color: "green",
    steps: [
      {
        title: "Gross pay vs net pay",
        body: "Your salary or hourly rate is your gross pay — the number before anything comes out. Your net pay (or 'take-home pay') is what actually hits your bank account after deductions.\n\nFor most workers, the difference is 20–35% of gross pay. On a $3,000/month salary, you might take home $2,100–$2,400.",
        facts: [
          "Gross pay: your total earnings before any deductions",
          "Net pay: what you actually receive after all deductions",
          "Mandatory deductions: federal tax, state tax (if any), Social Security, Medicare",
          "Optional deductions: health insurance, retirement contributions (401k), dental/vision",
        ],
        tip: "Your pay stub shows every single deduction. If something looks wrong — like a deduction you didn't agree to — ask your employer's HR department immediately.",
      },
      {
        title: "Federal income tax withholding",
        body: "Federal income tax is withheld from every paycheck based on your W-4 form. The W-4 tells your employer how much to withhold based on your filing status and any adjustments.\n\nYou don't pay a flat rate — the U.S. uses a progressive tax system where higher income is taxed at higher rates (brackets).",
        facts: [
          "10%: on income up to ~$11,600 (single filer, 2024)",
          "12%: on income from $11,601 to $47,150",
          "22%: on income from $47,151 to $100,525",
          "These are marginal rates — you don't pay 22% on ALL income, only the part above $47,150",
          "Standard deduction (2024): $14,600 for single filers — this reduces your taxable income",
        ],
        tip: "If you filled out your W-4 with the default settings, your withholding will usually be close to what you owe. You'll either get a small refund or owe a small amount at tax time.",
      },
      {
        title: "FICA: Social Security and Medicare",
        body: "FICA stands for Federal Insurance Contributions Act. These deductions fund Social Security (retirement benefits) and Medicare (health insurance for people 65+).\n\nEven if you're not eligible to receive these benefits due to immigration status, you still pay into the system. ITIN holders and undocumented workers pay FICA too.",
        facts: [
          "Social Security: 6.2% of your wages (your employer matches this)",
          "Medicare: 1.45% of your wages (your employer matches this)",
          "Total FICA: 7.65% from your paycheck",
          "FICA applies to wages up to $168,600 for Social Security (no cap for Medicare)",
        ],
        warning: "If you're an undocumented worker paying FICA, you may never be able to claim those benefits. This is a real cost. Some advocacy organizations work on this issue.",
      },
      {
        title: "Decode your own paycheck",
        body: "Enter your details below to see a breakdown of exactly where your money goes each pay period.",
        interactiveId: "paycheck-decoder",
        facts: [
          "Hourly workers: multiply hourly rate × hours worked = gross pay",
          "Salary workers: annual salary ÷ 26 = gross pay per biweekly paycheck",
          "Health insurance premiums are taken pre-tax — this reduces your taxable income",
          "401k contributions are also pre-tax if traditional (not Roth)",
        ],
      },
    ],
  },

  // ─── BENEFITS ────────────────────────────────────────────────────────────
  {
    slug: "benefits",
    title: "Benefits & Public Programs",
    icon: "🛡️",
    tagline: "Which programs are safe to use and what you need to know.",
    color: "red",
    steps: [
      {
        title: "What is the public charge rule?",
        body: "The 'public charge' rule is an immigration policy that can affect some people applying for green cards or certain visas. If the government decides you are likely to rely primarily on government benefits, it can affect your application.\n\nThis rule scares many immigrants away from benefits they have a legal right to use — and that you paid into through taxes.",
        facts: [
          "Public charge only applies to people applying for a green card or certain nonimmigrant visas",
          "It does NOT apply to refugees, asylees, DACA recipients, or most visa holders",
          "It does NOT apply to people who are already green card holders",
          "Most benefits are NOT counted under public charge rules",
        ],
        warning: "If you have an active immigration case or are applying for a visa/green card, consult an immigration attorney before using any government benefit. Many offer free consultations.",
        tip: "The National Immigration Law Center (nilc.org) publishes free, updated guides on exactly which benefits are safe for which immigration statuses.",
      },
      {
        title: "Benefits NOT counted under public charge",
        body: "Most benefits immigrants use are NOT counted under the public charge test. The list of counted benefits is much shorter than most people fear.",
        facts: [
          "✅ SAFE: Medicaid for emergency services only",
          "✅ SAFE: Children's health insurance (CHIP)",
          "✅ SAFE: School lunch programs",
          "✅ SAFE: WIC (nutrition for pregnant women and young children)",
          "✅ SAFE: SNAP (food stamps) for children under 18",
          "✅ SAFE: Tax credits (EITC, Child Tax Credit)",
          "✅ SAFE: COVID-19 vaccines and treatments",
          "✅ SAFE: Unemployment insurance (if you paid into it)",
        ],
        tip: "Benefits used by your U.S. citizen or green card holder family members are NEVER counted against you.",
      },
      {
        title: "Benefits that MAY be counted",
        body: "A small set of cash assistance programs ARE considered under the public charge test. However, the standard is 'primarily dependent' — using one benefit temporarily doesn't automatically make you a public charge.",
        facts: [
          "⚠️ Supplemental Security Income (SSI)",
          "⚠️ Temporary Assistance for Needy Families (TANF) — cash assistance",
          "⚠️ Long-term institutional care at government expense",
          "⚠️ Non-emergency Medicaid (for adults, not children)",
          "⚠️ Section 8 housing vouchers",
        ],
        warning: "This list can change with administration policy. Always check the current rules at uscis.gov or with an immigration attorney before making decisions.",
      },
      {
        title: "Where to get help",
        body: "Navigating benefits is complicated — especially for immigrants. These free resources can help you understand what you qualify for and how to apply safely.",
        facts: [
          "Benefits.gov: official tool to find programs you may qualify for",
          "211.org or dial 211: connects you to local social services in your area",
          "SNAP helpline: 1-800-221-5689",
          "WIC local office: search wiclocator.fns.usda.gov",
          "ImmigrationAdvocates.org: find free immigration legal help near you",
          "CLINIC (cliniclegal.org): Catholic legal immigration network",
        ],
        tip: "Call 211 from any phone — it's free, available 24/7, and can connect you to food, housing, childcare, health, and financial assistance in your area.",
      },
    ],
  },
];

export function getLearnTopic(slug: string): LearnTopic | undefined {
  return LEARN_TOPICS.find((t) => t.slug === slug);
}
