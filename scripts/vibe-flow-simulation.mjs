/**
 * Vibe-coded app simulation — N concurrent browser users (default 15).
 *
 * Prereqs:
 *   1. App running: npm run dev (or SIM_BASE_URL pointing at your deployment)
 *   2. npm install && npx playwright install chromium
 *   3. Env: SIM_EMAIL + SIM_PASSWORD for a real account in your DB
 *
 * Env:
 *   SIM_BASE_URL     (default http://localhost:3000)
 *   SIM_EMAIL        (required)
 *   SIM_PASSWORD     (required)
 *   SIM_USERS        (default 15) — parallel browser contexts
 *   SIM_LOOPS        (default 1) — repeat full flow per user
 *   SIM_HEADLESS     (default true) — set false to watch browsers
 *
 * Note: Each fresh context shows the educational disclaimer modal once (no localStorage).
 * The script checks the box and continues so it does not block the Log in button.
 *
 * Login uses client-side navigation (router.push) — we poll the pathname instead of
 * waitForURL(..., { waitUntil: "load" }), which can hang on App Router soft navigations.
 *
 * Auth is rate-limited per IP: 5 login POSTs / 15 min. Keep SIM_USERS ≤ 5 per batch from
 * one machine, or wait 15 min between large batches, or you will see 429 on login.
 *
 * Heavy parallel load against `next dev` can log React pageerrors; they do not fail the
 * run. Logout uses `POST /api/auth/logout` (not the UI) so it does not depend on the shell.
 * For a quieter test, use `npm run build && npm start` or lower SIM_USERS.
 *
 * Example (use a real account you registered in the app, not placeholder text):
 *   SIM_EMAIL=you@real.com SIM_PASSWORD='actual-secret' npm run simulate:load
 *
 * Use straight ASCII quotes in the shell (not curly ‘ ’). If the password has spaces,
 * quote it: SIM_PASSWORD='my pass'.
 *
 * Pasted smart quotes are stripped from SIM_EMAIL / SIM_PASSWORD so the API still gets
 * the real secret if the shell included U+2018/U+2019 by mistake.
 */

import { chromium } from "playwright";

/** Strip leading/trailing straight and curly quotes often pasted into Terminal by mistake. */
function normalizeEnvSecret(s) {
  return s
    .trim()
    .replace(/^[\u2018\u2019\u201C\u201D\u0027\u0022`]+|[\u2018\u2019\u201C\u201D\u0027\u0022`]+$/g, "")
    .trim();
}

