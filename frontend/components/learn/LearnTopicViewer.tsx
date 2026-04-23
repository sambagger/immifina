"use client";

import { useState } from "react";
import { Link } from "@/navigation";
import type { LearnTopic } from "@/lib/learn-topics";

// ── Calculators ───────────────────────────────────────────────────────────────

function BankFeeCalculator() {
  const [monthly, setMonthly] = useState(8);
  const [checks, setChecks] = useState(2);
  const [amount, setAmount] = useState(1000);

  const checkCashingCost = checks * amount * 0.02 * 12;
  const bankCost = monthly * 12;
  const savings = Math.max(0, checkCashingCost - bankCost);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-5">
      <p className="text-sm font-semibold text-zinc-200">Annual fee comparison</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">Bank monthly fee ($)</span>
          <input type="number" min={0} max={50} value={monthly}
            onChange={e => setMonthly(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">Paychecks per month</span>
          <input type="number" min={1} max={8} value={checks}
            onChange={e => setChecks(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">Average check amount ($)</span>
          <input type="number" min={100} max={5000} value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-3 text-center">
        <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-3">
          <p className="text-xs text-zinc-500">Check cashing (2% fee)</p>
          <p className="text-xl font-bold text-red-400">${checkCashingCost.toFixed(0)}/yr</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-xs text-zinc-500">Bank account fees</p>
          <p className="text-xl font-bold text-zinc-200">${bankCost.toFixed(0)}/yr</p>
        </div>
        <div className="rounded-lg border border-teal-500/20 bg-teal-950/20 p-3">
          <p className="text-xs text-zinc-500">Annual savings</p>
          <p className="text-xl font-bold text-teal-400">${savings.toFixed(0)}/yr</p>
        </div>
      </div>
    </div>
  );
}

function CreditScoreEstimator() {
  type Accounts = "none" | "few" | "many";
  type Oldest = "none" | "lt6" | "6_12" | "1_2" | "3p";
  type Missed = "na" | "never" | "once" | "several";
  type PayFull = "na" | "always" | "usually" | "no";
  type Inquiries = "0" | "1_2" | "3p";

  const [accounts, setAccounts] = useState<Accounts>("none");
  const [oldest, setOldest] = useState<Oldest>("none");
  const [missed, setMissed] = useState<Missed>("na");
  const [payFull, setPayFull] = useState<PayFull>("na");
  const [inquiries] = useState<Inquiries>("0");

  let base = 520;
  if (accounts === "few") base = 600;
  else if (accounts === "many") base = 710;
  if (oldest === "3p") base += 30;
  else if (oldest === "none" || oldest === "lt6") base -= 30;
  if (missed === "several") base -= 80;
  else if (missed === "once") base -= 35;
  if (payFull === "always") base += 25;
  else if (payFull === "no") base -= 40;
  if (inquiries === "3p") base -= 25;
  const low = Math.max(300, base - 30);
  const high = Math.min(850, base + 30);

  const pct = ((base - 300) / 550) * 100;
  const color = base >= 740 ? "teal" : base >= 670 ? "blue" : base >= 580 ? "amber" : "red";
  const colorMap = { teal: "bg-teal-500", blue: "bg-blue-500", amber: "bg-amber-500", red: "bg-red-500" };

  function Radio<T extends string>({ name, value, current, label, onChange }: { name: string; value: T; current: T; label: string; onChange: (v: T) => void }) {
    return (
      <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${current === value ? "border-teal-500/40 bg-teal-950/30 text-teal-300" : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20"}`}>
        <input type="radio" name={name} checked={current === value} onChange={() => onChange(value)} className="sr-only" />
        {label}
      </label>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-5">
      <p className="text-sm font-semibold text-zinc-200">Estimate your credit score range</p>
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium text-zinc-400">How many credit accounts do you have?</p>
          <div className="flex flex-wrap gap-2">
            <Radio name="acc" value="none" current={accounts} label="None (new to U.S.)" onChange={setAccounts} />
            <Radio name="acc" value="few" current={accounts} label="1–3 accounts" onChange={setAccounts} />
            <Radio name="acc" value="many" current={accounts} label="4+ accounts" onChange={setAccounts} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-zinc-400">Age of your oldest account?</p>
          <div className="flex flex-wrap gap-2">
            <Radio name="old" value="none" current={oldest} label="No accounts" onChange={setOldest} />
            <Radio name="old" value="lt6" current={oldest} label="Under 6 months" onChange={setOldest} />
            <Radio name="old" value="6_12" current={oldest} label="6–12 months" onChange={setOldest} />
            <Radio name="old" value="1_2" current={oldest} label="1–2 years" onChange={setOldest} />
            <Radio name="old" value="3p" current={oldest} label="3+ years" onChange={setOldest} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-zinc-400">Any missed or late payments?</p>
          <div className="flex flex-wrap gap-2">
            <Radio name="mis" value="na" current={missed} label="No accounts yet" onChange={setMissed} />
            <Radio name="mis" value="never" current={missed} label="Never missed" onChange={setMissed} />
            <Radio name="mis" value="once" current={missed} label="Once or twice" onChange={setMissed} />
            <Radio name="mis" value="several" current={missed} label="Several times" onChange={setMissed} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-zinc-400">Do you pay balances in full?</p>
          <div className="flex flex-wrap gap-2">
            <Radio name="pay" value="na" current={payFull} label="No cards yet" onChange={setPayFull} />
            <Radio name="pay" value="always" current={payFull} label="Always" onChange={setPayFull} />
            <Radio name="pay" value="usually" current={payFull} label="Usually" onChange={setPayFull} />
            <Radio name="pay" value="no" current={payFull} label="Carry a balance" onChange={setPayFull} />
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">Estimated range</p>
          <p className="text-2xl font-bold text-white">{low} – {high}</p>
        </div>
        <div className="h-2.5 w-full rounded-full bg-white/10">
          <div className={`h-full rounded-full transition-all duration-500 ${colorMap[color]}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-zinc-600">
          <span>300</span><span>580</span><span>670</span><span>740</span><span>850</span>
        </div>
        <p className="text-xs text-zinc-500">Educational estimate only. Your actual score may differ. Check annualcreditreport.com for your real report.</p>
      </div>
    </div>
  );
}

function TakeHomeCalculator() {
  const [salary, setSalary] = useState(45000);
  const [state, setState] = useState("none");
  const [health, setHealth] = useState(150);
  const [retirement, setRetirement] = useState(3);

  const monthly = salary / 12;
  const retAmt = (salary * retirement) / 100 / 12;
  const taxableMonthly = monthly - health - retAmt;
  const taxableAnnual = taxableMonthly * 12;

  let fedRate = 0.10;
  if (taxableAnnual > 100525) fedRate = 0.22;
  else if (taxableAnnual > 47150) fedRate = 0.22;
  else if (taxableAnnual > 11600) fedRate = 0.12;

  const stateTaxRates: Record<string, number> = { none: 0, CA: 0.093, NY: 0.065, TX: 0, FL: 0, WA: 0, IL: 0.0495 };
  const stateRate = stateTaxRates[state] ?? 0;

  const fedTax = taxableMonthly * fedRate;
  const stateTax = taxableMonthly * stateRate;
  const fica = monthly * 0.0765;
  const totalDeductions = fedTax + stateTax + fica + health + retAmt;
  const takeHome = monthly - totalDeductions;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-5">
      <p className="text-sm font-semibold text-zinc-200">Take-home pay calculator</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">Annual salary ($)</span>
          <input type="number" min={10000} max={200000} step={1000} value={salary}
            onChange={e => setSalary(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">State</span>
          <select value={state} onChange={e => setState(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">
            <option value="none">No state tax (TX, FL, WA...)</option>
            <option value="CA">California</option>
            <option value="NY">New York</option>
            <option value="IL">Illinois</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">Health insurance ($/month)</span>
          <input type="number" min={0} max={800} step={10} value={health}
            onChange={e => setHealth(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">401k contribution (%)</span>
          <input type="number" min={0} max={20} step={1} value={retirement}
            onChange={e => setRetirement(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
        </label>
      </div>
      <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-zinc-500">Gross monthly</span><span className="text-zinc-200">${monthly.toFixed(0)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-zinc-500">Federal tax (~{(fedRate*100).toFixed(0)}%)</span><span className="text-red-400">-${fedTax.toFixed(0)}</span></div>
        {stateTax > 0 && <div className="flex justify-between text-sm"><span className="text-zinc-500">State tax</span><span className="text-red-400">-${stateTax.toFixed(0)}</span></div>}
        <div className="flex justify-between text-sm"><span className="text-zinc-500">FICA (Social Security + Medicare)</span><span className="text-red-400">-${fica.toFixed(0)}</span></div>
        {health > 0 && <div className="flex justify-between text-sm"><span className="text-zinc-500">Health insurance</span><span className="text-red-400">-${health.toFixed(0)}</span></div>}
        {retAmt > 0 && <div className="flex justify-between text-sm"><span className="text-zinc-500">401k</span><span className="text-amber-400">-${retAmt.toFixed(0)}</span></div>}
        <div className="mt-2 border-t border-white/10 pt-2 flex justify-between text-base font-bold">
          <span className="text-zinc-300">Take-home monthly</span>
          <span className="text-teal-400">${Math.max(0, takeHome).toFixed(0)}</span>
        </div>
      </div>
      <p className="text-xs text-zinc-600">Simplified estimate. Actual tax depends on deductions, filing status, and exact bracket calculation.</p>
    </div>
  );
}

function RemittanceCalculator() {
  const [amount, setAmount] = useState(300);
  const [freq, setFreq] = useState(4);
  const [currentFee, setCurrentFee] = useState(12);
  const [currentRate, setCurrentRate] = useState(2);
  const [betterFee, setBetterFee] = useState(2);
  const [betterRate, setBetterRate] = useState(0.5);

  const currentTotal = (currentFee + amount * currentRate / 100) * freq * 12;
  const betterTotal = (betterFee + amount * betterRate / 100) * freq * 12;
  const savings = Math.max(0, currentTotal - betterTotal);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-5">
      <p className="text-sm font-semibold text-zinc-200">Transfer cost calculator</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">Amount per transfer ($)</span>
          <input type="number" min={50} max={2000} step={50} value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">Times per month</span>
          <input type="number" min={1} max={8} value={freq}
            onChange={e => setFreq(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-4 space-y-3">
          <p className="text-xs font-semibold text-red-400">Current service</p>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500">Transfer fee ($)</span>
            <input type="number" min={0} max={50} value={currentFee}
              onChange={e => setCurrentFee(Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500">Exchange rate markup (%)</span>
            <input type="number" min={0} max={10} step={0.5} value={currentRate}
              onChange={e => setCurrentRate(Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <p className="text-sm font-bold text-red-400">${currentTotal.toFixed(0)}/year</p>
        </div>
        <div className="rounded-lg border border-teal-500/20 bg-teal-950/10 p-4 space-y-3">
          <p className="text-xs font-semibold text-teal-400">Better service (e.g. Wise)</p>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500">Transfer fee ($)</span>
            <input type="number" min={0} max={50} value={betterFee}
              onChange={e => setBetterFee(Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-zinc-500">Exchange rate markup (%)</span>
            <input type="number" min={0} max={10} step={0.5} value={betterRate}
              onChange={e => setBetterRate(Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <p className="text-sm font-bold text-teal-400">${betterTotal.toFixed(0)}/year</p>
        </div>
      </div>
      {savings > 0 && (
        <div className="rounded-xl border border-teal-500/20 bg-teal-950/20 p-4 text-center">
          <p className="text-xs text-zinc-400">You could save</p>
          <p className="text-3xl font-bold text-teal-400">${savings.toFixed(0)}/year</p>
          <p className="text-xs text-zinc-500 mt-1">by switching services</p>
        </div>
      )}
    </div>
  );
}

function PaycheckDecoder() {
  const [hourly, setHourly] = useState(18);
  const [hours, setHours] = useState(40);
  const [stateTax, setStateTax] = useState(0);
  const [health, setHealth] = useState(80);

  const gross = hourly * hours;
  const fica = gross * 0.0765;
  const annual = gross * 52;
  let fedRate = 0.10;
  if (annual > 100525) fedRate = 0.22;
  else if (annual > 47150) fedRate = 0.22;
  else if (annual > 11600) fedRate = 0.12;
  const fedTax = gross * fedRate;
  const stateAmt = gross * (stateTax / 100);
  const net = gross - fica - fedTax - stateAmt - health;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-5">
      <p className="text-sm font-semibold text-zinc-200">Weekly paycheck breakdown</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">Hourly rate ($)</span>
          <input type="number" min={8} max={100} step={0.5} value={hourly}
            onChange={e => setHourly(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">Hours this week</span>
          <input type="number" min={1} max={80} value={hours}
            onChange={e => setHours(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">State tax rate (%)</span>
          <input type="number" min={0} max={15} step={0.5} value={stateTax}
            onChange={e => setStateTax(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">Health insurance ($/week)</span>
          <input type="number" min={0} max={300} step={5} value={health}
            onChange={e => setHealth(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
        </label>
      </div>
      <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2 text-sm">
        <div className="flex justify-between font-semibold"><span className="text-zinc-300">Gross pay</span><span className="text-white">${gross.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-zinc-500">Federal income tax</span><span className="text-red-400">-${fedTax.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-zinc-500">Social Security (6.2%)</span><span className="text-red-400">-${(gross * 0.062).toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-zinc-500">Medicare (1.45%)</span><span className="text-red-400">-${(gross * 0.0145).toFixed(2)}</span></div>
        {stateAmt > 0 && <div className="flex justify-between"><span className="text-zinc-500">State tax</span><span className="text-red-400">-${stateAmt.toFixed(2)}</span></div>}
        {health > 0 && <div className="flex justify-between"><span className="text-zinc-500">Health insurance</span><span className="text-red-400">-${health.toFixed(2)}</span></div>}
        <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-base">
          <span className="text-zinc-300">Net pay</span>
          <span className="text-teal-400">${Math.max(0, net).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

const CALCULATORS: Record<string, React.ReactNode> = {
  "bank-fee-calculator": <BankFeeCalculator />,
  "credit-score-estimator": <CreditScoreEstimator />,
  "take-home-calculator": <TakeHomeCalculator />,
  "remittance-calculator": <RemittanceCalculator />,
  "remittance-fee-calculator": <RemittanceCalculator />,
  "paycheck-decoder": <PaycheckDecoder />,
};

// ── Main viewer ───────────────────────────────────────────────────────────────

export function LearnTopicViewer({ topic }: { topic: LearnTopic }) {
  const [activeStep, setActiveStep] = useState(0);
  const step = topic.steps[activeStep];
  const isLast = activeStep === topic.steps.length - 1;

  const paragraphs = step.body.split(/\n\n+/).map(p => p.trim()).filter(Boolean);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">

      {/* ── Step list sidebar ── */}
      <aside className="lg:w-56 shrink-0">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">Steps</p>
        <div className="flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {topic.steps.map((s, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`flex shrink-0 items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all lg:w-full ${
                  active
                    ? "border-teal-600/40 bg-teal-950/40 text-teal-300"
                    : done
                    ? "border-white/10 bg-white/[0.02] text-zinc-500"
                    : "border-transparent text-zinc-600 hover:border-white/10 hover:text-zinc-400"
                }`}
              >
                <span className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  active ? "bg-teal-600 text-white" : done ? "bg-white/15 text-zinc-400" : "bg-white/5 text-zinc-600"
                }`}>
                  {i + 1}
                </span>
                <span className="line-clamp-2 leading-snug hidden lg:block">{s.title}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Step content ── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-500"
              style={{ width: `${((activeStep + 1) / topic.steps.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-zinc-500 shrink-0">{activeStep + 1} / {topic.steps.length}</span>
        </div>

        {/* Step title */}
        <h2 className="font-display text-2xl text-white">{step.title}</h2>

        {/* Body paragraphs */}
        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-zinc-300">{p}</p>
          ))}
        </div>

        {/* Key facts */}
        {step.facts && step.facts.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Key points</p>
            <ul className="space-y-2">
              {step.facts.map((fact, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className="mt-1 shrink-0 text-teal-500">›</span>
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warning */}
        {step.warning && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 flex gap-3">
            <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
            <p className="text-sm text-amber-200">{step.warning}</p>
          </div>
        )}

        {/* Tip */}
        {step.tip && (
          <div className="rounded-xl border border-teal-500/20 bg-teal-950/20 p-4 flex gap-3">
            <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
            <p className="text-sm text-teal-200">{step.tip}</p>
          </div>
        )}

        {/* Interactive calculator */}
        {step.interactiveId && CALCULATORS[step.interactiveId]}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setActiveStep(i => Math.max(0, i - 1))}
            disabled={activeStep === 0}
            className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-white/25 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {isLast ? (
            <Link
              href="/chat"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-teal-900/50 px-5 py-2.5 text-sm font-semibold text-teal-200 transition hover:bg-teal-900/70"
            >
              Ask ImmiFina a question →
            </Link>
          ) : (
            <button
              onClick={() => setActiveStep(i => Math.min(topic.steps.length - 1, i + 1))}
              className="flex items-center gap-2 rounded-full border border-teal-600/40 bg-teal-900/40 px-5 py-2.5 text-sm font-semibold text-teal-200 transition hover:bg-teal-900/70"
            >
              Next step →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
