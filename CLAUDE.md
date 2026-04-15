# ImmiFina — Claude Context

## Role
You are a senior UI designer and frontend developer. Build premium dark-faced interfaces. Use subtle animations, proper spacing, and visual hierarchy. No emoji icons. No inline styles. No generic gradients.

---

## What This App Is
ImmiFina is a financial education and guidance platform for immigrants and first-generation Americans navigating the U.S. financial system. It helps users understand credit, banking, paychecks, benefits, remittances, and financial forecasting — in English, Spanish, and Simplified Chinese.

It is not a bank, financial advisor, or legal service. All content is educational only.

---

## Project Structure
```
immifina/
├── frontend/          Next.js 14 app (App Router, TypeScript, Tailwind)
├── backend/           Express server (plain JS, ESM)
├── supabase/          Database schema and migrations
├── CLAUDE.md          This file
└── .env.local         Root env (not committed)
```

### Frontend (`frontend/`)
```
app/[locale]/
  (auth)/              Login, register, forgot-password
  (dashboard)/         Banking, benefits, chat, credit, dashboard, forecast, paycheck, remittance, resources, settings
  onboarding/          Multi-step onboarding wizard
  page.tsx             Landing page
components/
  auth/                LoginForm, RegisterForm
  banking/             BankingGuide
  benefits/            BenefitsClient
  chat/                ChatClient
  dashboard/           DashboardShell
  forecast/            ForecastClient
  landing/             LandingNav, LandingHero, LandingFeaturesBento, LandingHowPanel, LandingProductMockup, WaitlistForm
  onboarding/          OnboardingWizard
  settings/            SettingsForm
  ui/                  Button, Card, Input, Select, ScrollReveal, EducationalDisclaimer
lib/
  api.ts               apiFetch() helper — all API calls go through this
  auth.ts              JWT session helpers (Next.js side)
  db.ts                Supabase service client
  rate-limit.ts        In-memory rate limiter
  sanitize.ts          Input sanitization
  validation.ts        Zod schemas
  forecast.ts          Savings projection math
  benefits-engine.ts   Benefits matching logic
  client-ip.ts         IP extraction
messages/              i18n strings (en.json, es.json, zh.json)
```

### Backend (`backend/`)
```
src/
  server.js            Express entry — CORS, cookie-parser, all routes
  lib/
    auth.js            JWT sign/verify, requireAuth middleware, cookie helpers
    db.js              Supabase service client
    rate-limit.js      In-memory rate limiter
    sanitize.js        Input sanitization
    validation.js      Zod schemas
    forecast.js        Savings projection math
    benefits-engine.js Benefits matching logic
    client-ip.js       IP extraction
  routes/
    auth.js            POST /auth/login, /register, /logout, /refresh
    ai.js              POST /ai/chat
    conversations.js   GET /conversations, GET /conversations/:id
    profile.js         GET /profile, PATCH /profile
    forecast.js        POST /forecast
    benefits.js        POST /benefits
    waitlist.js        POST /waitlist
```

---

## How to Run

### Frontend (port 3000)
```bash
cd frontend
npm install
npm run dev
```

### Backend (port 4000)
```bash
cd backend
npm install
npm run dev
```

Both must be running for the app to work. Frontend calls backend via `apiFetch()` in `frontend/lib/api.ts`.

---

## API
All frontend API calls use `apiFetch()` from `frontend/lib/api.ts`, which:
- Points to `NEXT_PUBLIC_BACKEND_URL` (default: `http://localhost:4000`)
- Always sends `credentials: "include"` for cookie auth
- Sets `Content-Type: application/json`

### Routes
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/login | No | Email + password login |
| POST | /auth/register | No | Create account |
| POST | /auth/logout | No | Clear session cookie |
| POST | /auth/refresh | Yes | Refresh session token |
| POST | /ai/chat | Yes | AI financial assistant |
| GET | /conversations | Yes | List conversations |
| GET | /conversations/:id | Yes | Get messages |
| GET | /profile | Yes | Get user + financial profile |
| PATCH | /profile | Yes | Update profile |
| POST | /forecast | Yes | Run savings projection |
| POST | /benefits | Yes | Match benefit programs |
| POST | /waitlist | No | Join waitlist |
| GET | /health | No | Health check |

---

## Database (Supabase)
- **users** — id, email, password_hash, name, preferred_language, immigration_status
- **financial_profiles** — user_id, monthly_income, monthly_expenses, current_savings, monthly_savings_goal, household_size, has_children, immigration_situation, has_ssn, has_itin, years_in_us, country_of_origin, primary_goal, employment_status, expense_* columns, onboarding_completed_at
- **conversations** — id, user_id, title, language, created_at
- **messages** — id, conversation_id, role, content, created_at
- **waitlist** — id, email, ip_address, created_at

---

## Auth
- JWT stored in an httpOnly cookie named `session`
- Signed with `AUTH_SECRET` (must match between frontend and backend)
- 7-day expiry
- `requireAuth` middleware in `backend/src/lib/auth.js` verifies the cookie on protected routes

---

## Environment Variables

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
CLAUDE_API_KEY=
RESEND_API_KEY=
```

### Backend (`backend/.env`)
```
PORT=4000
AUTH_SECRET=           # must match frontend
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CLAUDE_API_KEY=
RESEND_API_KEY=
```

---

## Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, next-intl (i18n)
- **Backend:** Node.js, Express, ESM modules
- **Database:** Supabase (PostgreSQL)
- **Auth:** Custom JWT with jose, bcryptjs, httpOnly cookies
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Email:** Resend
- **Validation:** Zod
- **Deployment:** Vercel (frontend), TBD (backend)

---

## Languages
- English (`en`)
- Spanish (`es`)
- Simplified Chinese (`zh`)

All user-facing strings live in `frontend/messages/`. Never hardcode English text in components — always use `useTranslations()` or `getTranslations()`.

---

## UI Conventions
- **Dark-first:** Background is deep dark green/black (`#0f1a16` base). No light mode.
- **Glass panels:** `bg-black/50 backdrop-blur-xl border border-white/15` for contained elements. Use sparingly — not every section needs a card.
- **Open sections:** Prefer open, typographic layouts over glass cards for testimonials, how-it-works, and editorial content.
- **Typography:** `font-display` for headings, `font-sans` for body. Use type scale aggressively — big numbers, strong contrast between heading and body sizes.
- **Color:** Primary green `#1d6b4f`. Emerald accents `emerald-300/400/500`. No generic gradients.
- **Spacing:** Generous — `py-16 md:py-24 lg:py-28` between sections. `max-w-6xl` page width.
- **Animations:** Subtle only — `transition-[transform,box-shadow]`, `ScrollReveal` for entrance. No spin loaders or aggressive motion.
- **No emoji icons** in UI components.
- **No inline styles** — Tailwind classes only.
- **No generic gradients** — `bg-gradient-to-r from-X to-Y` is banned.
- **Hover states:** Subtle — `hover:border-white/25`, `hover:bg-white/[0.07]`, `hover:-translate-y-1`.

---

## What Is Still In Progress
- Frontend is not yet updated to call the backend for all routes — `frontend/app/api/` routes still exist as legacy fallback
- Backend `backend/` is built but not deployed — runs locally on port 4000 only
- No production backend hosting configured yet
- Vercel deployment uses frontend only (`vercel.json` points to `frontend/`)
