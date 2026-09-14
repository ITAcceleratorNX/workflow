import { ArrowRight } from "lucide-react"
import { Section } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { Button } from "../ui/button"
import { PropertiesMiniMap } from "./PropertiesMiniMap"
import { useLeadForm } from "../../lib/leadFormContext"

/** Блок «карта + заявка» на главной: слева все 3 БЦ, справа CTA формы. */
export function MapLeadSection() {
  const { openLeadForm } = useLeadForm()

  return (
    <Section tone="brand" size="lg" id="map-lead">
      <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        <Reveal className="min-h-[320px] lg:min-h-0">
          <PropertiesMiniMap />
        </Reveal>

        <Reveal delay={100} className="flex flex-col justify-center">
          <p className="eyebrow">Подбор офиса</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Не знаете, какой офис выбрать?</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
            Оставьте заявку — подберём подходящий бизнес-центр и формат офиса под задачи вашей
            компании.
          </p>
          <Button
            size="lg"
            className="mt-8 w-full sm:w-auto"
            onClick={() => openLeadForm({ source: "home-select-office" })}
          >
            Подобрать офис
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Reveal>
      </div>
    </Section>
  )
}
