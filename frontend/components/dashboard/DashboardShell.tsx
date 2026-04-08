"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LegalFooter } from "@/components/LegalFooter";
import { apiFetch } from "@/lib/api";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const navItems: {
  href: string;
  key:
    | "dashboard"
    | "chat"
    | "forecast"
    | "paycheck"
    | "credit"
    | "benefits"
    | "banking"
    | "remittance"
    | "settings";
}[] = [
  { href: "/dashboard", key: "dashboard" },
  { href: "/chat", key: "chat" },
  { href: "/forecast", key: "forecast" },
  { href: "/paycheck", key: "paycheck" },
  { href: "/credit", key: "credit" },
  { href: "/benefits", key: "benefits" },
  { href: "/banking", key: "banking" },
  { href: "/remittance", key: "remittance" },
  { href: "/settings", key: "settings" },
];

function Icon({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
      aria-hidden
    >
      {children}
    </svg>
  );
}

async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    /* still navigate */
  }
  // localePrefix: "never" — URLs are /login, not /en/login; full reload clears client state
  window.location.replace("/login");
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();

  const icons: Record<(typeof navItems)[number]["key"], ReactNode> = {
    dashboard: (
      <Icon>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </Icon>
    ),
    chat: (
      <Icon>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337L5.05 21l1.395-3.72C5.512 15.042 5 13.574 5 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </Icon>
    ),
    forecast: (
      <Icon>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </Icon>
    ),
    paycheck: (
      <Icon>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </Icon>
    ),
    credit: (
      <Icon>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
        />
      </Icon>
    ),
    benefits: (
      <Icon>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </Icon>
    ),
    banking: (
      <Icon>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 9.75h4.5m-4.5 3h4.5m-4.5 3h4.5m-4.5 3h4.5"
        />
      </Icon>
    ),
    remittance: (
      <Icon>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
        />
      </Icon>
    ),
    settings: (
      <Icon>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </Icon>
    ),
  };

  return (
    <div className="relative z-0 flex min-h-screen flex-col md:flex-row md:pl-56">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-white/10 bg-black/60 backdrop-blur-xl md:fixed md:inset-y-0 md:left-0 md:flex">
        <div className="border-b border-white/10 p-4">
          <BrandLogo href="/dashboard" className="text-lg font-semibold tracking-tight text-landing-title">
            ImmiFina
          </BrandLogo>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-control border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:focus-ring ${
                  active
                    ? "border-emerald-500/30 bg-emerald-950/60 text-landing-title"
                    : "border-transparent text-zinc-400 hover:border-white/15 hover:bg-white/5 hover:text-white"
                }`}
              >
                {icons[item.key]}
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <LanguageSwitcher className="mb-3 w-full justify-center" />
          <button
            type="button"
            data-testid="logout"
            onClick={() => logout()}
            className="w-full rounded-control border border-white/15 bg-white/5 px-3 py-2 text-left text-sm font-medium text-zinc-400 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:focus-ring"
          >
            {tCommon("logout")}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pb-20 md:pb-0">
        <header className="flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-3 backdrop-blur-xl sm:px-6 md:hidden lg:px-8">
          <BrandLogo href="/dashboard" className="text-lg font-semibold tracking-tight text-landing-title">
            ImmiFina
          </BrandLogo>
          <LanguageSwitcher />
        </header>
        <ScrollReveal className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </ScrollReveal>
        <div className="mt-auto space-y-3 border-t border-white/10 bg-black/40 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 md:justify-end">
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              {tCommon("termsOfService")}
            </Link>
            <span aria-hidden className="text-zinc-600">·</span>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              {tCommon("privacyPolicy")}
            </Link>
            <span aria-hidden className="text-zinc-600">·</span>
            <Link href="/resources" className="hover:text-zinc-300 transition-colors">
              {tCommon("resourcesPage")}
            </Link>
          </p>
          <LegalFooter align="right" className="[&_p]:!text-zinc-500 [&_a]:!text-zinc-400 [&_span]:!text-zinc-500" />
          <p className="text-xs text-zinc-500 md:text-right">{tCommon("copyright")}</p>
        </div>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-10 flex gap-1 overflow-x-auto border-t border-white/10 bg-black/70 px-2 py-2 backdrop-blur-xl md:hidden"
        aria-label="Mobile main"
      >
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[4.25rem] flex-col items-center gap-0.5 rounded-control py-1 text-[10px] font-medium focus-visible:focus-ring ${
                active ? "text-landing-title" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {icons[item.key]}
              <span className="line-clamp-2 text-center leading-tight">{t(item.key)}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => logout()}
          className="flex min-w-[4rem] flex-col items-center gap-0.5 rounded-control py-1 text-[10px] font-medium text-zinc-500 hover:text-zinc-300 focus-visible:focus-ring"
        >
          <span className="text-lg leading-none" aria-hidden>
            →
          </span>
          {tCommon("logout")}
        </button>
      </nav>
    </div>
  );
}
