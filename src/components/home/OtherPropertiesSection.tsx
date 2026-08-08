import { Link } from "react-router-dom"
import { ArrowRight, MapPin } from "lucide-react"
import { Section, SectionHeading } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { SmartImage } from "../ui/SmartImage"
import { buttonVariants } from "../ui/buttonVariants"
import { cn } from "../../lib/utils"
import type { Property } from "../../lib/properties"

/** Переходы на другие объекты (раздел 5.12 ТЗ): обложки — фотографии фасада снаружи. */
export function OtherPropertiesSection({ properties }: { properties: Property[] }) {
  return (
    <Section tone="white" size="lg">
      <SectionHeading
        eyebrow="Другие объекты"
        title="Ещё два бизнес-центра в Алматы"
        description="Откройте страницу объекта, чтобы посмотреть свободные площади, характеристики и фотографии."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {properties.map((property, index) => (
          <Reveal key={property.slug} delay={index * 100}>
            <Link
              to={property.path}
              className="zoom-media group relative flex h-full min-h-[360px] flex-col justify-end overflow-hidden rounded-3xl shadow-card transition hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:min-h-[440px]"
            >
              <div className="absolute inset-0">
                <SmartImage
                  src={property.cover}
                  alt={property.coverAlt}
                  placeholderLabel={`Фасад — ${property.name}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(14,53,82,0.1) 30%, rgba(14,53,82,0.9) 100%)",
                }}
              />

              <div className="relative p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-200">
                  {property.shortLabel}
                </p>
                <h3 className="mt-2 text-3xl text-white sm:text-4xl">{property.name}</h3>
                <p className="mt-2 flex items-start gap-2 text-sm text-brand-100">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                  {property.address}
                </p>
                <span
                  className={cn(
                    buttonVariants({ variant: "primary", size: "md" }),
                    "mt-6 pointer-events-none"
                  )}
                >
                  Смотреть {property.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
