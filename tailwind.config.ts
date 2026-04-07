import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        /** Solid landing (video hero) — use instead of opacity text utilities */
        landing: {
          /** Headlines on dark landing (video/sections) — lighter than accent for contrast */
          title: "#5ed4a8",
          body: "#ffffff",
        },
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        ink: "var(--color-text-primary)",
        muted: "var(--color-text-secondary)",
        faint: "var(--color-text-muted)",
        accent: "var(--color-accent)",
        "accent-light": "var(--color-accent-light)",
        "accent-text": "var(--color-accent-text)",
        blue: "var(--color-blue)",
        "blue-light": "var(--color-blue-light)",
        amber: "var(--color-amber)",
        "amber-light": "var(--color-amber-light)",
        red: "var(--color-red)",
        "red-light": "var(--color-red-light)",
      },
      borderRadius: {
        card: "10px",
        control: "8px",
        badge: "6px",
        landing: "1.25rem",
      },
      spacing: {
        18: "4.5rem",
      },
      boxShadow: {
        soft: "0 8px 40px rgba(0, 0, 0, 0.06)",
        "soft-lg": "0 16px 48px rgba(0, 0, 0, 0.08)",
        glow: "0 8px 32px rgba(29, 107, 79, 0.45)",
        "glow-lg": "0 12px 48px rgba(29, 107, 79, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
