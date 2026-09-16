import { useRef, type ReactNode } from "react"
import { MOTION_OK, gsap, useGSAP } from "../../lib/motion"
import { cn } from "../../lib/utils"

interface ParallaxProps {
  /** Фото или видео, растянутое на весь блок (h-full w-full object-cover) */
  children: ReactNode
  /** Размер и скругление рамки */
  className?: string
  /** Насколько содержимое смещается внутри рамки, в процентах её высоты (в каждую сторону) */
  amount?: number
}

/**
 * Содержимое движется внутри рамки медленнее страницы - ощущение глубины.
 * Привязано к скроллу напрямую (scrub), поэтому едет вперёд и назад вместе с прокруткой.
 */
export function Parallax({ children, className, amount = 10 }: ParallaxProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const frame = frameRef.current
      const media = mediaRef.current
      if (!frame || !media) return

      gsap.matchMedia().add(MOTION_OK, () => {
        /* Увеличение ровно на ход смещения: края рамки никогда не оголяются */
        gsap.set(media, { scale: 1 + (amount * 2) / 100 })
        gsap.fromTo(
          media,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
          }
        )
      })
    },
    { dependencies: [amount], revertOnUpdate: true }
  )

  return (
    <div ref={frameRef} className={cn("relative overflow-hidden", className)}>
      <div ref={mediaRef} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  )
}
