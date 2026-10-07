import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Section, SectionHeading } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { Button } from "../ui/button"
import type { Property } from "../../lib/properties"
import { useLeadForm } from "../../lib/leadFormContext"
import { useLocale } from "../../lib/i18n/LocaleProvider"
import { getLocalizedProperties } from "../../lib/i18n/content"
import type { Messages } from "../../lib/i18n/messages"

/** «19 000 ₸/м²/мес без НДС» → 19000; «1 700 м²» → 1700 */
const leadingNumber = (value: string) => Number(value.replace(/\s/g, "").match(/^\d+/)?.[0] ?? 0)

/**
 * Одна строка на БЦ: минимальная площадь и минимальная ставка из availability объекта —
 * тех же данных, что на его странице.
 */
function summarize(property: Property, t: Messages["home"]) {
  const lots = property.availability
  const smallest = lots.reduce((a, b) => (leadingNumber(b.area) < leadingNumber(a.area) ? b : a))
  const cheapest = lots.reduce((a, b) => (leadingNumber(b.rate) < leadingNumber(a.rate) ? b : a))
  const [rateAmount, rateUnit = ""] = cheapest.rate.split(" ₸")
  const sameRate = lots.every((lot) => lot.rate === cheapest.rate)
  const amount = `${rateAmount} ₸`

  return {
    area: lots.length > 1 ? t.areaFrom.replace("{value}", smallest.area) : smallest.area,
    rate: sameRate && !cheapest.rateFrom ? amount : t.rateFrom.replace("{value}", amount),
    rateUnit: t.ratePer.replace("{unit}", rateUnit.replace(/^\//, "")),
    /** Если вариант один — сразу подставляем площадь в заявку */
    leadArea: lots.length === 1 ? smallest.area : undefined,
  }
}

export function AvailabilityTableSection() {
  const { openLeadForm } = useLeadForm()
  const { locale, t } = useLocale()
  const columns = t.home.availabilityColumns
  const rows = getLocalizedProperties(locale).map((property) => ({
    property,
    ...summarize(property, t.home),
  }))

  const book = (property: string, area?: string) => openLeadForm({ source: "viewing", property, area })

  return (
    <Section tone="white" size="lg" id="availability">
      <SectionHeading eyebrow={t.home.availabilityEyebrow} title={t.home.availabilityTitle} />

      <Reveal className="mt-10">
        {/* Десктоп: таблица */}
        <div className="hidden overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-card lg:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-100 bg-brand-50/50 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
                <th scope="col" className="px-8 py-4 font-semibold">{columns.property}</th>
                <th scope="col" className="px-6 py-4 font-semibold">{columns.floor}</th>
                <th scope="col" className="px-6 py-4 font-semibold">{columns.area}</th>
                <th scope="col" className="px-6 py-4 font-semibold">{columns.rate}</th>
                <th scope="col" className="px-8 py-4">
                  <span className="sr-only">{columns.action}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {rows.map(({ property, area, rate, rateUnit, leadArea }) => (
                <tr key={property.slug} className="group transition-colors hover:bg-brand-50/60">
                  <th scope="row" className="px-8 py-6 font-normal">
                    <Link
                      to={property.path}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap text-lg font-bold text-brand-900 transition-colors hover:text-orange-600"
                    >
                      {property.name}
                      <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                    <p className="mt-0.5 text-sm text-ink-soft">{property.shortLabel}</p>
                  </th>
                  <td className="max-w-[260px] px-6 py-6 text-[15px] text-ink-muted">
                    {property.availabilitySummary}
                  </td>
                  <td className="px-6 py-6">
                    <p className="whitespace-nowrap text-xl font-bold text-brand-900">{area}</p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="whitespace-nowrap text-lg font-bold text-orange-600">{rate}</p>
                    <p className="mt-0.5 whitespace-nowrap text-sm text-ink-soft">{rateUnit}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button onClick={() => book(property.name, leadArea)}>{t.home.book}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Мобильные и планшеты: карточки */}
        <div className="grid gap-4 md:grid-cols-3 lg:hidden">
          {rows.map(({ property, area, rate, rateUnit, leadArea }) => (
            <div
              key={property.slug}
              className="flex flex-col rounded-3xl border border-brand-100 bg-white p-5 shadow-card"
            >
              <Link to={property.path} className="text-lg font-bold text-brand-900">
                {property.name}
              </Link>
              <p className="mt-0.5 text-sm text-ink-soft">{property.availabilitySummary}</p>

              {/* Площадь и ставка — отдельными строками: в две колонки длинные значения слипались */}
              <dl className="mt-4 flex-1 divide-y divide-brand-100 border-t border-brand-100">
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="shrink-0 text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                    {columns.area}
                  </dt>
                  <dd className="text-right text-lg font-bold text-brand-900">{area}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="shrink-0 text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                    {columns.rate}
                  </dt>
                  <dd className="text-right">
                    <span className="block text-lg font-bold text-orange-600">{rate}</span>
                    <span className="block text-xs text-ink-soft">{rateUnit}</span>
                  </dd>
                </div>
              </dl>

              <Button className="mt-2 w-full" onClick={() => book(property.name, leadArea)}>
                {t.home.book}
              </Button>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
