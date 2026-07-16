/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0E2138",
        brand: "#E63757",
        background: "#F5F6F8",
        surface: "#FFFFFF",
        textPrimary: "#0E2138",
        "text-primary": "#0E2138",
        textSecondary: "#6B7280",
        "text-secondary": "#6B7280",
        success: "#1FBF8F",
        warning: "#F59E0B",
        danger: "#E63757",
        chartAccent: "#22C5E8",
        "chart-accent": "#22C5E8",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
