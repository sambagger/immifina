import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-h-[44px] w-full rounded-control border border-border bg-surface px-3 py-2 text-ink transition-colors placeholder:text-faint hover:border-border-strong focus-visible:focus-ring ${className}`}
      {...props}
    />
  );
}
