import { useEffect, useRef, type RefObject } from "react"
import { FrameSequence, drawCover } from "../../lib/scrollMedia"
import { MOTION_OK, gsap } from "../../lib/motion"
import { reportLoad } from "../../lib/intro"
import { SCROLL_HERO } from "../../lib/homeContent"
import { SCROLL_HERO_FRAMES } from "../../lib/scrollHeroFrames"

type FrameSet = (typeof SCROLL_HERO_FRAMES)[keyof typeof SCROLL_HERO_FRAMES]

/* Интро ждёт каждый 16-й кадр: по ним уже виден весь пролёт, остальное догружается в фоне */
const INTRO_STRIDE = 16
const INTRO_LOAD_ID = "scroll-hero-frames"
/* Кадры важнее шрифтов: от них зависит, увидит ли человек пролёт сразу после заставки */
const INTRO_LOAD_WEIGHT = 4
/* Доля пути до нужного кадра за тик: на тачскрине без Lenis видео не дёргается за пальцем */
const FRAME_LERP = 0.15
/* Больше этой ширины буфер canvas не нужен: исходные кадры 1600 px */
const MAX_CANVAS_WIDTH = 2400

/*
 * Загруженные кадры переживают уход с главной: при возврате не качаем всё заново.
 * Декодированные изображения при этом освобождаются — они и занимают память.
 */
const sequences = new Map<string, FrameSequence>()

function pickFrameSet(): FrameSet {
  return window.matchMedia("(orientation: portrait)").matches ? SCROLL_HERO_FRAMES.tall : SCROLL_HERO_FRAMES.wide
}

/** Кадры не качаем при экономии трафика, на 2G и когда человек просил меньше движения */
function shouldLoadFrames() {
  if (!window.matchMedia(MOTION_OK).matches) return false
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection
  if (connection?.saveData) return false
  return !connection?.effectiveType?.endsWith("2g")
}

interface ScrollHeroMediaProps {
  /** Прогресс прокрутки сцены 0…1 — пишет ScrollTrigger сцены */
  progressRef: RefObject<number>
}

/**
 * Пролёт по офису, привязанный к прокрутке: кадры ролика рисуются на canvas.
 * Под canvas лежит постер — он виден, пока не готов первый кадр, и остаётся,
 * если кадры решили не загружать.
 */
export function ScrollHeroMedia({ progressRef }: ScrollHeroMediaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context || !shouldLoadFrames()) return

    const set = pickFrameSet()
    let sequence = sequences.get(set.path)
    if (!sequence) {
      sequence = new FrameSequence((index) => `${set.path}${String(index).padStart(4, "0")}.webp`, set.count)
      sequences.set(set.path, sequence)
    }
    const frames = sequence

    /* Заставка ждёт первые кадры и показывает их реальный процент */
    const introFrames = Math.ceil(set.count / INTRO_STRIDE)
    const reportIntro = () => reportLoad(INTRO_LOAD_ID, frames.settledCount / introFrames, INTRO_LOAD_WEIGHT)
    reportIntro()

    const controller = new AbortController()
    frames
      .load(reportIntro, controller.signal)
      .catch(() => {})
      /* Даже если сеть подвела, заставка не должна ждать дальше */
      .finally(() => reportLoad(INTRO_LOAD_ID, 1, INTRO_LOAD_WEIGHT))

    let shown = progressRef.current ?? 0
    let drawn: ImageBitmap | undefined

    const render = () => {
      const target = progressRef.current ?? 0
      shown += (target - shown) * FRAME_LERP
      if (Math.abs(target - shown) < 0.0001) shown = target

      const ratio = Math.min(window.devicePixelRatio, 2, MAX_CANVAS_WIDTH / Math.max(canvas.clientWidth, 1))
      const width = Math.round(canvas.clientWidth * ratio)
      const height = Math.round(canvas.clientHeight * ratio)
      const resized = canvas.width !== width || canvas.height !== height
      if (resized) {
        canvas.width = width
        canvas.height = height
      }

      const frame = frames.frameAt(Math.round(shown * (set.count - 1)))
      /* Перерисовываем, только когда сменился кадр или размер: canvas хранит картинку сам */
      if (frame && (frame !== drawn || resized)) {
        drawCover(context, frame, width, height)
        drawn = frame
      }
    }

    /* Пока сцена за пределами экрана, кадры не считаем и не рисуем */
    let running = false
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) gsap.ticker.add(render)
      if (!entry.isIntersecting && running) gsap.ticker.remove(render)
      running = entry.isIntersecting
    })
    observer.observe(canvas)

    return () => {
      controller.abort()
      observer.disconnect()
      gsap.ticker.remove(render)
      frames.releaseDecoded()
    }
  }, [progressRef])

  return (
    <>
      <img
        src={SCROLL_HERO.poster.src}
        srcSet={SCROLL_HERO.poster.srcSet}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </>
  )
}
