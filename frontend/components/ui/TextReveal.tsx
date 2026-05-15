"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: string;
  className?: string;
  /** Stagger delay per word in ms (default 38) */
  wordDelay?: number;
  /** Base delay before the first word animates in ms (default 0) */
  baseDelay?: number;
}

/**
 * Splits text into words and reveals them with a staggered fade-up animation
 * when the element scrolls into view. Drop it inside any semantic element:
 *
 *   <h2 className="…"><TextReveal>{t("sectionTitle")}</TextReveal></h2>
 */
export function TextReveal({ children, className = "", wordDelay = 38, baseDelay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const words = children.split(" ").filter(Boolean);

  return (
    <span ref={ref} className={className} aria-label={children}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(0.35em)",
            transition: visible
              ? `opacity 0.55s cubic-bezier(0.23,1,0.32,1) ${baseDelay + i * wordDelay}ms,
                 transform 0.55s cubic-bezier(0.23,1,0.32,1) ${baseDelay + i * wordDelay}ms`
              : "none",
          }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
