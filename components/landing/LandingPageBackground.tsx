/**
 * Fixed flower video + black tint (no green wash). Poster must match file in /public/videos/.
 */
export function LandingPageBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <video
        className="absolute inset-0 z-0 h-full w-full min-h-full min-w-full object-cover motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/hero-poster.png"
      >
        <source src="/videos/hero-compressed.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 z-0 hidden bg-[#0f1a16] motion-reduce:block"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-black/50 motion-reduce:hidden"
        aria-hidden
      />
    </div>
  );
}
