import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05060D",
          900: "#0A0B14",
          800: "#10121F",
          700: "#171A2B",
          600: "#20253C",
        },
        magenta: {
          50: "#FFE5F2",
          100: "#FFB8DC",
          200: "#FF7EC0",
          300: "#FF3FA1",
          400: "#F01E8A",
          500: "#E6017A",
          600: "#C10068",
          700: "#9B0054",
        },
        royal: {
          50: "#E8ECFF",
          100: "#C7D0FF",
          200: "#8F9EFF",
          300: "#5E72FA",
          400: "#3A4FF0",
          500: "#1E3FE0",
          600: "#1731BD",
          700: "#122799",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(230,1,122,0.3), 0 20px 60px -10px rgba(230,1,122,0.25)",
        glowBlue: "0 0 0 1px rgba(30,63,224,0.3), 0 20px 60px -10px rgba(30,63,224,0.25)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse at center, rgba(230,1,122,0.15), transparent 60%)",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "bounce-slow": "bounce 2.5s ease-in-out infinite",
        grain: "grain 8s steps(10) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        grain: {
          "0%,100%": { transform: "translate(0,0)" },
          "10%": { transform: "translate(-5%,-5%)" },
          "30%": { transform: "translate(3%,-10%)" },
          "50%": { transform: "translate(-10%,5%)" },
          "70%": { transform: "translate(5%,10%)" },
          "90%": { transform: "translate(-3%,3%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
