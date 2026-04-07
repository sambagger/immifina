import type { SelectHTMLAttributes } from "react";

export function Select({
  variant = "default",
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { variant?: "default" | "onDark" }) {
  const surface =
    variant === "onDark"
      ? "border-white/20 bg-black/40 text-white hover:border-white/35"
      : "border-border bg-surface text-ink hover:border-border-strong";
  return (
    <select
      className={`min-h-[44px] w-full rounded-control border px-3 py-2 transition-colors focus-visible:focus-ring ${surface} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
