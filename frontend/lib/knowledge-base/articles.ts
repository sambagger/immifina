/**
 * ImmiFina Knowledge Base — v1 Articles
 *
 * Each article has a slug, category, title, and body.
 * The embed-knowledge.ts script chunks these by paragraph,
 * generates embeddings, and upserts into knowledge_chunks.
 *
 * Keep paragraphs under ~400 words so chunks stay focused.
 * Separate paragraphs with a blank line (\n\n).
 *
 * UPDATING CONTENT:
 * Edit the `body` text below and re-run:
 *   npx tsx scripts/embed-knowledge.ts
 * Only changed articles (by checksum) will be re-embedded.
 */

export type KnowledgeArticle = {
  slug: string;
  title: string;
  category:
    | "credit"
    | "banking"
    | "taxes"
    | "remittance"
    | "paycheck"
    | "benefits"
    | "immigration"
    | "savings";
  tags: string[];
  body: string;
};

export const ARTICLES: KnowledgeArticle[] = [

  // ────────────────────────────────────────────────────────────
  {
    slug: "itin",
    title: "What Is an ITIN and How Do You Get One?",
    category: "taxes",
    tags: ["itin", "ssn", "tax", "form w-7", "filing"],
    body: `An ITIN — Individual Taxpayer Identification Number — is a tax processing number issued by the IRS to people who are required to file U.S. taxes but are not eligible for a Social Security Number (SSN). ITINs are nine digits and always start with the number 9, in the format 9XX-XX-XXXX.

Who needs an ITIN? You may need one if you are a nonresident alien required to file a U.S. tax return, a U.S. resident alien (based on days present in the U.S.) who files a tax return, or a dependent or spouse of a U.S. citizen or resident alien. Many immigrants who earn income in the U.S. but don't have an SSN need an ITIN to file their taxes legally.

An ITIN does not: authorize you to work in the U.S., make you eligible for Social Security benefits, or change your immigration status. It is purely a tax filing tool.

To apply for an ITIN, you file IRS Form W-7 (Application for IRS Individual Taxpayer Identification Number). You can apply when you file your first tax return — you submit Form W-7 along with your completed federal tax return and original identity documents (or certified copies). Acceptable identity documents include a valid passport (most common), a foreign national ID, a U.S. driver's license, or a foreign driver's license.

The easiest way to apply is through a VITA (Volunteer Income Tax Assistance) site. VITA sites are free, and their staff are trained to help you apply for an ITIN and file your return at the same time. To find one near you, visit irs.gov/vita or call 1-800-906-9887.

Processing takes about 7 to 11 weeks from the time the IRS receives your application. If you apply during tax season (January–April), allow extra time. You'll receive your ITIN by mail.

ITINs must be renewed if they expire. ITINs with middle digits 70–88 have been expired. If your ITIN hasn't been used on a federal tax return in three consecutive years, it expires. Renew using the same Form W-7 process.

Having an ITIN opens many doors: you can file taxes and build a tax history, which is useful for visa renewals, rental applications, and mortgage pre-approvals. Some banks, credit unions, and credit card issuers also accept ITINs in place of SSNs.`,
  },

  // ────────────────────────────────────────────────────────────
  {
    slug: "secured-cards",
    title: "How Secured Credit Cards Work",
    category: "credit",
    tags: ["secured card", "credit card", "deposit", "credit building", "no credit history"],
    body: `A secured credit card is a credit card backed by a cash deposit you make upfront. This deposit acts as collateral — it protects the bank if you don't pay your bill. Because the bank's risk is low, secured cards are one of the most accessible credit-building tools for people with no U.S. credit history, including recent immigrants.

How it works: You pay a deposit — typically $200 to $500 — and that becomes your credit limit. You use the card like a regular credit card for everyday purchases, then pay your bill each month. The card issuer reports your payment history to the major credit bureaus (Equifax, TransUnion, Experian), which is how you build a credit score.

What to look for when choosing a secured card: Choose one that reports to all three major credit bureaus. A card that only reports to one bureau builds your credit more slowly. Look for no annual fee or a low annual fee (under $40). Avoid cards with high monthly maintenance fees or processing fees. Check if the issuer offers a "graduation path" — after 12 to 18 months of on-time payments, some issuers automatically upgrade you to an unsecured card and return your deposit.

Some secured cards accept ITINs instead of SSNs. This is important for immigrants who don't yet have a Social Security Number. Call or check the issuer's website before applying, since policies change. Credit unions and community banks are often more flexible than large national banks.

The most important rule: pay your full balance on time every month. Payment history is the biggest factor in your credit score — about 35%. Even one missed payment can set you back significantly. If you can't pay the full balance, pay at least the minimum to avoid late fees.

Keep your balance low. Credit utilization — the percentage of your credit limit you're using — affects about 30% of your score. Try to keep it below 30% of your limit. If your limit is $300, try not to carry more than $90 on the card at once.

After 6 months of responsible use, you'll typically have a credit score you can check for free through your bank app, credit card issuer, or AnnualCreditReport.com. After 12 to 18 months, contact your issuer about upgrading to an unsecured card. When you graduate, your account history carries over — don't close the account, as a longer credit history helps your score.`,
  },

  // ────────────────────────────────────────────────────────────
  {
    slug: "building-credit-no-ssn",
    title: "Building Credit in the U.S. Without an SSN",
    category: "credit",
    tags: ["itin", "credit builder", "no ssn", "immigrant credit", "secured card"],
    body: `One of the most common misconceptions is that you need a Social Security Number to build credit in the U.S. You don't. Many immigrants have successfully built strong credit histories using an ITIN (Individual Taxpayer Identification Number) — and the options are growing.

Secured credit cards with ITIN: Some banks and credit unions accept an ITIN in place of an SSN for secured credit card applications. The application process is the same — you provide your ITIN, a government-issued ID (such as a passport), and an opening deposit. Policies vary by issuer and change over time, so call ahead or check the issuer's current requirements before applying.

Credit builder loans: Some credit unions and community banks offer credit builder loans specifically designed for people with no credit history. Instead of receiving the money upfront, you make monthly payments into a locked savings account. At the end of the loan term (typically 12 to 24 months), you receive the saved amount and gain a payment history on your credit report. These loans are low-risk and effective. Search for "credit builder loan" at local credit unions or community development financial institutions (CDFIs).

Becoming an authorized user: If you have a trusted family member or friend with good credit, ask if they can add you as an authorized user on one of their credit card accounts. You'll get a card tied to their account, and their positive payment history may appear on your credit report — even if you never use the card. This works with many issuers. You don't need an SSN to be added as an authorized user.

Building credit takes time. There's no shortcut. A credit score requires at least one account that's been open for at least 6 months and has been active in the past 6 months. With consistent on-time payments, most people see meaningful credit scores after 6 to 12 months.

What matters most: Payment history (35% of your score) — always pay on time. Credit utilization (30%) — keep balances below 30% of your limit. Length of credit history (15%) — keep accounts open. Avoid applying for too many new accounts at once, as each application triggers a hard inquiry that temporarily lowers your score.

Free resources: Many nonprofit financial counseling organizations help immigrants build credit. Search for HUD-approved housing counselors, NFCC (National Foundation for Credit Counseling) member agencies, or your local CDFI. These services are free or low-cost and provide personalized guidance.`,
  },

  // ────────────────────────────────────────────────────────────
  {
    slug: "w2-explained",
    title: "Understanding Your W-2: Every Box Explained",
    category: "paycheck",
    tags: ["w-2", "taxes", "paycheck", "withholding", "wages"],
    body: `A W-2 is the Wage and Tax Statement your employer sends you by January 31 each year. It reports your total earnings and all the taxes withheld from your paychecks during the prior year. You use it to file your federal and state tax returns.

Box 1 — Wages, tips, other compensation: This is your total taxable wages for the year. It's not the same as your gross pay — it excludes pre-tax benefits like 401(k) contributions and health insurance premiums you paid through work. This is the number you report as income on your federal tax return.

Box 2 — Federal income tax withheld: The total amount withheld from your paychecks for federal income tax. If this number is higher than what you actually owe, you get a refund. If it's lower, you owe the difference.

Box 3 — Social Security wages and Box 4 — Social Security tax withheld: Box 3 shows the wages subject to Social Security tax. Box 4 shows 6.2% of those wages, which is the Social Security portion of FICA that was withheld. Social Security wages are capped at $160,200 for 2023 — you won't see Box 4 exceed $9,932.40.

Box 5 — Medicare wages and Box 6 — Medicare tax withheld: Box 5 is wages subject to Medicare tax (usually the same as Box 1). Box 6 shows the Medicare portion withheld — 1.45% of Box 5. High earners pay an additional 0.9% Medicare surcharge, but this typically appears on your tax return rather than your W-2.

Box 12 — Various codes: This box can show several items using letter codes. Common ones: Code D = traditional 401(k) contributions. Code W = employer contributions to your Health Savings Account (HSA). Code DD = cost of employer-sponsored health coverage (informational only, not taxable). Code EE = Roth 401(k) contributions.

Box 14 — Other: Employers use this box for information that doesn't fit elsewhere — state disability insurance paid, union dues, educational assistance, or other local items. What's shown here depends on your employer and state.

Boxes 15–17 — State tax information: Shows your state wages, state income tax withheld, and the state abbreviation. If you worked in more than one state during the year, you may receive a W-2 with multiple state entries or separate W-2s from the same employer.

If your W-2 is wrong, contact your employer's payroll department immediately. Employers are required to issue a corrected W-2 (called a W-2c) if they made an error. Don't file your taxes using incorrect W-2 information.`,
  },

  // ────────────────────────────────────────────────────────────
  {
    slug: "remittance-options",
    title: "How to Send Money Home: Comparing Your Options",
    category: "remittance",
    tags: ["remittance", "wire transfer", "fees", "exchange rate", "money transfer"],
    body: `Sending money to family abroad is a regular and important financial act for millions of immigrants. Understanding how the system works helps you keep more money in your family's hands instead of paying it to transfer services.

The true cost of a transfer has two components: the flat fee and the exchange rate margin. Many services advertise low or zero fees but make most of their money on the exchange rate. They give you a worse exchange rate than the mid-market rate (the "real" rate you see on Google or XE.com), and pocket the difference. To compare providers fairly, you need to calculate how many foreign currency units your recipient actually receives — not just the fee you pay upfront.

Example: You send $500. Service A charges a $5 fee and gives an exchange rate of 16.5 pesos per dollar. Service B charges no fee but gives 15.8 pesos per dollar. Service A actually delivers 8,250 pesos. Service B delivers 7,900 pesos. Service A is cheaper despite the fee.

To compare providers: Use a tool like Remittance Prices Worldwide (remittanceprices.worldbank.org) or Monito (monito.com) to compare the total cost for your specific sending amount and destination country. Both sites show the total amount received, not just the fee.

Digital app transfers (Wise, Remitly, WorldRemit, Sendwave, etc.): Generally lowest cost for most corridors. Transfers require a bank account or debit card on your end, and a bank account or mobile money account on the recipient's end. Initial identity verification takes 1–3 days but transfers are then fast (often same-day or next-day). Best for regular senders.

Traditional wire transfers (Western Union, MoneyGram): Higher fees and exchange rate margins than apps, but offer cash pickup at thousands of locations — useful if your recipient doesn't have a bank account. Convenient for one-time urgent transfers. Rates vary significantly by country.

Bank wire transfers: Often the most expensive option for international transfers. Your bank charges a flat fee ($25–$45 typically), plus a poor exchange rate. Better for large transfers where the percentage cost matters less.

Mobile money transfers: In many countries (Mexico, Kenya, Philippines, India, etc.), recipients can receive money directly to a mobile money wallet (like M-Pesa or GCash) without a bank account. Services like Sendwave, WorldRemit, and Remitly support these. Low cost and fast.

Practical tips: Set up your account before you urgently need to send money — first-time verification takes a few days. Check exchange rates on a regular schedule rather than always sending at the same time — rates fluctuate. Some services offer rate locks or forward contracts for large amounts. Never send money to someone you haven't met in person; remittance fraud is common.`,
  },

  // ────────────────────────────────────────────────────────────
  {
    slug: "itin-banking",
    title: "Opening a U.S. Bank Account With an ITIN",
    category: "banking",
    tags: ["itin", "bank account", "no ssn", "banking", "checking"],
    body: `Many immigrants believe they cannot open a U.S. bank account without a Social Security Number. This is not true. Thousands of banks and credit unions accept ITINs, passports, and foreign government IDs to open accounts.

Why it matters: A bank account protects your money (FDIC insured up to $250,000), eliminates check-cashing fees (which can cost 1–3% per paycheck), enables direct deposit (faster than paper checks), lets you pay bills online, and is required for most secured credit card and loan applications.

What you'll need: A valid government-issued photo ID (passport is most universally accepted), your ITIN (if you have one — not all banks require it), proof of address (a utility bill, lease, or official mail with your name and address), and an opening deposit (typically $25–$100 for basic checking accounts).

Finding ITIN-friendly banks: Call ahead before visiting. Ask specifically: "Do you accept an ITIN instead of an SSN to open a checking account?" Large national banks vary by branch and manager. Community banks, credit unions, and CDFIs (Community Development Financial Institutions) tend to be more flexible. Some credit unions in immigrant communities specifically market accounts to ITIN holders and provide bilingual service.

Second-chance accounts: If you've had a bank account closed due to overdrafts or issues, you may have a record in ChexSystems — a reporting agency banks use to screen customers. This can prevent you from opening a new account at many banks. Second-chance checking accounts are designed for people with ChexSystems records. They sometimes have higher fees or no overdraft protection, but they provide access to basic banking. Banks like Chime, Wells Fargo Clear Access Banking, and others offer these programs.

Online banks: Some online banks (like Chime, Current, or Varo) have simpler identity requirements and may accept ITIN holders. They typically don't have physical branches but offer full-featured checking and savings accounts, debit cards, and mobile apps. Read the terms carefully — some require an SSN eventually.

Matrícula Consular: The consular ID issued by Mexican consulates is accepted by some banks in high-immigrant areas as a form of ID, sometimes alongside a secondary document. Ask your local bank if they accept it.

What to watch for: Monthly fees that can be avoided with minimum balances or direct deposit. Overdraft fees — ask about overdraft protection options. Minimum balance requirements. ATM fees for out-of-network withdrawals.`,
  },

  // ────────────────────────────────────────────────────────────
  {
    slug: "vita-free-taxes",
    title: "VITA: Free Tax Filing Help for Immigrants",
    category: "taxes",
    tags: ["vita", "tax filing", "free taxes", "itin", "tax prep"],
    body: `VITA — Volunteer Income Tax Assistance — is an IRS-sponsored program that provides free tax filing help to people who earn $67,000 or less per year. VITA sites are staffed by IRS-certified volunteers who prepare and file your federal and state tax returns at no cost.

VITA is especially valuable for immigrants because: sites often have multilingual staff, volunteers are trained on ITIN applications so you can apply for an ITIN and file your return in one visit, they understand common immigrant tax situations (FICA exemptions for certain visa holders, foreign income reporting, treaty benefits), and the service is completely free — no hidden fees.

What VITA can help with: Filing federal and state income tax returns, applying for ITINs (Form W-7), claiming eligible credits like the Earned Income Tax Credit (EITC) and Child Tax Credit, handling W-2 income, 1099 income, self-employment income (at many sites), and first-time filers with no prior U.S. tax history.

What to bring to VITA: Photo ID for yourself and any adult on the return. Social Security cards or ITIN letters for everyone on the return. All W-2 forms from every employer. Any 1099 forms (freelance, interest, rental income, etc.). Last year's tax return (if you have one). Bank account and routing number for direct deposit of your refund. If you paid for childcare, bring the provider's name, address, and tax ID.

Finding a VITA site: Visit irs.gov/vita or call 1-800-906-9887 to find a VITA location near you. VITA sites are typically open January through April (tax season). Some locations operate year-round for ITIN renewals and other services. United Way also runs Tax Aide sites through AARP that serve all ages.

Also consider: MilTax for military families. GetYourRefund.org for virtual VITA filing (you upload documents, a volunteer prepares remotely). IRS Free File at irs.gov/freefile if your income is under $79,000 (you file yourself using free software). SCORE and Small Business Development Centers (SBDCs) for self-employment tax questions.

VITA sites cannot: provide advice on immigration, help with prior year returns in some locations, or handle complex situations like foreign bank accounts over $10,000 (which require an FBAR filing). For those situations, seek a tax professional with immigrant client experience.`,
  },

  // ────────────────────────────────────────────────────────────
  {
    slug: "public-charge-rule",
    title: "Public Charge Rule: Which Benefits Are Safe for Immigrants",
    category: "benefits",
    tags: ["public charge", "immigration", "benefits", "green card", "snap", "medicaid"],
    body: `The public charge rule is one of the most misunderstood aspects of immigration law and has caused many immigrant families to avoid benefits they're legally entitled to — often at significant harm to their health and financial stability.

What is the public charge rule? Under U.S. immigration law, a person can be denied a green card or certain visas if the government believes they are likely to become "primarily dependent" on government benefits in the future. This rule is used when someone applies for a green card from outside the U.S. (consular processing) or adjusts status from within the U.S.

What programs are currently considered under public charge (as of 2023 Biden administration rule): Receipt of cash assistance programs like Supplemental Security Income (SSI) or Temporary Assistance for Needy Families (TANF) for more than 12 months in a 36-month period, AND long-term institutionalization at government expense. The analysis is holistic — it also considers income, assets, age, health, education, and skills.

What is NOT considered under the current rule (and was never a public charge ground): SNAP (food stamps), Medicaid (with very limited exceptions), CHIP (Children's Health Insurance Program), housing assistance (Section 8), WIC (Women, Infants and Children nutrition program), disaster relief, emergency Medicaid, school lunch programs, and most other non-cash benefits. Vaccination and other public health programs are also exempt.

Who the public charge rule does NOT apply to: Refugees, asylees, DACA recipients, Special Immigrant Juveniles, Victims of trafficking or violence (T and U visa holders), people in certain other protected categories. If you are in one of these categories, using any of these benefits generally cannot be held against you.

Important caveats: Immigration law is complex and changes. The rule has changed significantly in recent years — it was modified under Trump, then modified again under Biden. Always verify current policy with an immigration attorney or accredited representative before making decisions about benefits. Many nonprofit immigration legal aid organizations offer free or low-cost consultations.

If you're worried: Seeking medical care, enrolling your U.S.-citizen children in benefits, or using non-cash emergency services generally will not make you a public charge. Fear of the public charge rule should not prevent you from getting emergency medical care.`,
  },

  // ────────────────────────────────────────────────────────────
  {
    slug: "emergency-fund",
    title: "Building an Emergency Fund on a Limited Income",
    category: "savings",
    tags: ["emergency fund", "savings", "financial safety net", "budgeting"],
    body: `An emergency fund is money set aside specifically for unexpected expenses — a medical bill, car repair, job loss, or family crisis. It's the single most important financial safety net you can build, regardless of income level.

Why it matters so much for immigrants: Many immigrants have family obligations, irregular income, or jobs without paid sick leave. Without an emergency fund, a single unexpected expense can lead to high-interest debt, missing rent, or borrowing from family. An emergency fund breaks that cycle.

The goal: Start with one month of essential expenses (rent, food, utilities, transportation). This is your first milestone. Then build toward three to six months. Most financial advice is aimed at higher-income households — for someone earning $2,500 per month with $2,200 in expenses, the first target might be $2,200, not $10,000. Start where you are.

Where to keep it: In a separate savings account — separate from your checking account so you're not tempted to spend it. A high-yield savings account (HYSA) pays significantly more interest than a traditional savings account. As of 2024, many HYSAs offer 4–5% annual interest. You can open one at online banks like Marcus, Ally, or SoFi. Some require only $1 to open with no monthly fee.

How to build it on a tight budget: Even $10 or $20 per paycheck adds up. $20 per week is over $1,000 in a year. Set up automatic transfers on payday so the money moves before you can spend it. Tax refunds are an excellent opportunity to jumpstart your emergency fund — if you receive a refund, put at least half directly into savings. Sell items you no longer need. Take on extra hours if available. Reduce one recurring expense.

What counts as an emergency: Job loss. Medical bills not covered by insurance. Essential car repairs. Emergency travel for family. Home repairs (for renters, this includes replacing broken appliances you're responsible for). What is not an emergency: A sale, a vacation, a planned expense you didn't budget for. Protect the fund.

When you use it: Replenish it as soon as possible. Treat rebuilding the fund as a priority after any withdrawal. Having even a partial emergency fund is better than none — $500 can handle many common emergencies.`,
  },

  // ────────────────────────────────────────────────────────────
  {
    slug: "paycheck-deductions",
    title: "Understanding Your Paycheck Deductions",
    category: "paycheck",
    tags: ["paycheck", "fica", "withholding", "taxes", "deductions", "w-4"],
    body: `If you've ever looked at your paycheck and wondered why you received so much less than your salary, you're not alone. Your gross pay (what you earned) is reduced by a series of deductions before you receive your net pay (take-home pay). Understanding each one helps you plan your budget accurately.

Federal income tax withholding: Your employer withholds federal income tax based on your W-4 form. The W-4 tells your employer how much to withhold — based on your filing status, dependents, and any additional withholding you request. If too much is withheld, you get a refund when you file. If too little, you owe taxes. Most employees should review their W-4 after major life changes (new job, marriage, baby, buying a home).

FICA — Social Security tax: 6.2% of your gross wages up to $160,200 (2023 limit), withheld for Social Security. Your employer matches this 6.2%. Social Security contributions fund your future retirement and disability benefits — but only if you have enough work credits (generally 40 quarters, or 10 years, of covered work). ITIN holders can pay into Social Security through FICA, but may not be able to collect benefits depending on their immigration status and future residency.

FICA — Medicare tax: 1.45% of all your wages, withheld for Medicare. No income cap. If you earn over $200,000, an additional 0.9% is withheld. Again, your employer matches the base 1.45%.

Note for certain visa holders: Some non-immigrant visa holders (F-1 students, J-1 exchange visitors, certain H-visa holders in their first years) may be exempt from FICA taxes. If you believe you qualify for an exemption, talk to your employer's payroll department and consult a tax advisor.

State income tax: If you live in a state with income tax, your employer withholds state tax based on a state version of the W-4. Nine states have no income tax: Alaska, Florida, Nevada, New Hampshire (on wages), South Dakota, Tennessee (on wages), Texas, Washington, and Wyoming.

Pre-tax deductions (before taxes are calculated): 401(k) contributions, health insurance premiums, FSA/HSA contributions, and dependent care accounts are typically deducted before taxes. This reduces your taxable income, which reduces your federal and state taxes. It's why Box 1 on your W-2 is less than your total earnings.

Post-tax deductions (after taxes): Roth 401(k) contributions (taxed now, tax-free in retirement), life insurance over $50,000, and some other voluntary benefits are deducted after taxes.

Reading your pay stub: Gross pay → subtract pre-tax deductions = taxable wages. Taxable wages → subtract all tax withholdings = net pay after taxes. Net pay → subtract post-tax deductions = take-home pay.`,
  },

];
