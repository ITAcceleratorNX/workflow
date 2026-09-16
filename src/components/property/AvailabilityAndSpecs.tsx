import { ArrowUpRight, Info } from "lucide-react"
import { Action } from "../ui/Action"
import { actionArrowClass } from "../ui/actionVariants"
import { SectionTitle } from "../ui/SectionTitle"
import { Appear } from "../motion/Appear"
import { TextReveal } from "../motion/TextReveal"
import { useLeadForm } from "../../lib/leadFormContext"
import type { Property } from "../../lib/properties"

/**
 * «Свободно к аренде» (5.7 / 6.3 / 7.3) и «Характеристики» (5.8 / 6.4 / 7.4).
 * Площади выводятся как в ТЗ, без пересчёта и объединения.
 *
 * Ставка стоит рядом с каждой площадью и всегда с пометкой «без НДС»
 * (ТЗ правок от 07.09.2026): страницы принимают платный трафик, и цена
 * без налоговой оговорки вводит арендатора в заблуждение.
 */
export function AvailabilityAndSpecs({
  property,
  level,
}: {
  property: Property
  level: "h2" | "h3"
}) {
  const { openLeadForm } = useLeadForm()

  return (
    <section id={`availability-${property.slug}`} className="bg-ivory-100 py-24 sm:py-32">
      <div className="shell">
        <SectionTitle
          as={level}
          label="Свободно к аренде"
          title={
            <>
              Доступные <span className="accent-serif text-ochre-700">площади</span>
            </>
          }
          description={property.splitNote}
        />

        {/* Площадь, назначение и ставка в одной строке: арендатор сверяет их вместе */}
        <Appear as="ul" stagger={0.08} className="mt-16 border-t border-graphite-950/15">
          {property.availability.map((item, index) => (
            <li
              key={`${item.area}-${index}`}
              className="grid gap-2 border-b border-graphite-950/15 py-6 md:grid-cols-12 md:items-baseline md:gap-6 md:py-8"
            >
              <p className="numeric text-display-md font-medium md:col-span-4">{item.area}</p>
              <p className="text-graphite-600 md:col-span-4">{item.note}</p>
              <p className="numeric text-lead font-medium text-ochre-700 md:col-span-4 md:text-right lg:text-title">
                {item.rate}
              </p>
            </li>
          ))}
        </Appear>

        {property.variantsNote && (
          <Appear delay={0.1}>
            <p className="mt-8 flex max-w-4xl gap-3 rounded-2xl bg-ivory-50 p-5 text-graphite-600">
              <Info className="mt-1 h-4 w-4 shrink-0 text-ochre-700" aria-hidden />
              <span>{property.variantsNote}</span>
            </p>
          </Appear>
        )}

        <Appear delay={0.15} className="mt-10">
          <Action
            variant="dark"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => openLeadForm({ source: "viewing", property: property.name })}
          >
            Записаться на просмотр
            <ArrowUpRight className={actionArrowClass} />
          </Action>
        </Appear>

        <div className="mt-24 grid gap-10 sm:mt-32 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Appear className="flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-12 bg-ochre-500" />
              <p className="label text-ochre-700">Характеристики</p>
            </Appear>
            <TextReveal as={level} className="mt-6 text-display-md font-medium">
              Краткая карточка <span className="accent-serif text-ochre-700">объекта</span>
            </TextReveal>
          </div>

          <Appear delay={0.1} className="lg:col-span-7 lg:col-start-6">
            <dl className="grid border-t border-graphite-950/15 sm:grid-cols-2 sm:gap-x-8">
              {property.specs.map((spec) => (
                <div key={spec.label} className="border-b border-graphite-950/15 py-5">
                  <dt className="text-sm text-graphite-500">{spec.label}</dt>
                  <dd className="mt-1 text-lg font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </Appear>
        </div>
      </div>
    </section>
  )
}
