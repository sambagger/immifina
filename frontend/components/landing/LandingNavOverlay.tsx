"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

/** Pixels scrolled before the glass tint appears (hero stays clear above this). */
const SCROLL_THRESHOLD = 32;

export function LandingNavOverlay() {
  const t = useTranslations("nav");
  const tl = useTranslations("landing");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/25 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 md:gap-6 lg:px-8 lg:py-4">
        <BrandLogo className="text-lg font-semibold text-landing-title md:text-xl">{tl("logo")}</BrandLogo>
        <nav
          className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-6"
          aria-label={tl("navLandingAria")}
        >
          <Link
            href="/"
            className="rounded-sm text-sm font-medium text-zinc-200 transition-colors hover:text-white focus-visible:focus-ring"
            onClick={(e) => {
              if (isHomePage) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            {tl("navHome")}
          </Link>
          <a
            href="#product-features"
            className="rounded-sm text-sm font-medium text-zinc-200 transition-colors hover:text-white focus-visible:focus-ring"
          >
            {tl("navProduct")}
          </a>
          <a
            href="#how-it-works"
            className="rounded-sm text-sm font-medium text-zinc-200 transition-colors hover:text-white focus-visible:focus-ring"
          >
            {tl("navHow")}
          </a>
          <a
            href="#testimonials"
            className="rounded-sm text-sm font-medium text-zinc-200 transition-colors hover:text-white focus-visible:focus-ring"
          >
            {tl("navTestimonials")}
          </a>
          <a
            href="#feedback"
            className="rounded-sm text-sm font-medium text-zinc-200 transition-colors hover:text-white focus-visible:focus-ring"
          >
            {tl("navFeedback")}
          </a>
        </nav>
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <LanguageSwitcher variant="onDark" />
          <Link
            href="/login"
            className="rounded-full px-2 py-1.5 text-sm font-medium text-white transition-colors hover:text-zinc-100 focus-visible:focus-ring"
          >
            {t("login")}
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-white/25 bg-[#1d6b4f] px-3 py-2 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-[transform,box-shadow] hover:shadow-[0_6px_24px_rgba(0,0,0,0.55)] active:scale-[0.98] focus-visible:focus-ring md:px-4 md:text-sm"
          >
            {tl("navCtaRegister")}
          </Link>
        </div>
      </div>
    </header>
  );
}
