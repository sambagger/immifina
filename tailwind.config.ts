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
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      colors: {
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
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
