import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"
import { WhatsAppIcon } from "../ui/WhatsAppIcon"
import { HeroVideoMontage } from "./HeroVideoMontage"
import { useLeadForm } from "../../lib/leadFormContext"
import { useLocale } from "../../lib/i18n/LocaleProvider"
import { useWhatsAppGate } from "../../lib/whatsappGateContext"

/** Hero: full-screen видео и стеклянная панель по центру. */
export function HeroSection() {
  const { openLeadForm } = useLeadForm()
  const { t } = useLocale()
  const { openWhatsAppGate } = useWhatsAppGate()
  /* Длинный заголовок (казахская версия) набираем мельче, чтобы он не уходил на лишнюю строку */
  const longTitle = t.hero.title.length > 20

  return (
    <section
      id="home-hero-section"
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
              {t.hero.eyebrow}
            </p>

            <h1
              className={cn(
                "hero-fade hero-fade-2 mt-5 font-bold tracking-tight text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]",
                longTitle
                  ? "text-[clamp(2rem,1.1rem+3.4vw,3.25rem)]"
                  : "text-[clamp(2.4rem,1.4rem+4.5vw,4.25rem)]",
                /* Межстрочный интервал — после размера: иначе класс размера его сбрасывает */
                "leading-[1.05]"
              )}
            >
              {t.hero.title}
              <span className="mt-1 block text-white/90">{t.hero.titleAccent}</span>
            </h1>

            <p className="hero-fade hero-fade-3 mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/90 sm:mt-7 sm:text-lg md:text-xl">
              {t.hero.description}
            </p>

            <div className="hero-fade hero-fade-4 mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row sm:justify-center sm:gap-5">
              <Button
                size="lg"
                className="min-h-12 w-full px-8 text-base sm:w-auto sm:min-h-14 sm:text-lg"
                onClick={() => openLeadForm({ source: "hero-select-office" })}
              >
                {t.hero.cta}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                className="min-h-12 w-full bg-[#25D366] px-8 text-base shadow-[0_8px_20px_-8px_rgba(37,211,102,0.7)] hover:bg-[#1ebe5b] hover:shadow-[0_12px_26px_-8px_rgba(37,211,102,0.75)] sm:w-auto sm:min-h-14 sm:text-lg"
                onClick={() => openWhatsAppGate({ placement: "hero" })}
              >
                <WhatsAppIcon className="h-5 w-5 text-white" />
                {t.common.whatsapp}
              </Button>
            </div>

            <p className="hero-fade hero-fade-4 mt-6 text-sm text-white/75 sm:mt-8 sm:text-base">{t.hero.objectsLine}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
