import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        wintemp: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          500: "#f97316",
          600: "#ff6b00",
          700: "#e65300",
          gray: "#9b9b9b",
          ink: "#2f3437"
        }
      },
      boxShadow: {
        dashboard: "0 20px 55px rgba(47, 52, 55, 0.08)",
        brand: "0 24px 80px rgba(255, 107, 0, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
