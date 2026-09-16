import { useCallback, useEffect, useSyncExternalStore } from "react"
import type Lenis from "lenis"

/*
 * Активный экземпляр Lenis. Он один на страницу и живёт вне React
 * (создаёт его SmoothScrollProvider), поэтому хранится как внешнее хранилище.
 * null — плавного скролла нет: CRM или провайдер ещё не смонтирован.
 */
let current: Lenis | null = null
const listeners = new Set<() => void>()

export function setActiveLenis(instance: Lenis | null) {
  current = instance
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useLenis() {
  return useSyncExternalStore(subscribe, () => current)
}

/* Счётчик блокировок: меню может закрыться в тот момент, когда открывается форма,
   и прокрутка не должна включиться между ними */
let activeLocks = 0

/**
 * Блокирует прокрутку страницы, пока открыто меню, модальное окно или лайтбокс.
 * Одного overflow: hidden мало — Lenis крутит страницу сам, его надо остановить.
 */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis()

  useEffect(() => {
    if (!locked) return

    if (activeLocks++ === 0) {
      document.body.style.overflow = "hidden"
      lenis?.stop()
    }

    return () => {
      if (--activeLocks === 0) {
        document.body.style.overflow = ""
        lenis?.start()
      }
    }
  }, [locked, lenis])
}

/** Плавная прокрутка к элементу — через Lenis, если он есть, иначе средствами браузера */
export function useScrollToElement() {
  const lenis = useLenis()

  return useCallback(
    (element: HTMLElement | null) => {
      if (!element) return
      /* Lenis учитывает scroll-margin-top элемента — отступ под шапку сохраняется */
      if (lenis) lenis.scrollTo(element)
      else element.scrollIntoView({ block: "start", behavior: "smooth" })
    },
    [lenis]
  )
}
