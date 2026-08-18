"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const SCROLL_THRESHOLD = 32;

export function LandingNavOverlay() {
  const t = useTranslations("nav");
  const tl = useTranslations("landing");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "border-b border-black/[0.07] bg-white/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 md:gap-6 lg:px-8 lg:py-4">
        <BrandLogo className="text-lg font-semibold text-gray-900 md:text-xl">{tl("logo")}</BrandLogo>

        <nav
          className="hidden flex-1 items-center justify-center gap-6 lg:flex"
          aria-label={tl("navLandingAria")}
        >
          {[
            { href: "/", label: tl("navHome"), onClick: isHomePage ? (e: React.MouseEvent) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } : undefined },
            { href: "#product-features", label: tl("navProduct") },
            { href: "#how-it-works", label: tl("navHow") },
            { href: "#guides", label: "Guides" },
            { href: "#feedback", label: tl("navFeedback") },
          ].map((item) =>
            item.href.startsWith("#") || item.onClick ? (
              <a
                key={item.label}
                href={item.href}
                onClick={item.onClick}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="rounded-full px-2 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            {t("login")}
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#1d6b4f] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97]"
          >
            {tl("navCtaRegister")}
          </Link>
        </div>
      </div>
    </header>
  );
}
