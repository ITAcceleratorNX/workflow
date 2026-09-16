import { PROPERTIES } from "./properties"

/**
 * Страницы, которые открываются тёмным полноэкранным hero (видео или фото фасада).
 * Над ним шапка прозрачная и контент начинается под ней; на остальных страницах
 * шапка сразу плотная, а контенту нужен отступ сверху.
 */
const DARK_HERO_PATHS = new Set<string>(["/", ...PROPERTIES.map((property) => property.path)])

export const hasDarkHero = (pathname: string) => DARK_HERO_PATHS.has(pathname)

/** Атрибут hero-блока: пока он под шапкой, шапка остаётся прозрачной */
export const HEADER_HERO_ATTRIBUTE = "data-header-hero"