const BASE = (process.env.SIM_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const EMAIL = normalizeEnvSecret(process.env.SIM_EMAIL ?? "");
const PASSWORD = normalizeEnvSecret(process.env.SIM_PASSWORD ?? "");
const USER_COUNT = Math.max(1, Math.min(100, Number(process.env.SIM_USERS ?? 15)));
const LOOPS = Math.max(1, Math.min(20, Number(process.env.SIM_LOOPS ?? 1)));
const HEADLESS = process.env.SIM_HEADLESS !== "false";

const NAV_PATHS = [
  "/dashboard",
  "/chat",
  "/forecast",
  "/paycheck",
  "/credit",
  "/benefits",
  "/banking",
  "/remittance",
  "/settings",
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function pickNavPaths() {
  const n = 2 + Math.floor(Math.random() * 3);
  const shuffled = [...NAV_PATHS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/**
 * `EducationalDisclaimerGate` is a full-screen overlay (z-100) until checkbox + CTA.
 * Playwright cannot click through it — must dismiss first on fresh profiles.
 * @param {import('playwright').Page} page
 */
async function dismissEducationalGate(page) {
  const dialog = page.locator('[role="dialog"][aria-modal="true"]');
  try {
    await dialog.waitFor({ state: "visible", timeout: 10_000 });
  } catch {
    return;
  }
  await dialog.locator('input[type="checkbox"]').check();
  await dialog.locator("button[type='button']").click();
  await dialog.waitFor({ state: "hidden", timeout: 15_000 });
}

/**
 * Next.js client `router.push` does not always complete a document "load" navigation.
 * @param {import('playwright').Page} page
 * @param {number} timeoutMs
 */
async function waitForLoggedInPath(page, timeoutMs) {
  // Playwright: 2nd arg is `arg` passed to the page function, 3rd is options — not (fn, options).
  await page.waitForFunction(
    () => {
      const p = location.pathname;
      return p.includes("/dashboard") || p.includes("/onboarding");
    },
    null,
    { timeout: timeoutMs }
  );
}

/**
 * @param {import('playwright').Page} page
 * @param {number} timeoutMs
 */
async function waitForLoginPath(page, timeoutMs) {
  await page.waitForFunction(
    () => location.pathname.includes("/login"),
    null,
    { timeout: timeoutMs }
  );
}

/**
 * LoginForm uses controlled React state; `pressSequentially` reliably fires `onChange`.
 * @param {import('playwright').Page} page
 * @param {string} email
 * @param {string} password
 */
async function fillLoginForm(page, email, password) {
  const emailBox = page.locator("#email");
  const passBox = page.locator("#password");
  await emailBox.click();
  await emailBox.fill("");
  await emailBox.pressSequentially(email, { delay: 0 });
  await passBox.click();
  await passBox.fill("");
  await passBox.pressSequentially(password, { delay: 0 });
}

/**
 * @param {import('playwright').Page} page
 */
async function runOneLoop(page, userId, loopIndex) {
  const tag = `[user ${userId} loop ${loopIndex}]`;

  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await dismissEducationalGate(page);
  await fillLoginForm(page, EMAIL, PASSWORD);
  await page.locator('form button[type="submit"]').first().click();

  // Prefer a test user that lands on dashboard (onboarding not completed would stop the flow).
  try {
    await waitForLoggedInPath(page, 45_000);
  } catch {
    const url = page.url();
    const primaryErr = await page
      .locator("#login-error p.text-sm.text-red")
      .first()
      .innerText()
      .catch(() => "");
    throw new Error(
      `Login did not navigate to /dashboard or /onboarding (still at ${url}). ` +
        (primaryErr.trim() ? `Server: ${primaryErr.trim()}. ` : "") +
        `Use an email/password that exist in this app’s Supabase users table. ` +
        `If it works in the browser but not here, fix curly quotes around SIM_PASSWORD and try again.`
    );
  }
  if (/\/onboarding/.test(page.url())) {
    throw new Error(
      "Redirected to /onboarding — use an account that finished onboarding, or complete onboarding once manually."
    );
  }

  await sleep(randomBetween(1000, 3000));

  const paths = pickNavPaths();
  for (const path of paths) {
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 45_000 });
      await sleep(randomBetween(400, 1200));
      await page.mouse.wheel(0, 400);
      await sleep(randomBetween(200, 600));
    } catch (e) {
      console.warn(`${tag} nav ${path}:`, e instanceof Error ? e.message : e);
    }
  }

  try {
    const res = await page.request.get(`${BASE}/api/health`);
    if (!res.ok()) console.warn(`${tag} /api/health`, res.status());
  } catch (e) {
    console.warn(`${tag} /api/health`, e instanceof Error ? e.message : e);
  }

  // Clear session via API — avoids clicking sidebar Log out (React can flake under many
  // parallel `next dev` clients with useContext errors; cookies still match this page).
  const logoutRes = await page.request.post(`${BASE}/api/auth/logout`);
  if (!logoutRes.ok()) {
    throw new Error(`POST /api/auth/logout failed: ${logoutRes.status()}`);
  }
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await waitForLoginPath(page, 45_000);
}

async function runUser(browser, userId) {
  const errors = [];
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60_000);
  // Dev + many parallel tabs often throws benign React noise; real failures surface as thrown errors.
  page.on("pageerror", (err) => {
    console.warn(`[user ${userId}] pageerror (ignored for pass/fail):`, err.message);
  });

  const t0 = Date.now();
  try {
    for (let loop = 0; loop < LOOPS; loop++) {
      await runOneLoop(page, userId, loop + 1);
      if (loop < LOOPS - 1) await sleep(randomBetween(500, 1500));
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    errors.push(msg);
    console.error(`[user ${userId}] FAILED:`, msg);
  } finally {
    await context.close();
  }

  return { userId, ms: Date.now() - t0, ok: errors.length === 0, errors };
}

async function main() {
  if (!EMAIL || !PASSWORD) {
    console.error(
      "Set SIM_EMAIL and SIM_PASSWORD (non-empty, after trim — a real user in your database).\nExample:\n  SIM_EMAIL=you@x.com SIM_PASSWORD=secret npm run simulate:load"
    );
    process.exit(1);
  }

  console.log(
    `Starting ${USER_COUNT} parallel users × ${LOOPS} loop(s) → ${BASE}\nHEADLESS=${HEADLESS}`
  );

  const browser = await chromium.launch({ headless: HEADLESS });
  try {
    const tasks = Array.from({ length: USER_COUNT }, (_, i) => runUser(browser, i + 1));
    const results = await Promise.all(tasks);

    const failed = results.filter((r) => !r.ok);
    const ok = results.filter((r) => r.ok);

    console.log("\n--- Summary ---");
    console.log(`Finished: ${ok.length} ok, ${failed.length} with errors`);
    for (const r of results) {
      const status = r.ok ? "OK" : "ERR";
      console.log(`  user ${r.userId}: ${status} ${(r.ms / 1000).toFixed(1)}s`, r.errors.length ? r.errors : "");
    }

    if (failed.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
