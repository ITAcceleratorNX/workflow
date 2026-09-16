import { useRef, type ReactNode } from "react"
import { MOTION_OK, REVEAL_START, gsap, SplitText, useGSAP } from "../../lib/motion"

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span"
type SplitBy = "lines" | "words" | "chars"

interface TextRevealProps {
  children: ReactNode
  as?: Tag
  className?: string
  /** Что выезжает из-под маски: строки (заголовки), слова (абзацы) или буквы (короткие слова) */
  by?: SplitBy
  delay?: number
  /** Шаг между соседними строками / словами / буквами, в секундах */
  stagger?: number
  /** "scroll" — при появлении в окне, "mount" — сразу после отрисовки (hero, интро) */
  play?: "scroll" | "mount"
  /** Пока true, анимация ждёт — например, пока на экране интро-заставка */
  paused?: boolean
}

const DEFAULT_STAGGER: Record<SplitBy, number> = { lines: 0.09, words: 0.03, chars: 0.02 }

/* Для букв режем и на слова: иначе перенос строки может разорвать слово посередине */
const SPLIT_TYPE: Record<SplitBy, string> = { lines: "lines", words: "words", chars: "words,chars" }

/**
 * Текст выезжает снизу из-под маски — строка за строкой.
 * После анимации разметка возвращается к исходной: никаких лишних span и обрезанных хвостов букв.
 */
export function TextReveal({
  children,
  as: Tag = "div",
  className,
  by = "lines",
  delay = 0,
  stagger = DEFAULT_STAGGER[by],
  play = "scroll",
  paused = false,
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useGSAP(
    () => {
      const element = ref.current
      if (!element || paused) return

      gsap.matchMedia().add(MOTION_OK, () => {
        const split = SplitText.create(element, {
          type: SPLIT_TYPE[by],
          mask: by,
          linesClass: "split-line",
          wordsClass: "split-word",
          charsClass: "split-char",
          /* Пересобирает строки, если до запуска поменялась ширина или догрузился шрифт */
          autoSplit: true,
          onSplit: (self) => {
            /* Маски строк шире строки (см. .split-line-mask); flex-колонка не даёт их полям схлопнуться */
            if (by === "lines") element.classList.add("split-lines")

            return gsap.from(self[by], {
              yPercent: 150,
              duration: by === "lines" ? 1.3 : 1,
              stagger,
              delay,
              scrollTrigger: play === "scroll" ? { trigger: element, start: REVEAL_START, once: true } : undefined,
              onComplete: () => self.revert(),
            })
          },
          onRevert: () => element.classList.remove("split-lines"),
        })

        return () => split.revert()
      })
    },
    { dependencies: [by, delay, stagger, play, paused], revertOnUpdate: true }
  )

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  )
}
