import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { Reveal } from "../ui/Reveal"
import { SmartImage } from "../ui/SmartImage"
import { HERO } from "../../lib/homeContent"
import { useLeadForm } from "../../lib/leadFormContext"

/** Хиро-блок главной страницы (раздел 5.1 ТЗ): текст слева, крупное изображение справа. */
export function HeroSection() {
  const { openLeadForm } = useLeadForm()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full bg-brand-100 blur-3xl"
      />

      <div className="container-site relative py-12 sm:py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow">{HERO.eyebrow}</p>
            <h1 className="mt-4 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">{HERO.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {HERO.description}
            </p>
            <Button
              size="lg"
              className="mt-8 w-full sm:w-auto"
              onClick={() => openLeadForm({ source: "hero-select-office" })}
            >
              {HERO.cta}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-float lg:aspect-[5/4]">
              <SmartImage
                src={HERO.image}
                alt={HERO.imageAlt}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
