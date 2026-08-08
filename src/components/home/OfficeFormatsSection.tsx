import { Building2, Layers, Sparkles } from "lucide-react"
import { Section, SectionHeading } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { OFFICE_FORMATS } from "../../lib/homeContent"

const ICONS = [Building2, Sparkles, Layers]

/** Форматы офисных решений (раздел 5.2 ТЗ). */
export function OfficeFormatsSection() {
  return (
    <Section tone="white" size="md">
      <SectionHeading
        eyebrow={OFFICE_FORMATS.eyebrow}
        title={OFFICE_FORMATS.title}
        description={OFFICE_FORMATS.description}
      />

      {/* На широком экране — один ряд, на мобильном — горизонтальная прокрутка без потери текста */}
      <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
        {OFFICE_FORMATS.cards.map((card, index) => {
          const Icon = ICONS[index] ?? Building2
          return (
            <Reveal
              as="li"
              key={card.title}
              delay={index * 90}
              className="w-[85%] shrink-0 snap-start sm:w-auto"
            >
              <div className="flex h-full flex-col rounded-2xl border border-brand-100 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-card-hover sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl sm:text-2xl">{card.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{card.text}</p>
              </div>
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}
