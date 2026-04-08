import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white border-accent hover:bg-[#185a42] hover:border-[#185a42]",
  secondary:
    "bg-surface text-ink border-border hover:bg-accent-light hover:border-border-strong",
  ghost:
    "bg-transparent text-accent border-transparent hover:bg-accent-light hover:border-border",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-[44px] items-center justify-center rounded-control border px-4 py-2 text-sm font-medium transition-colors active:scale-[0.98] focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
