import { useRef, type ReactNode } from "react"
import { EASE, MOTION_OK, REVEAL_START, gsap, useGSAP } from "../../lib/motion"
import { cn } from "../../lib/utils"

interface MediaRevealProps {
  /** Фото или видео, растянутое на весь блок (h-full w-full object-cover) */
  children: ReactNode
  /** Размер и скругление рамки: aspect-ratio, rounded-* */
  className?: string
  delay?: number
  play?: "scroll" | "mount"
}

/**
 * Фото открывается шторкой снизу вверх, а само изображение в это время
 * плавно «отъезжает» из увеличенного состояния - как в кадре с движущейся камерой.
 */
export function MediaReveal({ children, className, delay = 0, play = "scroll" }: MediaRevealProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const frame = frameRef.current
      const media = mediaRef.current
      if (!frame || !media) return

      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({
            delay,
            scrollTrigger: play === "scroll" ? { trigger: frame, start: REVEAL_START, once: true } : undefined,
          })
          /* Обе точки заданы явно: от computed-значения none GSAP анимировать не умеет */
          .fromTo(
            frame,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: EASE.inOutQuart, clearProps: "clipPath" }
          )
          .from(media, { scale: 1.3, duration: 2, clearProps: "transform" }, 0)
      })
    },
    { dependencies: [delay, play], revertOnUpdate: true }
  )

  return (
    <div ref={frameRef} className={cn("relative overflow-hidden", className)}>
      <div ref={mediaRef} className="h-full w-full">
        {children}
      </div>
    </div>
  )
}
