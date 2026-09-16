import { useSyncExternalStore } from "react"

/**
 * Интро-заставка и общий счётчик загрузки.
 *
 * loading — заставка на экране, страница под ней грузится;
 * leaving — шторка уходит, hero и шапка начинают появляться;
 * done    — заставки нет (или она не показывалась вовсе).
 */
export type IntroPhase = "loading" | "leaving" | "done"

/*
 * Показывать ли заставку, решает инлайн-скрипт в index.html ещё до загрузки React:
 * он ставит этот класс и сразу красит фон в графит, чтобы не мигнул светлый экран.
 * Пока класс стоит, CSS-анимации появления hero на паузе.
 */
const PENDING_CLASS = "intro-pending"

let phase: IntroPhase =
  typeof document !== "undefined" && document.documentElement.classList.contains(PENDING_CLASS)
    ? "loading"
    : "done"

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setIntroPhase(next: IntroPhase) {
  if (phase === next) return
  phase = next
  if (next !== "loading") document.documentElement.classList.remove(PENDING_CLASS)
  listeners.forEach((listener) => listener())
}

export function useIntroPhase() {
  return useSyncExternalStore(subscribe, () => phase)
}

/* Ресурсы, которых ждёт заставка: доля готовности 0…1 и вес в общем счётчике.
   Счётчик читается в каждом кадре анимации, поэтому подписки React ему не нужны. */
const loads = new Map<string, { progress: number; weight: number }>()

/** Сообщает прогресс загрузки ресурса. Вес — насколько ресурс важен для общего процента. */
export function reportLoad(id: string, progress: number, weight = 1) {
  loads.set(id, { progress: Math.min(1, Math.max(0, progress)), weight })
}

/** Ресурс без промежуточного прогресса: готов, когда промис завершился — успешно или нет */
export function trackLoad(id: string, promise: Promise<unknown>, weight = 1) {
  if (loads.has(id)) return
  reportLoad(id, 0, weight)
  /* Ошибка загрузки тоже «готово»: заставка не должна зависнуть из-за одного файла */
  const finish = () => reportLoad(id, 1, weight)
  promise.then(finish, finish)
}

/** Общий прогресс 0…1; пока ни один ресурс не зарегистрирован — 1 */
export function getLoadProgress() {
  let total = 0
  let ready = 0
  loads.forEach(({ progress, weight }) => {
    total += weight
    ready += progress * weight
  })
  return total === 0 ? 1 : ready / total
}
