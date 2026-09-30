import { Section, SectionHeading } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { SmartImage } from "../ui/SmartImage"
import { OFFICE_FORMATS } from "../../lib/homeContent"
import { useLocale } from "../../lib/i18n/LocaleProvider"

/**
 * Форматы офисных решений: 3 карточки с крупным фото сверху
 * (визуал по референсу office-six-virid.vercel.app).
 */
export function OfficeFormatsSection() {
  const { t } = useLocale()

  return (
    <Section tone="brand" size="lg" id="formats">
      <SectionHeading
        eyebrow={t.formats.eyebrow}
        title={t.formats.title}
        description={t.formats.description}
      />

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {t.formats.cards.map((card, index) => {
          const image = OFFICE_FORMATS.cards[index]?.image ?? ""
          return (
            <Reveal as="li" key={card.title} delay={index * 90} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="relative aspect-[16/11] shrink-0 overflow-hidden">
                  <SmartImage
                    src={image}
                    alt={card.imageAlt}
                    placeholderLabel={card.title}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col px-6 py-6 sm:px-7 sm:py-7">
                  <h3 className="text-xl font-bold text-brand-900 sm:text-2xl">{card.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-muted sm:text-base">
                    {card.text}
                  </p>
                </div>
              </article>
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}
