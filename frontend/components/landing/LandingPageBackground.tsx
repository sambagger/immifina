"use client";

export function LandingPageBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
      style={{
        background: `
          radial-gradient(ellipse 700px 500px at 5% 15%, #cde8da 0%, transparent 55%),
          radial-gradient(ellipse 500px 400px at 95% 70%, #e9e0cc 0%, transparent 55%),
          radial-gradient(ellipse 400px 350px at 60% 95%, #d0e8f0 0%, transparent 55%),
          #F6F4EF
        `,
      }}
    >
      {/* Animated blobs */}
      <div
        className="absolute rounded-full"
        style={{
          width: 520,
          height: 520,
          top: "-10%",
          left: "-8%",
          background: "radial-gradient(circle, rgba(29,107,79,0.10) 0%, transparent 70%)",
          animation: "ifBlob1 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          top: "35%",
          right: "-6%",
          background: "radial-gradient(circle, rgba(76,175,130,0.08) 0%, transparent 70%)",
          animation: "ifBlob2 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 340,
          height: 340,
          bottom: "-5%",
          left: "38%",
          background: "radial-gradient(circle, rgba(168,230,199,0.12) 0%, transparent 70%)",
          animation: "ifBlob3 19s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes ifBlob1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(28px,18px) scale(1.06); }
          66% { transform: translate(-16px,26px) scale(0.94); }
        }
        @keyframes ifBlob2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-36px,-18px) scale(1.08); }
        }
        @keyframes ifBlob3 {
          0%,100% { transform: translate(0,0) scale(1); }
          40% { transform: translate(18px,-28px) scale(0.92); }
          80% { transform: translate(-10px,12px) scale(1.04); }
        }
      `}</style>
    </div>
  );
}
