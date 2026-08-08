import { Button } from "../ui/button"
import { Section } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { SmartImage } from "../ui/SmartImage"
import { SERVICED_OFFICE } from "../../lib/homeContent"
import { useLeadForm } from "../../lib/leadFormContext"

/** Краткий блок «Сервисный офис» (раздел 5.3 ТЗ): одна фотография и одна основная кнопка. */
export function ServicedOfficeSection() {
  const { openLeadForm } = useLeadForm()

  return (
    <Section tone="brand" size="md">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-card">
            <SmartImage
              src={SERVICED_OFFICE.image}
              alt={SERVICED_OFFICE.imageAlt}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Reveal>

        <Reveal delay={110}>
          <h2 className="text-3xl sm:text-4xl">{SERVICED_OFFICE.title}</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {SERVICED_OFFICE.text}
          </p>
          <Button
            size="lg"
            className="mt-8 w-full sm:w-auto"
            onClick={() => openLeadForm({ source: "serviced-office" })}
          >
            {SERVICED_OFFICE.cta}
          </Button>
        </Reveal>
      </div>
    </Section>
  )
}
