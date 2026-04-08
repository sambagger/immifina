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
      ? "rounded-[20px] border border-white/15 bg-black/50 p-6 shadow-soft backdrop-blur-xl transition-[border-color,box-shadow] hover:border-white/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
      : "rounded-card border border-white/10 bg-black/45 p-6 backdrop-blur-sm transition-[border-color] hover:border-white/20";

  return (
    <div id={id} className={`${base} ${className}`}>
      {children}
    </div>
  );
}
