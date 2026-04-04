import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-card border border-border bg-surface p-6 transition-colors hover:border-border-strong ${className}`}
    >
      {children}
    </div>
  );
}
