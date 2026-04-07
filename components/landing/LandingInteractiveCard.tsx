"use client";

import type { ReactNode } from "react";

/** Hover / touch lift — matches bento card interaction. */
export function LandingInteractiveCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-soft-lg active:scale-[0.99] motion-reduce:transform-none motion-reduce:hover:shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}
