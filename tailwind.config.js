/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgba(15, 23, 42, 0.08)",
        "glass-lg": "0 24px 60px rgba(15, 23, 42, 0.12)",
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 24px rgba(15, 23, 42, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
        "slide-up": "slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        "slide-down": "slideDown 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        pulse: "pulse 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};