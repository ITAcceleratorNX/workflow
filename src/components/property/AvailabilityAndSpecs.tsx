import { useState } from "react"
import { ArrowRight, Images, LayoutGrid } from "lucide-react"
import { Button } from "../ui/button"
import { Section } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { Lightbox } from "../ui/Lightbox"
import { useLeadForm } from "../../lib/leadFormContext"
import { useLocale } from "../../lib/i18n/LocaleProvider"
import type { Property, PropertyPhoto } from "../../lib/properties"

/**
 * «Свободно к аренде» и «Характеристики».
 *
 * Карточка площади: слева фото помещения (открывает его фотографии), рядом крупно
 * площадь и ставка, ниже — этаж / состав. Ставка всегда с пометкой «без НДС»:
 * страницы принимают платный трафик, и цена без налоговой оговорки вводит в заблуждение.
 */
export function AvailabilityAndSpecs({
  property,
  level: Heading,
}: {
  property: Property
  level: "h2" | "h3"
}) {
  const { openLeadForm } = useLeadForm()
  const { t } = useLocale()
  /** Фотографии помещения, открытые в Lightbox */
  const [viewer, setViewer] = useState<{ photos: PropertyPhoto[]; index: number } | null>(null)

  const book = (area: string) => openLeadForm({ source: "viewing", property: property.name, area })

  /* Подписи берём из галереи объекта: фото помещений — те же файлы */
  const toPhotos = (sources: string[], fallbackAlt: string): PropertyPhoto[] =>
    sources.map(
      (src) =>
        property.photos.find((photo) => photo.src === src) ?? {
          src,
          alt: fallbackAlt,
          category: "offices",
        }
    )

  const rateLabel = (rate: string, from?: boolean) =>
    from ? t.home.rateFrom.replace("{value}", rate) : rate

  return (
    <Section tone="brand" size="md">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <Reveal>
            <p className="eyebrow">{t.property.availabilityEyebrow}</p>
            <Heading className="mt-3 text-2xl sm:text-3xl">{t.property.availabilityTitle}</Heading>
          </Reveal>

          <ul className="mt-6 space-y-3">
            {property.availability.map((item, index) => {
              const photos = item.photos ?? []
              return (
                <Reveal as="li" key={`${item.area}-${index}`} delay={index * 70}>
                  {/*
                    Вся карточка — запись на просмотр: кнопка «Записаться» растянута на карточку
                    через after:inset-0. Миниатюра — отдельная кнопка поверх (z-10), не вложенная.
                  */}
                  <div className="group/card relative flex items-stretch gap-4 rounded-2xl border border-brand-100 bg-white p-3 shadow-card transition hover:border-orange-300 hover:shadow-card-hover sm:gap-5 sm:p-4">
                    {photos.length > 0 ? (
                      <button
                        type="button"
                        aria-label={t.property.openPhotosAria.replace("{area}", item.area)}
                        onClick={() =>
                          setViewer({ photos: toPhotos(photos, `${property.name}, ${item.area}`), index: 0 })
                        }
                        className="group/photo relative z-10 w-24 shrink-0 self-stretch overflow-hidden rounded-xl bg-brand-100 transition hover:ring-2 hover:ring-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:w-36"
                      >
                        <img
                          src={photos[0]}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover/photo:scale-105"
                        />
                        <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-full bg-brand-900/80 px-2 py-0.5 text-xs font-semibold text-white transition group-hover/photo:bg-orange-500">
                          <Images className="h-3.5 w-3.5" />
                          {photos.length}
                        </span>
                      </button>
                    ) : (
                      <div
                        aria-hidden
                        className="flex w-24 shrink-0 items-center justify-center self-stretch rounded-xl bg-brand-50 text-brand-300 sm:w-36"
                      >
                        <LayoutGrid className="h-7 w-7" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1 py-1">
                      <p className="text-sm text-ink-soft first-letter:uppercase">{item.note}</p>
                      {/* Площадь и ставка в одной строке: арендатор сверяет их вместе */}
                      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                        <p className="whitespace-nowrap text-2xl font-bold text-brand-900 sm:text-[28px]">
                          {item.area}
                        </p>
                        <p className="whitespace-nowrap text-base font-semibold text-orange-600 sm:text-lg">
                          {rateLabel(item.rate, item.rateFrom)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => book(item.area)}
                        aria-label={t.property.selectAreaAria.replace("{area}", item.area)}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange-600 after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-orange-500"
                      >
                        {t.common.bookViewing}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/card:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </ul>

          {property.rateTiers && (
            <Reveal delay={120}>
              <div className="mt-4 rounded-2xl border border-brand-200 bg-white p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
                  {t.property.ratesTitle}
                </p>
                <dl className="mt-2 divide-y divide-brand-100">
                  {property.rateTiers.map((tier) => (
                    <div
                      key={tier.rate}
                      className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    >
                      <dt className="text-sm text-ink-muted first-letter:uppercase">{tier.note}</dt>
                      <dd className="whitespace-nowrap text-[15px] font-semibold text-orange-600">
                        {tier.rate}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          )}

          {property.splitNote && (
            <Reveal delay={130}>
              <p className="mt-4 text-[15px] font-semibold text-brand-800">{property.splitNote}</p>
            </Reveal>
          )}

          <Reveal delay={140}>
            <Button
              size="lg"
              className="mt-6 w-full sm:w-auto"
              onClick={() => openLeadForm({ source: "viewing", property: property.name })}
            >
              {t.common.bookViewing}
            </Button>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <p className="eyebrow">{t.property.specsEyebrow}</p>
            <Heading className="mt-3 text-2xl sm:text-3xl">{t.property.specsTitle}</Heading>
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

      {viewer && (
        <Lightbox
          photos={viewer.photos}
          index={viewer.index}
          onClose={() => setViewer(null)}
          onNavigate={(index) => setViewer({ photos: viewer.photos, index })}
        />
      )}
    </Section>
  )
}
