import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  id,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "glass";
}) {
  const base =
    variant === "glass"
      ? "rounded-[20px] border border-white/15 bg-black/50 p-6 text-white shadow-soft backdrop-blur-xl transition-[box-shadow,transform] hover:shadow-soft-lg"
      : "rounded-card border border-border bg-surface p-6 transition-colors hover:border-border-strong";

  return (
    <div id={id} className={`${base} ${className}`}>
      {children}
    </div>
  );
}
