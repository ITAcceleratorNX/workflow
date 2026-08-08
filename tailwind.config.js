/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Голубой — фон, секции, визуальная иерархия */
        brand: {
          50: "#F3F9FE",
          100: "#E3F1FB",
          200: "#C4E2F6",
          300: "#93CBEE",
          400: "#57ADE0",
          500: "#2A8FCE",
          600: "#1672AF",
          700: "#125B8C",
          800: "#124A70",
          900: "#0E3552",
        },
        /* Оранжевый — основные кнопки и активные элементы */
        orange: {
          50: "#FFF6F0",
          100: "#FFE9DA",
          200: "#FFCFB0",
          300: "#FFAC79",
          400: "#FC8848",
          500: "#F26B21",
          600: "#DE5410",
          700: "#B8400D",
          800: "#933312",
          900: "#772C13",
          950: "#401306",
        },
        ink: {
          DEFAULT: "#0E3552",
          muted: "#587487",
          soft: "#8AA0B2",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(14, 53, 82, 0.04), 0 8px 24px -12px rgba(14, 53, 82, 0.18)",
        "card-hover": "0 2px 4px rgba(14, 53, 82, 0.05), 0 24px 48px -20px rgba(14, 53, 82, 0.28)",
        float: "0 20px 60px -24px rgba(14, 53, 82, 0.45)",
      },
    },
  },
  plugins: [],
}
