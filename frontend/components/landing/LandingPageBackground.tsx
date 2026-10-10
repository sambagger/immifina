"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
  phase: number;
}

function createStars(width: number, height: number): Star[] {
  const count = Math.min(320, Math.max(160, Math.round((width * height) / 7000)));
  return Array.from({ length: count }, () => {
    const bright = Math.random() < 0.12;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: bright ? Math.random() * 1.4 + 1.3 : Math.random() * 1.05 + 0.45,
      opacity: bright ? Math.random() * 0.25 + 0.75 : Math.random() * 0.45 + 0.35,
      speed: Math.random() * 0.0008 + 0.0003,
      phase: Math.random() * Math.PI * 2,
    };
  });
}

export function LandingPageBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(width, height);
    };

    const paint = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const twinkle = reduceMotion ? 1 : 0.62 + 0.38 * Math.sin(time * s.speed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236, 244, 255, ${(s.opacity * twinkle).toFixed(3)})`;
        ctx.fill();
      }
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      paint(0);
    } else {
      const draw = (time: number) => {
        paint(time);
        rafId = requestAnimationFrame(draw);
      };
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[#080808]" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
