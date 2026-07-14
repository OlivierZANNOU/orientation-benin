import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0A0A", // near-black background
          900: "#141414",
          800: "#1F1F1F",
          700: "#2B2B2B",
          600: "#3D3D3D",
        },
        ember: {
          DEFAULT: "#E85D2C", // primary orange
          50: "#FEF3EE",
          100: "#FDE3D6",
          300: "#F5A276",
          500: "#E85D2C",
          600: "#CC4A1C",
          700: "#A83A15",
        },
        paper: "#FAFAF8", // off-white
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-lines":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "scan": "scan 2.4s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scan: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "0% 200%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
