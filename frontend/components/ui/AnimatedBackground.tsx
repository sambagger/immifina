export function AnimatedBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden"
      aria-hidden
    >
      <svg
        className="absolute left-[5%] top-[12%] h-64 w-64 drift-1"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="88" fill="var(--color-accent)" />
      </svg>
      <svg
        className="absolute right-[8%] top-[20%] h-48 w-48 drift-2"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="36"
          y="36"
          width="128"
          height="128"
          rx="36"
          fill="var(--color-blue)"
        />
      </svg>
      <svg
        className="absolute bottom-[18%] left-[15%] h-56 w-56 drift-3"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="100,20 180,160 20,160"
          fill="var(--color-accent)"
        />
      </svg>
      <svg
        className="absolute bottom-[10%] right-[12%] h-72 w-72 drift-4"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="72" fill="var(--color-blue)" />
      </svg>
      <svg
        className="absolute left-[40%] top-[45%] h-40 w-40 drift-5"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="48"
          y="48"
          width="104"
          height="104"
          rx="52"
          fill="var(--color-accent)"
        />
      </svg>
      <svg
        className="absolute right-[35%] top-[8%] h-36 w-36 drift-6"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="100,30 170,150 30,150"
          fill="var(--color-blue)"
        />
      </svg>
      <svg
        className="absolute left-[2%] bottom-[35%] h-44 w-44 drift-7"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="60" fill="var(--color-accent)" />
      </svg>
      <svg
        className="absolute right-[3%] top-[50%] h-52 w-52 drift-8"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="40"
          y="40"
          width="120"
          height="120"
          rx="28"
          fill="var(--color-blue)"
        />
      </svg>
    </div>
  );
}
