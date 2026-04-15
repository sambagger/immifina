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
        display: ["var(--font-archivo-black)", "system-ui", "sans-serif"],
      },
      colors: {
        /** Solid landing (video hero) — use instead of opacity text utilities */
        landing: {
          title: "#4CAF82",
          body: "#ffffff",
        },
        // Override teal palette → ImmiFina forest green so dashboard teal-* classes match the landing page
        teal: {
          100: "#d1f0e4",
          200: "#a8e6c7",
          300: "#4CAF82",   // text / icons
          400: "#2d8f65",   // progress bar, highlights
          500: "#1d6b4f",   // primary buttons — matches landing page
          600: "#185a42",   // hover state
          700: "#11412f",
          800: "#0a2d21",
          900: "#061510",   // card backgrounds
          950: "#030e09",   // darkest bg
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
        soft: "0 8px 40px rgba(0, 0, 0, 0.35)",
        "soft-lg": "0 16px 48px rgba(0, 0, 0, 0.45)",
        glow: "0 8px 32px rgba(94, 212, 168, 0.2)",
        "glow-lg": "0 12px 48px rgba(94, 212, 168, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
