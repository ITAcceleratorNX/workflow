import { useEffect, type ReactNode } from "react"
import { useLocation } from "react-router-dom"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { gsap, ScrollTrigger } from "../../lib/motion"
import { setActiveLenis, useLenis } from "../../lib/smoothScroll"

/* Инерция колеса: чем меньше, тем мягче и дольше доезжает страница */
const WHEEL_LERP = 0.1

/**
 * Плавный скролл сайта (Lenis), синхронизированный с GSAP ScrollTrigger.
 *
 * Сенсорные экраны Lenis не трогает — там остаётся родная прокрутка системы.
 * При включённом «уменьшении движения» Lenis сам отключает сглаживание.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenis = useLenis()
  const { pathname } = useLocation()

  useEffect(() => {
    const instance = new Lenis({ lerp: WHEEL_LERP, stopInertiaOnNavigate: true })

    /* Скролл и scrub-анимации считаются в одном тике GSAP — без отставания на кадр */
    const onTick = (time: number) => instance.raf(time * 1000)
    instance.on("scroll", ScrollTrigger.update)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    setActiveLenis(instance)

    /* Высота страницы меняется после загрузки фото и шрифтов — точки срабатывания пересчитываем */
    let refreshTimer = 0
    const observer = new ResizeObserver(() => {
      window.clearTimeout(refreshTimer)
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    observer.observe(document.body)

    return () => {
      observer.disconnect()
      window.clearTimeout(refreshTimer)
      gsap.ticker.remove(onTick)
      gsap.ticker.lagSmoothing(500, 33)
      setActiveLenis(null)
      instance.destroy()
    }
  }, [])

  /* Новая страница открывается с начала, без доезда инерции с предыдущей */
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true })
  }, [pathname, lenis])

  return children
}
