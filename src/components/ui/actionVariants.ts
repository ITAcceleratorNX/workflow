import { cva } from "class-variance-authority"

/**
 * Кнопки редизайна. Прежние buttonVariants остаются за CRM,
 * чтобы смена стиля сайта не задела рабочий интерфейс менеджеров.
 */
export const actionVariants = cva(
  "group/action relative inline-flex select-none items-center justify-center gap-3 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] touch-manipulation transition-[background-color,border-color,color,transform] duration-400 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /* Охра - одно главное действие на экран */
        accent: "bg-ochre-500 text-graphite-950 hover:bg-ochre-400",
        /* Графит - главное действие на светлом фоне, когда охра уже есть рядом */
        dark: "bg-graphite-950 text-ivory-50 hover:bg-graphite-800",
        /* Светлая заливка - на тёмных секциях */
        light: "bg-ivory-50 text-graphite-950 hover:bg-white",
        /* Контур на светлом фоне */
        outline:
          "border border-graphite-950/15 text-graphite-950 hover:border-graphite-950/40 hover:bg-graphite-950/[0.04]",
        /* Стеклянный контур поверх видео и фотографий */
        glass:
          "border border-white/25 bg-white/[0.06] text-white backdrop-blur-md hover:border-white/50 hover:bg-white/[0.14]",
      },
      size: {
        sm: "h-10 px-5 text-sm",
        md: "h-12 px-6 text-[15px]",
        lg: "h-14 px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "accent",
      size: "md",
    },
  }
)

/** Стрелка внутри кнопки: слегка уходит вверх-вправо при наведении */
export const actionArrowClass =
  "h-4 w-4 shrink-0 transition-transform duration-400 ease-out-expo group-hover/action:-translate-y-0.5 group-hover/action:translate-x-0.5"
