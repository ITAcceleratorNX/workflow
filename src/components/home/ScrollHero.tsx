import { useRef } from "react"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { Action } from "../ui/Action"
import { actionArrowClass } from "../ui/actionVariants"
import { Appear } from "../motion/Appear"
import { ScrollHeroMedia } from "./ScrollHeroMedia"
import { TextReveal } from "../motion/TextReveal"
import { EASE, MOTION_OK, gsap, useGSAP } from "../../lib/motion"
import { SCROLL_HERO } from "../../lib/homeContent"
import { useIntroPhase } from "../../lib/intro"
import { useLeadForm } from "../../lib/leadFormContext"
import { useScrollToElement } from "../../lib/smoothScroll"
import { cn } from "../../lib/utils"

/*
 * Шкала сцены в условных единицах: вся прокрутка обёртки = TIMELINE_END.
 * Первый экран уходит, затем главы сменяют друг друга, в конце - призыв.
 */
const OPENING_OUT = 0.5
const CHAPTER_START = 1.8
const CHAPTER_STEP = 2.6
/* Сколько глава стоит на экране между появлением и уходом */
const CHAPTER_HOLD = 1.7
const FINALE_START = CHAPTER_START + CHAPTER_STEP * SCROLL_HERO.chapters.length
/* Последний отрезок прокрутки финал просто стоит - время нажать кнопку.
   Длину шкалы задаёт полоса прогресса: она идёт от 0 до TIMELINE_END */
const TIMELINE_END = FINALE_START + 1.6

/* Точки смены номера в счётчике: первый экран, главы, финал */
const CHECKPOINTS = [
  0,
  ...SCROLL_HERO.chapters.map((_, index) => CHAPTER_START + CHAPTER_STEP * index),
  FINALE_START,
]
const pad = (value: number) => String(value).padStart(2, "0")

/** Индекс последней пройденной точки; номер меняется чуть раньше, чем глава полностью выехала */
function checkpointAt(time: number) {
  let index = 0
  CHECKPOINTS.forEach((point, i) => {
    if (time >= point - 0.3) index = i
  })
  return index
}

/**
 * Hero главной: сцена закреплена на экране, пока прокручивается высокая обёртка.
 * Прокрутка ведёт пролёт по офису (кадры ролика) и сменяет главы с текстами.
 */
