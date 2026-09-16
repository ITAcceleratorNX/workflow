import { useRef } from "react"
import { LogoLockup } from "../layout/Logo"
import { EASE, gsap, SplitText, useGSAP } from "../../lib/motion"
import { getLoadProgress, setIntroPhase, trackLoad, useIntroPhase } from "../../lib/intro"
import { useScrollLock } from "../../lib/smoothScroll"

/* Минимум на экране, в секундах: чтобы заставка не мелькнула, даже если всё уже в кеше */
const MIN_DURATION_FIRST = 2.4
/* Повторное открытие в той же вкладке - короче: сайт уже знаком */
const MIN_DURATION_REPEAT = 0.9
/* Дольше не держим: на медленной сети загрузка продолжится в фоне, а человек уже видит сайт */
const MAX_WAIT = 8
/* Доля пути до цели, которую счётчик проходит за кадр: цифры бегут плавно, без скачков */
const COUNTER_LERP = 0.08
/* Когда всё загружено, последние проценты добегают быстрее - не держим готовый сайт лишнюю секунду */
const COUNTER_LERP_FINISH = 0.2
const SEEN_KEY = "tmk-intro-seen"

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1"
  } catch {
    return false
  }
}

function writeSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1")
  } catch {
    /* приватный режим без хранилища - просто покажем полную версию ещё раз */
  }
}

/**
 * Заставка при открытии главной. Пока она на экране, в фоне грузится всё,
 * что зарегистрировано через trackLoad / reportLoad (шрифты, позже - видео hero).
 */
export function Intro() {
  const phase = useIntroPhase()
  if (phase === "done") return null
  return <IntroOverlay />
}

function IntroOverlay() {
  const rootRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLParagraphElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useScrollLock(true)

  useGSAP(
    () => {
      const root = rootRef.current
      const word = wordRef.current
      const counter = counterRef.current
      const bar = barRef.current
      if (!root || !word || !counter || !bar) return

      trackLoad("fonts", document.fonts.ready)

      const minDuration = readSeen() ? MIN_DURATION_REPEAT : MIN_DURATION_FIRST
      const split = SplitText.create(word, { type: "chars", mask: "chars", charsClass: "split-char" })

      /* Появление: буквы выезжают из-под маски, подписи проявляются */
      gsap
        .timeline()
        .from(split.chars, { yPercent: 110, duration: 1.2, stagger: 0.045 })
        .from("[data-intro-fade]", { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.08 }, 0.25)

      /* leave вызывается позже из тика - вне области useGSAP, поэтому элементы ищем явно */
      const fades = root.querySelectorAll("[data-intro-fade]")

      const leave = () => {
        writeSeen()
        gsap
          .timeline({ onComplete: () => setIntroPhase("done") })
          .to(split.chars, { yPercent: -110, duration: 0.8, stagger: 0.03, ease: EASE.inOutQuart })
          .to(fades, { autoAlpha: 0, y: -12, duration: 0.5, ease: EASE.inOutQuart }, 0)
          /* Шторка уходит вверх; с её началом появляются шапка и hero */
          .add(() => setIntroPhase("leaving"), 0.55)
          .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: EASE.inOutQuart }, 0.55)
      }

      const startedAt = performance.now()
      let shown = 0

      const tick = () => {
        const elapsed = (performance.now() - startedAt) / 1000
        const loaded = elapsed >= MAX_WAIT ? 1 : getLoadProgress()
        /* Счётчик не обгоняет ни реальную загрузку, ни минимальное время показа */
        const target = Math.min(loaded, elapsed / minDuration)

        shown += (target - shown) * (target >= 1 ? COUNTER_LERP_FINISH : COUNTER_LERP)
        if (target >= 1 && shown > 0.995) shown = 1

        counter.textContent = String(Math.floor(shown * 100))
        bar.style.transform = `scaleX(${shown})`

        if (shown === 1) {
          gsap.ticker.remove(tick)
          leave()
        }
      }

      gsap.ticker.add(tick)

      return () => {
        gsap.ticker.remove(tick)
        split.revert()
      }
    },
    { scope: rootRef }
  )

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex flex-col bg-graphite-950 text-ivory-50"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <p role="status" className="sr-only">
        Загружаем сайт
      </p>

      {/* Верхняя строка стоит там же, где шапка: после шторки логотип остаётся на месте */}
      <div className="shell flex h-16 items-center justify-between gap-4 lg:h-20">
        <span data-intro-fade>
          <LogoLockup />
        </span>
        <p data-intro-fade className="label hidden text-graphite-400 sm:block">
          Коммерческая недвижимость · Алматы
        </p>
      </div>

      <div className="shell flex flex-1 items-center" aria-hidden="true">
        <p
          ref={wordRef}
          className="whitespace-nowrap text-display-2xl font-medium leading-none tracking-[-0.05em]"
        >
          WorkFlow
        </p>
      </div>

      <div className="shell pb-[max(2rem,env(safe-area-inset-bottom))]" aria-hidden="true">
        <div className="h-px w-full bg-white/10">
          <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-ochre-500" />
        </div>
        <div className="mt-5 flex items-end justify-between gap-4">
          <p data-intro-fade className="text-xs text-graphite-400 sm:text-sm">
            Time Square · Venus · Koktem Towers
          </p>
          <p data-intro-fade className="numeric flex items-start text-display-md font-light leading-none">
            {/* Место под три цифры: при переходе 99 → 100 строка не сдвигается */}
            <span ref={counterRef} className="inline-block w-[3ch] text-right">
              0
            </span>
            <span className="ml-1 mt-1 text-title text-graphite-500">%</span>
          </p>
        </div>
      </div>
    </div>
  )
}
