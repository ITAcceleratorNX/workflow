import { Section, SectionHeading } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { ADVANTAGE_ICONS } from "../../lib/advantageIcons"
import type { Property } from "../../lib/properties"

/** Основные преимущества иконками с короткими подписями (5.9 / 6.5 / 7.5 ТЗ). */
export function AdvantagesGrid({
  property,
  level,
}: {
  property: Property
  level: "h2" | "h3"
}) {
  return (
    <Section tone="white" size="md">
      <SectionHeading eyebrow="Преимущества" title="Основные преимущества" level={level} />

      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {property.advantages.map((advantage, index) => {
          const Icon = ADVANTAGE_ICONS[advantage.icon]
          return (
            <Reveal as="li" key={advantage.label} delay={(index % 4) * 60}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-brand-100 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-card-hover">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium leading-snug text-brand-900 sm:text-[15px]">
                  {advantage.label}
                </p>
              </div>
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}
