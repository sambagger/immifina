"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Link } from "@/navigation";

export function BrandLogo({
  href = "/",
  children,
  className = "",
  imgClassName = "h-8 w-8 rounded-lg",
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 font-display tracking-tight focus-visible:focus-ring rounded-badge px-1 ${className}`}
    >
      <Image
        src="/brand-mark.png"
        alt=""
        width={32}
        height={32}
        className={`shrink-0 object-contain ${imgClassName}`}
        priority
        unoptimized
        aria-hidden
      />
      {children}
    </Link>
  );
}
