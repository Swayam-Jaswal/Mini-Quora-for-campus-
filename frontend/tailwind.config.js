// tailwind.config.js

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0b1116",
          800: "#0f1724",
          700: "#182232",
          600: "#2f3f66",
          500: "#5166b8",
          400: "#6b89d9",
          300: "#9fb9ed",
          200: "#c7dcf5",
          100: "#eef3fa",
        },

        glass: {
          DEFAULT: "rgba(255,255,255,0.04)",
          soft: "rgba(255,255,255,0.02)",
        },

        accent: {
          700: "#4a4cff",
          600: "#5b66ff",
          500: "#6c7cff",
          400: "#8c8eff",
          300: "#b56bff",
        },
      },

      backgroundImage: {
        "gradient-hero": "linear-gradient(180deg, #0f1724, #0c1623)",
        "gradient-card": "linear-gradient(180deg, rgba(13,21,32,0.62), rgba(10,16,26,0.6))",
        "gradient-panel": "linear-gradient(180deg, rgba(8,12,20,0.62), rgba(7,10,18,0.6))",
        "accent-gradient": "linear-gradient(135deg, #6c7cff, #b56bff)",
      },

      borderRadius: {
        xl: "18px",
        "2xl": "22px",
        "3xl": "28px",
      },

      boxShadow: {
        card: "0 8px 24px rgba(6,10,20,0.5)",
        soft: "0 4px 14px rgba(255,255,255,0.04)",
        panel: "0 10px 30px rgba(6,10,20,0.6)",
      },
    },
  },
  plugins: [],
};
