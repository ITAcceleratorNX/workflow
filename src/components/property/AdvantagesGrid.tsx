import { SectionTitle } from "../ui/SectionTitle"
import { Appear } from "../motion/Appear"
import { ADVANTAGE_ICONS } from "../../lib/advantageIcons"
import type { Property } from "../../lib/properties"

/**
 * Основные преимущества иконками с короткими подписями (5.9 / 6.5 / 7.5 ТЗ).
 * Линия над каждым пунктом вместо рамок: неполный последний ряд не выглядит оборванным.
 */
export function AdvantagesGrid({
  property,
  level,
}: {
  property: Property
  level: "h2" | "h3"
}) {
  return (
    <section className="bg-ivory-50 py-24 sm:py-32">
      <div className="shell">
        <SectionTitle
          as={level}
          label="Преимущества"
          title={
            <>
              Основные <span className="accent-serif text-ochre-700">преимущества</span>
            </>
          }
        />

        <Appear
          as="ul"
          stagger={0.05}
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5"
        >
          {property.advantages.map((advantage) => {
            const Icon = ADVANTAGE_ICONS[advantage.icon]
            return (
              <li key={advantage.label} className="min-w-0 border-t border-graphite-950/15 pt-5">
                <Icon className="h-6 w-6 text-ochre-700" strokeWidth={1.5} aria-hidden />
                <p className="mt-6 hyphens-auto font-medium leading-snug [overflow-wrap:anywhere]">{advantage.label}</p>
              </li>
            )
          })}
        </Appear>
      </div>
    </section>
  )
}
