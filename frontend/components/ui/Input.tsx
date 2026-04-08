import type { InputHTMLAttributes } from "react";

export function Input({
  variant = "default",
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { variant?: "default" | "onDark" }) {
  const surface =
    variant === "onDark"
      ? "border-white/20 bg-black/40 text-white placeholder:text-zinc-400 hover:border-white/35"
      : "border-border bg-surface text-ink placeholder:text-faint hover:border-border-strong";
  return (
    <input
      className={`min-h-[44px] w-full rounded-control border px-3 py-2 transition-colors focus-visible:focus-ring ${surface} ${className}`}
      {...props}
    />
  );
}
