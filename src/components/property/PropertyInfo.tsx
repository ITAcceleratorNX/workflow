import { MapPin } from "lucide-react"
import { Section, SectionHeading } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { useLocale } from "../../lib/i18n/LocaleProvider"
import type { Property } from "../../lib/properties"

/** Сколько характеристик выносим плитками; полный список — в блоке «Характеристики» ниже */
const KEY_FACTS = 4

/**
 * Информация об объекте: название, адрес, краткое описание и ряд ключевых фактов.
 * Описания короткие (одно-два предложения), поэтому блок идёт в одну колонку, без сайдбара.
 */
export function PropertyInfo({
  property,
  level,
}: {
  property: Property
  level: "h2" | "h3"
}) {
  const { t } = useLocale()

  return (
    <Section tone="white" size="md">
      <SectionHeading eyebrow={t.property.about} title={property.name} level={level} />

      <Reveal delay={60}>
        <p className="mt-4 flex items-start gap-2 text-[15px] font-medium text-brand-900 sm:text-base">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500 sm:h-5 sm:w-5" />
          <span>
            <span className="sr-only">{t.property.address}: </span>
            {property.address}
          </span>
        </p>
      </Reveal>

      <Reveal className="mt-5 max-w-4xl space-y-4" delay={100}>
        {property.description.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed text-ink-muted sm:text-lg">
            {paragraph}
          </p>
        ))}
      </Reveal>

      <Reveal delay={140}>
        <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {property.specs.slice(0, KEY_FACTS).map((spec) => (
            <div key={spec.label} className="rounded-2xl border border-brand-100 bg-brand-50/60 px-5 py-4">
              <dt className="text-xs uppercase tracking-wider text-ink-soft">{spec.label}</dt>
              <dd className="mt-1.5 text-[15px] font-semibold leading-snug text-brand-900 first-letter:uppercase sm:text-lg">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  )
}
