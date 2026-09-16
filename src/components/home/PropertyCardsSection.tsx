import { Link } from "react-router-dom"
import { ArrowUpRight, MapPin } from "lucide-react"
import { SectionTitle } from "../ui/SectionTitle"
import { SmartImage } from "../ui/SmartImage"
import { actionVariants } from "../ui/actionVariants"
import { Appear } from "../motion/Appear"
import { Parallax } from "../motion/Parallax"
import { PROPERTIES } from "../../lib/properties"
import { cn } from "../../lib/utils"

/**
 * Бизнес-центры: крупные ряды «фото + описание», фото чередуются слева и справа.
 * Весь ряд - ссылка на страницу объекта.
 */
export function PropertyCardsSection() {
  return (
    <section id="objects" className="bg-graphite-950 py-24 text-ivory-50 sm:py-32">
      <div className="shell">
        <SectionTitle
          tone="dark"
          label="Бизнес-центры"
          title={
            <>
              Выберите <span className="accent-serif text-ochre-300">объект</span>
            </>
          }
          description="Три бизнес-центра класса А в Алматы - откройте страницу, чтобы посмотреть площади, ставки и фото."
        />

        <ul className="mt-16 border-t border-white/10 sm:mt-24">
          {PROPERTIES.map((property, index) => {
            const mirrored = index % 2 === 1

            return (
              <li key={property.slug} className="border-b border-white/10">
                <Link
                  to={property.path}
                  className="group grid gap-8 py-10 sm:py-14 lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-20"
                >
                  {/* Порядок нужен сетке: иначе при фото справа текст уехал бы на следующую строку */}
                  <div className={cn("lg:col-span-5", mirrored ? "lg:order-2 lg:col-start-8" : "lg:col-start-1")}>
                    <Parallax amount={8} className="aspect-[4/3] rounded-3xl bg-graphite-900 lg:aspect-[4/5]">
                      <SmartImage
                        src={property.cover}
                        alt={property.coverAlt}
                        placeholderLabel={`Фасад - ${property.name}`}
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="transition-transform duration-1200 ease-out-expo group-hover:scale-105"
                      />
                    </Parallax>
                  </div>

                  <Appear className={cn("lg:col-span-6", mirrored ? "lg:order-1 lg:col-start-1" : "lg:col-start-7")}>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="numeric text-ochre-400">{String(index + 1).padStart(2, "0")}</span>
                      <span aria-hidden="true" className="h-px w-12 bg-white/20" />
                      <span className="label text-graphite-400">{property.shortLabel}</span>
                    </div>
                    <h3 className="mt-6 text-display-lg font-medium text-ivory-50 transition-colors duration-600 group-hover:text-ochre-300">
                      {property.name}
                    </h3>
                    <p className="mt-4 flex items-start gap-2 text-graphite-300">
                      <MapPin className="mt-1 h-4 w-4 shrink-0 text-ochre-400" />
                      {property.address}
                    </p>
                    <p className="mt-6 max-w-xl text-lead text-graphite-200">{property.cardBlurb}</p>
                    <span
                      className={cn(
                        actionVariants({ variant: "glass", size: "lg" }),
                        "pointer-events-none mt-10 group-hover:border-white/50 group-hover:bg-white/[0.14]"
                      )}
                    >
                      Смотреть {property.name}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-400 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Appear>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
