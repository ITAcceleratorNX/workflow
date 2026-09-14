import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { HeroVideoMontage } from "./HeroVideoMontage"
import { HERO } from "../../lib/homeContent"
import { useLeadForm } from "../../lib/leadFormContext"

/**
 * Hero главной: full-screen видео, текст справа с акцентной композицией.
 */
export function HeroSection() {
  const { openLeadForm } = useLeadForm()

  return (
    <section
      id="home-hero-section"
      className="hero-screen relative z-[1] mb-[-1px] flex w-full flex-col overflow-hidden bg-brand-950"
    >
      <HeroVideoMontage />

      <div className="container-site relative z-10 flex w-full flex-1 items-end justify-end pb-[max(3.5rem,env(safe-area-inset-bottom,0px))] pt-[max(4.5rem,env(safe-area-inset-top,0px))] sm:items-center sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-24">
        <div className="hero-fade hero-fade-1 w-full max-w-xl text-right md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <div className="relative ml-auto rounded-3xl border border-white/15 bg-brand-950/85 p-6 shadow-[0_28px_90px_-20px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-8 lg:bg-brand-950/80 lg:p-10">
            <div
              aria-hidden="true"
              className="absolute -left-px top-8 hidden h-16 w-1 rounded-full bg-orange-500 sm:block lg:top-10 lg:h-20"
            />

            <p className="hero-fade hero-fade-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-orange-400 sm:text-xs">
              {HERO.eyebrow}
            </p>

            <h1 className="hero-fade hero-fade-2 mt-4 text-[clamp(2rem,1.1rem+3.8vw,3.5rem)] font-bold leading-[1.06] tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
              {HERO.title}
              <span className="mt-1 block text-white/90">{HERO.titleAccent}</span>
            </h1>

            <p className="hero-fade hero-fade-3 ml-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/85 sm:mt-6 sm:text-base">
              {HERO.description}
            </p>

            <div className="hero-fade hero-fade-4 mt-7 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
              <Button
                size="lg"
                className="min-h-12 w-full sm:w-auto"
                onClick={() => openLeadForm({ source: "hero-select-office" })}
              >
                {HERO.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-center text-xs text-white/70 sm:text-right">
                {HERO.objectsLine}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
