import { Link } from "react-router-dom"
import { ArrowRight, MapPin } from "lucide-react"
import { Section, SectionHeading } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { SmartImage } from "../ui/SmartImage"
import { buttonVariants } from "../ui/buttonVariants"
import { cn } from "../../lib/utils"
import { PROPERTIES } from "../../lib/properties"

/** Три карточки БЦ сразу после Hero — переход на страницы объектов. */
export function PropertyCardsSection() {
  return (
    <Section tone="white" size="lg" id="objects">
      <SectionHeading
        eyebrow="Бизнес-центры"
        title="Выберите объект"
        description="Три бизнес-центра класса А в Алматы — откройте страницу, чтобы посмотреть площади, ставки и фото."
      />

      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {PROPERTIES.map((property, index) => (
          <Reveal as="li" key={property.slug} delay={index * 90}>
            <Link
              to={property.path}
              className="zoom-media group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <SmartImage
                  src={property.cover}
                  alt={property.coverAlt}
                  placeholderLabel={`Фасад — ${property.name}`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
                  {property.shortLabel}
                </p>
                <h3 className="mt-2 text-2xl text-brand-900">{property.name}</h3>
                <p className="mt-2 flex items-start gap-2 text-sm text-ink-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  {property.address}
                </p>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-muted">
                  {property.cardBlurb}
                </p>
                <span
                  className={cn(
                    buttonVariants({ variant: "primary", size: "md" }),
                    "mt-6 w-full pointer-events-none sm:w-auto"
                  )}
                >
                  Смотреть {property.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
