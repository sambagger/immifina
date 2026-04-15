"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  twinkleSpeed: number;
  phase: number;
}

function createStars(width: number, height: number, count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height * 0.75,
    r: Math.random() * 1.3 + 0.2,
    opacity: Math.random() * 0.7 + 0.2,
    twinkleSpeed: Math.random() * 0.0012 + 0.0004,
    phase: Math.random() * Math.PI * 2,
  }));
}

export function LandingPageBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let stars: Star[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = createStars(canvas.width, canvas.height, 220);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const t = Math.sin(time * s.twinkleSpeed + s.phase);
        const alpha = s.opacity * (0.5 + 0.5 * t);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,240,255,${alpha.toFixed(3)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #05101e 0%, #071828 40%, #0a1f2e 70%, #0d2318 100%)" }}
      aria-hidden
    >
      {/* ── Stars canvas ─────────────────────────── */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full motion-reduce:hidden" />

      {/* ── Moon ─────────────────────────────────── */}
      <div
        className="absolute motion-reduce:hidden"
        style={{ top: "8%", right: "18%", width: 90, height: 90 }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "radial-gradient(circle at 38% 38%, #e8f4e0, #b8d4a8 60%, #6a9e6a)",
            boxShadow: "0 0 40px 12px rgba(120,200,120,0.18), 0 0 80px 24px rgba(80,160,100,0.10)",
          }}
        />
      </div>

      {/* ── Animated clouds ──────────────────────── */}

      {/* Cloud layer 1 — slow, large, back */}
      <div className="cloud-drift-1 absolute motion-reduce:hidden" style={{ top: "12%", left: "-20%" }}>
        <CloudShape width={700} opacity={0.13} blur={18} color="#a8c8e8" />
      </div>
      <div className="cloud-drift-1 absolute motion-reduce:hidden" style={{ top: "18%", left: "55%", animationDelay: "-28s" }}>
        <CloudShape width={500} opacity={0.10} blur={16} color="#b0cce0" />
      </div>

      {/* Cloud layer 2 — medium speed, mid */}
      <div className="cloud-drift-2 absolute motion-reduce:hidden" style={{ top: "22%", left: "-15%" }}>
        <CloudShape width={550} opacity={0.16} blur={14} color="#c8d8ee" />
      </div>
      <div className="cloud-drift-2 absolute motion-reduce:hidden" style={{ top: "30%", left: "60%", animationDelay: "-18s" }}>
        <CloudShape width={420} opacity={0.14} blur={12} color="#aac4d8" />
      </div>

      {/* Cloud layer 3 — faster, foreground */}
      <div className="cloud-drift-3 absolute motion-reduce:hidden" style={{ top: "35%", left: "-10%" }}>
        <CloudShape width={480} opacity={0.18} blur={10} color="#d0e4f0" />
      </div>
      <div className="cloud-drift-3 absolute motion-reduce:hidden" style={{ top: "28%", left: "40%", animationDelay: "-10s" }}>
        <CloudShape width={360} opacity={0.15} blur={8} color="#b8d0e8" />
      </div>

      {/* ── Ground silhouette ─────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 motion-reduce:hidden" style={{ height: "22%" }}>
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <path
            d="M0,200 L0,120 Q80,80 160,110 Q240,140 320,100 Q400,60 480,90 Q560,120 640,85 Q720,50 800,80 Q880,110 960,75 Q1040,40 1120,70 Q1200,100 1280,90 Q1360,80 1440,100 L1440,200 Z"
            fill="#071510"
            opacity="0.95"
          />
          <path
            d="M0,200 L0,145 Q100,120 200,140 Q300,160 400,130 Q500,100 600,125 Q700,150 800,120 Q900,90 1000,115 Q1100,140 1200,125 Q1320,108 1440,130 L1440,200 Z"
            fill="#051209"
            opacity="1"
          />
        </svg>

        {/* Grass glow along the horizon */}
        <div
          className="absolute inset-x-0"
          style={{
            bottom: "55%",
            height: 32,
            background: "linear-gradient(to top, rgba(29,107,79,0.18), transparent)",
            filter: "blur(8px)",
          }}
        />

        {/* Small flower/dot accents */}
        {[8, 15, 23, 31, 42, 55, 63, 72, 81, 88].map((pct) => (
          <div
            key={pct}
            className="absolute bottom-[30%]"
            style={{ left: `${pct}%` }}
          >
            <div
              style={{
                width: 5,
                height: 14,
                background: "rgba(76,175,130,0.5)",
                borderRadius: "50% 50% 0 0",
                boxShadow: "0 0 6px 2px rgba(76,175,100,0.25)",
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Overlays for text readability ────────── */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="absolute inset-0 bg-black/20" />

      {/* motion-reduce static fallback */}
      <div className="absolute inset-0 hidden bg-[#02060f] motion-reduce:block" />

      <style>{`
        @keyframes cloudDrift1 {
          from { transform: translateX(0); }
          to   { transform: translateX(120vw); }
        }
        @keyframes cloudDrift2 {
          from { transform: translateX(0); }
          to   { transform: translateX(120vw); }
        }
        @keyframes cloudDrift3 {
          from { transform: translateX(0); }
          to   { transform: translateX(120vw); }
        }
        .cloud-drift-1 { animation: cloudDrift1 90s linear infinite; }
        .cloud-drift-2 { animation: cloudDrift2 65s linear infinite; }
        .cloud-drift-3 { animation: cloudDrift3 45s linear infinite; }
      `}</style>
    </div>
  );
}

/** Puffy illustrated cloud shape built from overlapping ellipses */
function CloudShape({
  width,
  opacity,
  blur,
  color,
}: {
  width: number;
  opacity: number;
  blur: number;
  color: string;
}) {
  const h = width * 0.38;
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${width} ${h}`}
      style={{ filter: `blur(${blur}px)`, opacity }}
    >
      <ellipse cx={width * 0.5}  cy={h * 0.75} rx={width * 0.48} ry={h * 0.30} fill={color} />
      <ellipse cx={width * 0.35} cy={h * 0.55} rx={width * 0.22} ry={h * 0.40} fill={color} />
      <ellipse cx={width * 0.55} cy={h * 0.45} rx={width * 0.26} ry={h * 0.48} fill={color} />
      <ellipse cx={width * 0.72} cy={h * 0.58} rx={width * 0.18} ry={h * 0.35} fill={color} />
      <ellipse cx={width * 0.20} cy={h * 0.65} rx={width * 0.16} ry={h * 0.28} fill={color} />
    </svg>
  );
}
