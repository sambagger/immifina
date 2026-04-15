import { Link } from "@/navigation";

function ArrowCircleIcon() {
  return (
    <span
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/20"
      aria-hidden
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path
          d="M7 17L17 7M17 7H9M17 7V15"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function PlayIcon() {
  return (
    <span
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1D6B4F]/10 ring-1 ring-[#1D6B4F]/25"
      aria-hidden
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-[#1D6B4F]"
      >
        <path d="M8 5v14l11-7L8 5z" />
      </svg>
    </span>
  );
}

export function LandingHeroPrimaryCta({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#222] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-[transform,opacity] hover:opacity-95 active:scale-[0.98] focus-visible:focus-ring md:gap-3 md:px-6 md:text-base"
    >
      <span>{label}</span>
      <ArrowCircleIcon />
    </Link>
  );
}

export function LandingHeroSecondaryCta({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex min-h-[44px] items-center gap-3 rounded-full border-2 border-[#1D6B4F] bg-white/95 px-5 py-3 text-sm font-semibold text-[#1D6B4F] shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-[transform,background-color] hover:bg-white active:scale-[0.98] focus-visible:focus-ring md:px-8 md:text-base"
    >
      <PlayIcon />
      {label}
    </a>
  );
}
