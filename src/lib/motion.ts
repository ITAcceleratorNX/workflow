import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { CustomEase } from "gsap/CustomEase"
import { useGSAP } from "@gsap/react"

/**
 * Единая точка настройки GSAP. Компоненты берут gsap и плагины отсюда,
 * а не из пакета напрямую: так плагины гарантированно зарегистрированы.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase)

/* Те же кривые, что --ease-* в index.css и в tailwind.config.js:
   CSS-переходы и GSAP-анимации двигаются с одним «почерком» */
CustomEase.create("outExpo", "0.16,1,0.3,1")
CustomEase.create("outQuart", "0.25,1,0.5,1")
CustomEase.create("inOutQuart", "0.76,0,0.24,1")

export const EASE = {
  outExpo: "outExpo",
  outQuart: "outQuart",
  inOutQuart: "inOutQuart",
} as const

gsap.defaults({ ease: EASE.outExpo, duration: 1.2 })

/* Адресная строка мобильного браузера меняет высоту окна при прокрутке —
   пересчитывать из-за этого все точки срабатывания незачем, это дёргает анимации */
ScrollTrigger.config({ ignoreMobileResize: true })

/** Условие для gsap.matchMedia: анимируем, только если человек не просил уменьшить движение */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)"

/** Момент появления блока: верх элемента дошёл до 85% высоты окна */
export const REVEAL_START = "top 85%"

export { gsap, ScrollTrigger, SplitText, useGSAP }
