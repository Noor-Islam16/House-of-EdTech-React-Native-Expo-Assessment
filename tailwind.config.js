/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#06B6D4",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        background: "#F8FAFC",
        card: "#FFFFFF",
        text: "#0F172A",
      },
    },
  },
  plugins: [],
};
