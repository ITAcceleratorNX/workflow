import { MapPin } from "lucide-react"
import { SmartImage } from "../ui/SmartImage"
import type { Property } from "../../lib/properties"

interface PropertyHeroProps {
  property: Property
  headingLevel: "h1" | "h2"
  title: string
  eyebrow: string
  priority?: boolean
}

/**
 * Крупная фотография объекта, открывающая блок (разделы 5.4 / 6.1 / 7.1 ТЗ).
 * Кадрирование по центру, чтобы не срезать ключевые элементы фасада.
 */
export function PropertyHero({
  property,
  headingLevel,
  title,
  eyebrow,
  priority = false,
}: PropertyHeroProps) {
  const Heading = headingLevel

  return (
    <section className="relative">
      <div className="relative h-[62vh] min-h-[380px] w-full overflow-hidden sm:h-[70vh] sm:min-h-[520px]">
        <SmartImage
          key={property.heroPhoto}
          src={property.heroPhoto}
          alt={property.heroPhotoAlt}
          priority={priority}
          placeholderLabel={`Фото фасада — ${property.name}`}
          sizes="100vw"
          className="object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,53,82,0.55) 0%, rgba(14,53,82,0.15) 40%, rgba(14,53,82,0.85) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0">
          <div className="container-site pb-10 sm:pb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-200 sm:text-sm">
              {eyebrow}
            </p>
            <Heading className="mt-3 max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl">
              {title}
            </Heading>
            <p className="mt-4 flex items-start gap-2 text-sm text-brand-100 sm:text-base">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
              {property.address}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
