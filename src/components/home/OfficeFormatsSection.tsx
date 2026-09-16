import { SectionTitle } from "../ui/SectionTitle"
import { SmartImage } from "../ui/SmartImage"
import { Appear } from "../motion/Appear"
import { MediaReveal } from "../motion/MediaReveal"
import { OFFICE_FORMATS } from "../../lib/homeContent"
import { cn } from "../../lib/utils"

/* Смещение карточек на широком экране — журнальный ритм вместо ровной сетки */
const CARD_OFFSET = ["", "lg:mt-24", "lg:mt-12"]

/** Форматы офисных решений: три карточки с крупным фото и номером. */
export function OfficeFormatsSection() {
  return (
    <section id="formats" className="bg-ivory-50 py-24 sm:py-32">
      <div className="shell">
        <SectionTitle
          label={OFFICE_FORMATS.eyebrow}
          title={
            <>
              {OFFICE_FORMATS.title}{" "}
              <span className="accent-serif text-ochre-700">{OFFICE_FORMATS.titleAccent}</span>
            </>
          }
          description={OFFICE_FORMATS.description}
        />

        <ul className="mt-16 grid gap-x-6 gap-y-14 sm:mt-24 sm:grid-cols-2 lg:grid-cols-3">
          {OFFICE_FORMATS.cards.map((card, index) => (
            <li key={card.title} className={cn("group", CARD_OFFSET[index])}>
              <MediaReveal delay={index * 0.1} className="aspect-[4/3] rounded-3xl bg-ivory-200">
                <SmartImage
                  src={card.image}
                  alt={card.imageAlt}
                  placeholderLabel={card.title}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="transition-transform duration-1200 ease-out-expo group-hover:scale-105"
                />
              </MediaReveal>

              <Appear delay={0.2 + index * 0.1} className="mt-6 flex gap-5">
                <span className="numeric pt-1.5 text-sm text-ochre-700">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-title font-medium">{card.title}</h3>
                  <p className="mt-3 max-w-sm text-graphite-600">{card.text}</p>
                </div>
              </Appear>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
