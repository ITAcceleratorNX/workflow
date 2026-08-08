import { Square } from "lucide-react"
import { Button } from "../ui/button"
import { Section } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { useLeadForm } from "../../lib/leadFormContext"
import type { Property } from "../../lib/properties"

/**
 * «Свободно к аренде» (5.7 / 6.3 / 7.3) и «Характеристики» (5.8 / 6.4 / 7.4).
 * Площади выводятся как в ТЗ, без пересчёта и объединения.
 */
export function AvailabilityAndSpecs({
  property,
  level: Heading,
}: {
  property: Property
  level: "h2" | "h3"
}) {
  const { openLeadForm } = useLeadForm()

  return (
    <Section tone="brand" size="md">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <Reveal>
            <p className="eyebrow">Свободно к аренде</p>
            <Heading className="mt-3 text-2xl sm:text-3xl">Доступные площади</Heading>
          </Reveal>

          <ul className="mt-6 space-y-3">
            {property.availability.map((item, index) => (
              <Reveal as="li" key={`${item.area}-${index}`} delay={index * 70}>
                <div className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-card transition hover:border-orange-200">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <Square className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xl font-bold text-brand-900 sm:text-2xl">{item.area}</p>
                    <p className="text-sm text-ink-muted">{item.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={140}>
            <Button
              size="lg"
              className="mt-6 w-full sm:w-auto"
              onClick={() => openLeadForm({ source: "viewing", property: property.name })}
            >
              Записаться на просмотр
            </Button>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <p className="eyebrow">Характеристики</p>
            <Heading className="mt-3 text-2xl sm:text-3xl">Краткая карточка объекта</Heading>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-6 overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card">
              <dl>
                {property.specs.map((spec, index) => (
                  <div
                    key={spec.label}
                    className={`flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 ${
                      index % 2 === 1 ? "bg-brand-50/60" : ""
                    }`}
                  >
                    <dt className="text-sm text-ink-muted">{spec.label}</dt>
                    <dd className="text-[15px] font-semibold text-brand-900 sm:text-right">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
