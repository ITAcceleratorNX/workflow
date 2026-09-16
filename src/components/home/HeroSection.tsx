import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { HeroVideoMontage } from "./HeroVideoMontage"
import { HERO } from "../../lib/homeContent"
import { useLeadForm } from "../../lib/leadFormContext"

/** Hero: full-screen видео и стеклянная панель по центру. */
export function HeroSection() {
  const { openLeadForm } = useLeadForm()

  return (
    <section
      id="home-hero-section"
      data-header-hero
      className="hero-screen relative z-[1] mb-[-1px] flex w-full flex-col overflow-hidden bg-brand-950"
    >
      <HeroVideoMontage />

      <div className="container-site relative z-10 flex w-full flex-1 items-center justify-center px-4 pb-[max(3.5rem,env(safe-area-inset-bottom,0px))] pt-[max(4.5rem,env(safe-area-inset-top,0px))] sm:px-6 sm:pb-16 sm:pt-20">
        {/* Блюр на отдельном слое — без opacity-анимации, иначе backdrop-filter не работает */}
        <div className="relative w-full max-w-4xl lg:max-w-5xl">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl border border-white/20 bg-brand-950/35 shadow-[0_28px_90px_-20px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
          />
          <div
            aria-hidden="true"
            className="absolute left-0 top-1/2 hidden h-24 w-1 -translate-y-1/2 rounded-full bg-orange-500 sm:block"
          />

          <div className="relative px-6 py-8 text-center sm:px-10 sm:py-12 lg:px-16 lg:py-14">
            <p className="hero-fade hero-fade-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-400 sm:text-sm">
              {HERO.eyebrow}
            </p>

            <h1 className="hero-fade hero-fade-2 mt-5 text-[clamp(2.4rem,1.4rem+4.5vw,4.25rem)] font-bold leading-[1.05] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
              {HERO.title}
              <span className="mt-1 block text-white/90">{HERO.titleAccent}</span>
            </h1>

            <p className="hero-fade hero-fade-3 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/90 sm:mt-7 sm:text-lg md:text-xl">
              {HERO.description}
            </p>

            <div className="hero-fade hero-fade-4 mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row sm:justify-center sm:gap-5">
              <Button
                size="lg"
                className="min-h-12 w-full px-8 text-base sm:w-auto sm:min-h-14 sm:text-lg"
                onClick={() => openLeadForm({ source: "hero-select-office" })}
              >
                {HERO.cta}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <p className="text-sm text-white/75 sm:text-base">{HERO.objectsLine}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
