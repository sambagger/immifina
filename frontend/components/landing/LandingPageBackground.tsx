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

interface ShootingStar {
  x: number;
  y: number;
  len: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
  progress: number;
}

function createStars(width: number, height: number, count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.2 + 0.2,
    opacity: Math.random() * 0.6 + 0.2,
    twinkleSpeed: Math.random() * 0.0015 + 0.0005,
    phase: Math.random() * Math.PI * 2,
  }));
}

function createShootingStar(width: number): ShootingStar {
  return {
    x: Math.random() * width * 0.7 + width * 0.1,
    y: Math.random() * 200,
    len: Math.random() * 140 + 80,
    speed: Math.random() * 0.012 + 0.008,
    angle: Math.PI / 5 + (Math.random() * Math.PI) / 8,
    opacity: 0,
    active: false,
    progress: 0,
  };
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
    let shooting = createShootingStar(window.innerWidth);
    let nextShot = Date.now() + 3000 + Math.random() * 5000;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = createStars(canvas.width, canvas.height, 260);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Twinkling stars
      for (const s of stars) {
        const t = Math.sin(time * s.twinkleSpeed + s.phase);
        const alpha = s.opacity * (0.55 + 0.45 * t);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,235,255,${alpha.toFixed(3)})`;
        ctx.fill();
      }

      // Shooting star
      const now = Date.now();
      if (!shooting.active && now >= nextShot) {
        shooting = createShootingStar(width);
        shooting.active = true;
        shooting.progress = 0;
        shooting.opacity = 0;
      }

      if (shooting.active) {
        shooting.progress = Math.min(shooting.progress + shooting.speed, 1);

        // fade in then fade out
        shooting.opacity =
          shooting.progress < 0.15
            ? shooting.progress / 0.15
            : shooting.progress > 0.75
              ? 1 - (shooting.progress - 0.75) / 0.25
              : 1;

        const tx = shooting.x + Math.cos(shooting.angle) * shooting.len * shooting.progress;
        const ty = shooting.y + Math.sin(shooting.angle) * shooting.len * shooting.progress;
        const tailX = tx - Math.cos(shooting.angle) * shooting.len * 0.22;
        const tailY = ty - Math.sin(shooting.angle) * shooting.len * 0.22;

        const grad = ctx.createLinearGradient(tailX, tailY, tx, ty);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(255,255,255,${(shooting.opacity * 0.9).toFixed(3)})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (shooting.progress >= 1) {
          shooting.active = false;
          nextShot = Date.now() + 4000 + Math.random() * 7000;
        }
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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#02060f]"
      aria-hidden
    >
      {/* Nebula blobs — slow drifting color depth */}
      <div className="drift-2 absolute -left-[10%] top-[5%] h-[60vh] w-[60vh] rounded-full bg-indigo-950/60 blur-[120px]" />
      <div className="drift-4 absolute right-[0%] top-[-5%] h-[50vh] w-[55vh] rounded-full bg-violet-950/50 blur-[100px]" />
      <div className="drift-6 absolute bottom-[10%] left-[35%] h-[45vh] w-[70vh] rounded-full bg-emerald-950/40 blur-[130px]" />
      <div className="drift-8 absolute -bottom-[5%] right-[15%] h-[40vh] w-[40vh] rounded-full bg-blue-950/40 blur-[90px]" />

      {/* Star canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Top vignette for nav readability */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Subtle dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/25" />

      {/* motion-reduce: static fallback */}
      <div className="absolute inset-0 hidden bg-[#02060f] motion-reduce:block" />
    </div>
  );
}
