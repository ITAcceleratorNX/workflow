import { Link } from "react-router-dom"
import { ArrowUpRight, MapPin } from "lucide-react"
import { SectionTitle } from "../ui/SectionTitle"
import { SmartImage } from "../ui/SmartImage"
import { actionVariants } from "../ui/actionVariants"
import { Appear } from "../motion/Appear"
import { cn } from "../../lib/utils"
import type { Property } from "../../lib/properties"

/** Переходы на другие объекты (раздел 5.12 ТЗ): обложки - фотографии фасада снаружи. */
export function OtherPropertiesSection({ properties }: { properties: Property[] }) {
  return (
    <section className="bg-ivory-50 py-24 sm:py-32">
      <div className="shell">
        <SectionTitle
          label="Другие объекты"
          title={
            <>
              Другие бизнес-центры <span className="accent-serif text-ochre-700">TMK WorkFlow</span>
            </>
          }
          description="Откройте страницу объекта, чтобы посмотреть свободные площади, характеристики и фотографии."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {properties.map((property, index) => (
            <Appear key={property.slug} delay={index * 0.1} className="min-w-0">
              <Link
                to={property.path}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-graphite-900 text-ivory-50 sm:aspect-[4/3]"
              >
                <div className="absolute inset-0">
                  <SmartImage
                    src={property.cover}
                    alt={property.coverAlt}
                    placeholderLabel={`Фасад - ${property.name}`}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="transition-transform duration-1200 ease-out-expo group-hover:scale-105"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-graphite-950/20 via-40% to-graphite-950/90"
                />

                <div className="relative min-w-0 p-6 sm:p-10">
                  <p className="label text-graphite-300">{property.shortLabel}</p>
                  <h3 className="mt-4 text-display-md font-medium text-ivory-50 transition-colors duration-600 group-hover:text-ochre-300">
                    {property.name}
                  </h3>
                  <p className="mt-3 flex items-start gap-2 text-graphite-200">
                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-ochre-400" />
                    {property.address}
                  </p>
                  <span
                    className={cn(
                      actionVariants({ variant: "glass" }),
                      "pointer-events-none mt-8 h-auto min-h-12 max-w-full whitespace-normal px-4 py-3 text-center leading-snug group-hover:border-white/50 group-hover:bg-white/[0.14] sm:px-6"
                    )}
                  >
                    <span className="min-w-0">Смотреть {property.name}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-400 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Appear>
          ))}
        </div>
      </div>
    </section>
  )
}
