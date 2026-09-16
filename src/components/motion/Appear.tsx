import { useRef, type ReactNode } from "react"
import { MOTION_OK, REVEAL_START, gsap, useGSAP } from "../../lib/motion"

type Tag = "div" | "section" | "ul" | "ol" | "li" | "article" | "p" | "span"

interface AppearProps {
  children: ReactNode
  as?: Tag
  className?: string
  delay?: number
  /** Сдвиг снизу в пикселях */
  y?: number
  /** Если задан — появляются дочерние элементы по очереди с этим шагом (сетки карточек, списки) */
  stagger?: number
  play?: "scroll" | "mount"
  /** Пока true, анимация ждёт — например, пока на экране интро-заставка */
  paused?: boolean
}

/**
 * Блок мягко проявляется и поднимается при появлении в окне — один раз.
 * Замена прежнего Reveal для секций редизайна.
 */
export function Appear({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 48,
  stagger,
  play = "scroll",
  paused = false,
}: AppearProps) {
  const ref = useRef<HTMLElement | null>(null)

  useGSAP(
    () => {
      const element = ref.current
      if (!element || paused) return

      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(stagger === undefined ? element : element.children, {
          autoAlpha: 0,
          y,
          delay,
          stagger,
          scrollTrigger: play === "scroll" ? { trigger: element, start: REVEAL_START, once: true } : undefined,
          /* Остаточный transform создаёт новый контекст наложения — после анимации убираем */
          clearProps: "transform,opacity,visibility",
        })
      })
    },
    { dependencies: [delay, y, stagger, play, paused], revertOnUpdate: true }
  )

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  )
}
