import type { SelectHTMLAttributes } from "react";

export function Select({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`min-h-[44px] w-full rounded-control border border-border bg-surface px-3 py-2 text-ink transition-colors hover:border-border-strong focus-visible:focus-ring ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
