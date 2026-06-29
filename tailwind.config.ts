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
          50: "#fff4ec",
          100: "#ffe5d3",
          200: "#ffc7a1",
          500: "#ff7a1a",
          600: "#ff6d08",
          700: "#e75b00",
          gray: "#a5a3a3",
          line: "#dfdfdf",
          cloud: "#f8fafa",
          steel: "#3b3e3f",
          ink: "#333230"
        }
      },
      boxShadow: {
        dashboard: "0 22px 70px rgba(51, 50, 48, 0.08)",
        brand: "0 28px 90px rgba(255, 109, 8, 0.16)",
        soft: "0 12px 36px rgba(51, 50, 48, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
