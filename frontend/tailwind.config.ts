import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FFFFFF",
        surface: "#F4F4F4",
        "surface-hover": "#EBEBEB",
        "text-main": "#111111",
        "text-muted": "#666666",
        accent: "#888C57",
        "accent-hover": "#727649",
        border: "#E2E2E2",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
        card: "20px",
        sm: "12px",
      },
      maxWidth: {
        container: "1280px",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "32px",
        xl: "64px",
        "2xl": "120px",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease forwards",
      },
    },
  },
  corePlugins: {
    container: false,
  },
  plugins: [],
};
export default config;