export function ScrollHero() {
  const wrapperRef = useRef<HTMLElement>(null)
  /* Прогресс сцены 0…1: пишет ScrollTrigger, читает медиа-слой в каждом кадре */
  const progressRef = useRef(0)
  const scrimRef = useRef<HTMLDivElement>(null)
  const openingRef = useRef<HTMLDivElement>(null)
  const finaleRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLSpanElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  /* Первый экран появляется вместе с уходом шторки интро, а не под ней */
  const introReady = useIntroPhase() !== "loading"
  const { openLeadForm } = useLeadForm()
  const scrollToElement = useScrollToElement()
  const { opening, chapters, finale } = SCROLL_HERO

  useGSAP(
    () => {
      const wrapper = wrapperRef.current
      if (!wrapper) return

      gsap.matchMedia().add(MOTION_OK, () => {
        let shownIndex = 0

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              progressRef.current = self.progress
              const index = checkpointAt(self.progress * TIMELINE_END)
              if (index !== shownIndex && counterRef.current) {
                shownIndex = index
                counterRef.current.textContent = pad(index + 1)
              }
            },
          },
        })

        timeline
          .fromTo(railRef.current, { scaleX: 0 }, { scaleX: 1, duration: TIMELINE_END }, 0)
          .to(hintRef.current, { autoAlpha: 0, duration: 0.3 }, 0)
          .to(openingRef.current, { autoAlpha: 0, y: -80, duration: 1, ease: "power2.in" }, OPENING_OUT)

        wrapper.querySelectorAll<HTMLElement>("[data-hero-chapter]").forEach((chapter, index) => {
          const start = CHAPTER_START + CHAPTER_STEP * index
          const items = chapter.querySelectorAll("[data-hero-item]")

          timeline
            .set(chapter, { autoAlpha: 1 }, start)
            .from(items, { autoAlpha: 0, y: 80, duration: 0.9, stagger: 0.12, ease: EASE.outQuart }, start)
            .to(items, { autoAlpha: 0, y: -60, duration: 0.8, stagger: 0.08, ease: "power2.in" }, start + CHAPTER_HOLD)
            .set(chapter, { autoAlpha: 0 }, start + CHAPTER_HOLD + 0.8)
        })

        timeline
          .to(scrimRef.current, { opacity: 1, duration: 1 }, FINALE_START - 0.4)
          .set(finaleRef.current, { autoAlpha: 1 }, FINALE_START)
          .from(
            finaleRef.current?.querySelectorAll("[data-hero-item]") ?? [],
            { autoAlpha: 0, y: 80, duration: 0.9, stagger: 0.12, ease: EASE.outQuart },
            FINALE_START
          )
      })
    },
    { scope: wrapperRef }
  )

  return (
    <section
      ref={wrapperRef}
      data-header-hero
      aria-label="TMK WorkFlow - офисы в Алматы"
      /* Высота = длина прохода по сцене. Без анимаций сцена обычной высоты экрана */
      className="relative h-[440svh] bg-graphite-950 sm:h-[520svh] motion-reduce:!h-svh"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <ScrollHeroMedia progressRef={progressRef} />

        {/* Затемнение: сверху под шапку, снизу под тексты и слева под главы */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-graphite-950/70 from-0% via-graphite-950/20 via-35% to-graphite-950/90"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-graphite-950/60 via-graphite-950/10 to-transparent"
        />
        <div ref={scrimRef} aria-hidden="true" className="absolute inset-0 bg-graphite-950/55 opacity-0" />

        {/* Первый экран */}
        <div ref={openingRef} className="absolute inset-0 flex items-end">
          <div className="shell w-full pb-28 sm:pb-32">
            <Appear play="mount" paused={!introReady} delay={0.3} className="flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-12 bg-ochre-500" />
              <p className="label text-ochre-300">{opening.label}</p>
            </Appear>

            <TextReveal
              as="h1"
              play="mount"
              paused={!introReady}
              delay={0.4}
              className="mt-6 max-w-5xl text-display-xl font-medium text-ivory-50"
            >
              {opening.title} <span className="accent-serif text-ochre-300">{opening.titleAccent}</span>
            </TextReveal>

            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <Appear
                as="p"
                play="mount"
                paused={!introReady}
                delay={0.8}
                className="max-w-xl text-lead text-graphite-200"
              >
                {opening.description}
              </Appear>
              <Appear play="mount" paused={!introReady} delay={0.95}>
                <Action size="lg" onClick={() => openLeadForm({ source: "hero-select-office" })}>
                  {opening.cta}
                  <ArrowUpRight className={actionArrowClass} />
                </Action>
              </Appear>
            </div>
          </div>
        </div>

        {/* Главы: появляются только при прокрутке; без анимаций не показываются */}
        <div className="motion-reduce:hidden">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.label}
              data-hero-chapter
              className="invisible absolute inset-0 flex items-end pb-28 sm:items-center sm:pb-0"
            >
              <div className={cn("shell flex w-full", chapter.align === "right" && "sm:justify-end")}>
                <div className="max-w-2xl">
                  <div data-hero-item className="flex items-center gap-4">
                    <span className="numeric text-sm text-ochre-300">{pad(index + 1)}</span>
                    <span aria-hidden="true" className="h-px w-12 bg-ochre-500" />
                    <p className="label text-ochre-300">{chapter.label}</p>
                  </div>
                  <h2 data-hero-item className="mt-6 text-display-lg font-medium text-ivory-50">
                    {chapter.title} <span className="accent-serif text-ochre-300">{chapter.accent}</span>
                  </h2>
                  <p data-hero-item className="mt-6 max-w-lg text-lead text-graphite-200">
                    {chapter.text}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Финал */}
          <div
            ref={finaleRef}
            className="invisible absolute inset-0 flex items-end pb-28 sm:items-center sm:pb-0"
          >
            <div className="shell w-full text-left sm:text-center">
              <h2 data-hero-item className="mx-auto max-w-4xl text-display-xl font-medium text-ivory-50">
                {finale.title} <span className="accent-serif text-ochre-300">{finale.accent}</span>
              </h2>
              <div data-hero-item className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Action size="lg" onClick={() => openLeadForm({ source: "hero-select-office" })}>
                  {finale.cta}
                  <ArrowUpRight className={actionArrowClass} />
                </Action>
                <Action
                  variant="glass"
                  size="lg"
                  onClick={() => scrollToElement(document.getElementById("objects"))}
                >
                  {finale.secondaryCta}
                </Action>
              </div>
            </div>
          </div>
        </div>

        {/* Шкала прохода: номер главы, подсказка и прогресс */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 motion-reduce:hidden">
          <div className="shell relative flex items-center gap-4 pb-8 text-sm sm:gap-6 sm:pb-10">
            {/* Подсказка над шкалой: исчезает с первой прокруткой и не оставляет пустоты в строке */}
            <span
              ref={hintRef}
              className="absolute bottom-full mb-4 flex items-center gap-2 text-graphite-300 sm:mb-5"
            >
              {opening.scrollHint}
              <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
            </span>
            <span ref={counterRef} className="numeric text-ivory-50">
              01
            </span>
            <div className="h-px flex-1 bg-white/15">
              <div ref={railRef} className="h-full w-full origin-left scale-x-0 bg-ochre-500" />
            </div>
            <span className="numeric text-graphite-400">{pad(CHECKPOINTS.length)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
