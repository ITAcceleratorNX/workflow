import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/*
 * tailwind-merge не знает размеров шрифта из tailwind.config.js и принимает
 * text-display-lg за цвет текста: рядом с text-graphite-950 такой класс молча
 * выбрасывается, и заголовок становится обычного размера. Регистрируем размеры явно.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display-2xl", "display-xl", "display-lg", "display-md", "title", "lead", "label"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
