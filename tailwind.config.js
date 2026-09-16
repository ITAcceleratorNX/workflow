/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        /* Onest - гротеск с полноценной кириллицей: интерфейс, текст и крупные заголовки */
        sans: ['Onest', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        /* Cormorant Garamond - акцентные слова курсивом внутри заголовков */
        serif: ['"Cormorant Garamond"', 'Georgia', '"Times New Roman"', 'serif'],
      },
      /*
       * Типографическая шкала редизайна. Размеры «резиновые»: clamp растягивает
       * их от телефона (375px) до широкого экрана (1440px) без ступенек на брейкпоинтах.
       */
      fontSize: {
        "display-2xl": ["clamp(3.5rem, 1.2rem + 9.8vw, 10rem)", { lineHeight: "0.9", letterSpacing: "-0.045em" }],
        "display-xl": ["clamp(2.75rem, 1.4rem + 5.8vw, 6.5rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(2.25rem, 1.3rem + 4vw, 4.75rem)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(1.875rem, 1.3rem + 2.4vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        title: ["clamp(1.375rem, 1.15rem + 0.9vw, 1.875rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        lead: ["clamp(1.0625rem, 0.98rem + 0.4vw, 1.3125rem)", { lineHeight: "1.55", letterSpacing: "-0.005em" }],
        label: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.18em" }],
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

        /*
         * Палитра редизайна «Графит и охра» - снята с интерьеров из видео:
         * графитовые потолки, охристые стены переговорных, хвойные двери, светлый камень.
         * Все пары текст/фон, которые используются в вёрстке, проходят WCAG AA.
         */

        /* Графит - тёмные сцены (интро, hero, тёмные секции) и основной текст */
        graphite: {
          50: "#F2F3F2",
          100: "#E6E8E5",
          200: "#D6D8D4",
          300: "#B4B8B4",
          400: "#878C88",
          500: "#5B615D",
          600: "#3A403C",
          700: "#262B28",
          800: "#1A1E1C",
          900: "#121513",
          950: "#0B0D0C",
        },
        /* Слоновая кость - светлые фоны и текст на тёмном */
        ivory: {
          50: "#F7F5F0",
          100: "#EFEBE3",
          200: "#E2DCD0",
          300: "#CEC6B6",
          400: "#B3A994",
        },
        /* Охра - единственный яркий акцент: главная кнопка, тонкие линии, метки.
           На светлом фоне текстом - только 700 (контраст 5.2:1). */
        ochre: {
          300: "#E8C97A",
          400: "#DDB14E",
          500: "#CF9A2E",
          600: "#AE7D1D",
          700: "#86601A",
        },
        /* Хвоя - вторая глубокая поверхность, чтобы тёмные секции не были однообразными */
        pine: {
          500: "#4E6A5F",
          700: "#274036",
          800: "#1C2F28",
          900: "#15231E",
        },

        /* Прежняя палитра: на ней CRM - рабочий интерфейс менеджеров остаётся в своём стиле */
        /* Голубой - фон, секции, визуальная иерархия */
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
        /* Оранжевый - основные кнопки и активные элементы */
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
      /* Кривые движения: одинаковый «почерк» у всех анимаций сайта */
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        1200: "1200ms",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        /* Тени CRM */
        card: "0 1px 2px rgba(14, 53, 82, 0.04), 0 8px 24px -12px rgba(14, 53, 82, 0.18)",
        float: "0 20px 60px -24px rgba(14, 53, 82, 0.45)",
      },
    },
  },
  plugins: [],
}
