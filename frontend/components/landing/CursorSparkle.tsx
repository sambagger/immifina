"use client";

import { useEffect } from "react";

const COLORS = ["#1d6b4f", "#4CAF82", "#a8e6c7", "#fbbf24", "#86efac"];

function spawnStar(x: number, y: number) {
  const size = Math.random() * 10 + 5;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const angle = Math.random() * 360;
  const dist = Math.random() * 45 + 15;
  const duration = 650 + Math.random() * 350;
  const dx = Math.cos((angle * Math.PI) / 180) * dist;
  const dy = Math.sin((angle * Math.PI) / 180) * dist;

  const el = document.createElement("div");
  el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size}px;pointer-events:none;z-index:9999;`;
  el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0l2.2 7.5L20 10l-7.8 2.5L10 20l-2.2-7.5L0 10l7.8-2.5z" fill="${color}"/>
  </svg>`;

  document.body.appendChild(el);

  const anim = el.animate(
    [
      { transform: `translate(-50%,-50%) scale(0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(calc(-50% + ${dx * 0.6}px),calc(-50% + ${dy * 0.6}px)) scale(1) rotate(200deg)`, opacity: 0.85, offset: 0.45 },
      { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0.2) rotate(360deg)`, opacity: 0 },
    ],
    { duration, easing: "cubic-bezier(0.25,0.46,0.45,0.94)", fill: "forwards" }
  );
  anim.onfinish = () => el.remove();
}

export function CursorSparkle() {
  useEffect(() => {
    let lastTime = 0;
    let lastX = 0;
    let lastY = 0;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastTime < 55) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (dx * dx + dy * dy < 36) return;
      lastTime = now;
      lastX = e.clientX;
      lastY = e.clientY;
      spawnStar(e.clientX, e.clientY);
      if (Math.random() > 0.55) spawnStar(e.clientX, e.clientY);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return null;
}
