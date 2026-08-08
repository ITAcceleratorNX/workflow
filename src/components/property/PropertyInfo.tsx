import { MapPin } from "lucide-react"
import { Section, SectionHeading } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import type { Property } from "../../lib/properties"

/** Информация об объекте (разделы 5.5 / 6.2 / 7.2 ТЗ). */
export function PropertyInfo({
  property,
  level,
}: {
  property: Property
  level: "h2" | "h3"
}) {
  return (
    <Section tone="white" size="md">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <div>
          <SectionHeading eyebrow="Об объекте" title={property.name} level={level} />
          <Reveal className="mt-6 space-y-5" delay={80}>
            {property.description.map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed text-ink-muted sm:text-lg">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>

        <Reveal delay={140}>
          <div className="card-base sticky top-24 p-6">
            <p className="eyebrow">Адрес</p>
            <p className="mt-3 flex items-start gap-2 text-[15px] font-medium leading-relaxed text-brand-900">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
              {property.address}
            </p>
            <dl className="mt-6 space-y-4 border-t border-brand-100 pt-6">
              {property.specs.slice(0, 4).map((spec) => (
                <div key={spec.label}>
                  <dt className="text-xs uppercase tracking-wider text-ink-soft">{spec.label}</dt>
                  <dd className="mt-1 text-[15px] font-semibold text-brand-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
