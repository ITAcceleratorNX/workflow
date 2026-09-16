import { useRef } from "react"
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react"
import { Action } from "../ui/Action"
import { actionArrowClass } from "../ui/actionVariants"
import { SmartImage } from "../ui/SmartImage"
import { Appear } from "../motion/Appear"
import { TextReveal } from "../motion/TextReveal"
import { MOTION_OK, gsap, useGSAP } from "../../lib/motion"
import { useScrollToElement } from "../../lib/smoothScroll"
import type { Property } from "../../lib/properties"

/* Короткие факты рядом с заголовком: эти характеристики есть у каждого объекта */
const HERO_FACTS = ["Класс", "Год постройки", "Этажность"]

interface PropertyHeroProps {
  property: Property
  headingLevel: "h1" | "h2"
  title: string
  eyebrow: string
  priority?: boolean
}

/**
 * Первый экран объекта: фасад на весь экран, заголовок с названием курсивом,
 * адрес, быстрые переходы к площадям и записи на просмотр.
 */
export function PropertyHero({
  property,
  headingLevel,
  title,
  eyebrow,
  priority = false,
}: PropertyHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const scrollToElement = useScrollToElement()

  const facts = HERO_FACTS.flatMap((label) => property.specs.filter((spec) => spec.label === label))
  /* Название объекта в заголовке выделяем курсивом: «Бизнес-центр Venus в Алматы» */
  const [titleBefore, titleAfter] = title.includes(property.name) ? title.split(property.name) : [title, null]

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        /* Фото «отъезжает» при открытии и медленно уходит вниз при прокрутке */
        gsap.fromTo(mediaRef.current, { scale: 1.18 }, { scale: 1.06, duration: 2.2 })
        gsap.to(mediaRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
        })
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      data-header-hero
      className="relative h-svh min-h-[600px] overflow-hidden bg-graphite-950 text-ivory-50"
    >
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <SmartImage
          key={property.heroPhoto}
          src={property.heroPhoto}
          alt={property.heroPhotoAlt}
          priority={priority}
          placeholderLabel={`Фото фасада - ${property.name}`}
          sizes="100vw"
        />
      </div>

      {/* Затемнение: сверху под шапку, снизу и слева под текст */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-graphite-950/70 via-graphite-950/10 via-40% to-graphite-950/90"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-graphite-950/50 to-transparent" />

      <div className="relative flex h-full flex-col justify-end">
        <div className="shell grid gap-10 pb-12 sm:pb-16 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <Appear play="mount" delay={0.2} className="flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-12 bg-ochre-500" />
              <p className="label text-ochre-300">{eyebrow}</p>
            </Appear>

            <TextReveal
              as={headingLevel}
              play="mount"
              delay={0.3}
              className="mt-6 max-w-4xl text-display-xl font-medium text-ivory-50"
            >
              {titleAfter === null ? (
                titleBefore
              ) : (
                <>
                  {titleBefore}
                  <span className="accent-serif text-ochre-300">{property.name}</span>
                  {titleAfter}
                </>
              )}
            </TextReveal>

            <Appear as="p" play="mount" delay={0.6} className="mt-6 flex items-start gap-2 text-lead text-graphite-200">
              <MapPin className="mt-1.5 h-4 w-4 shrink-0 text-ochre-400" />
              {property.address}
            </Appear>

            <Appear play="mount" delay={0.75} stagger={0.08} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Action size="lg" onClick={() => scrollToElement(document.getElementById(`viewing-${property.slug}`))}>
                Записаться на просмотр
                <ArrowUpRight className={actionArrowClass} />
              </Action>
              <Action
                variant="glass"
                size="lg"
                onClick={() => scrollToElement(document.getElementById(`availability-${property.slug}`))}
              >
                Свободные площади
                <ArrowDown className="h-4 w-4" />
              </Action>
            </Appear>
          </div>

          {facts.length > 0 && (
            <Appear play="mount" delay={0.9} className="lg:col-span-4">
              <dl className="grid grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-6">
                {facts.map((fact) => (
                  /* Значения прижаты к низу: подпись в две строки на телефоне не сдвигает цифру */
                  <div key={fact.label} className="flex flex-col justify-between px-4 first:pl-0 last:pr-0">
                    <dt className="text-sm text-graphite-300">{fact.label}</dt>
                    <dd className="numeric mt-2 text-title font-medium leading-none">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Appear>
          )}
        </div>
      </div>
    </section>
  )
}
