import { ArrowUpRight } from "lucide-react"
import { Action } from "../ui/Action"
import { actionArrowClass } from "../ui/actionVariants"
import { Appear } from "../motion/Appear"
import { MediaReveal } from "../motion/MediaReveal"
import { TextReveal } from "../motion/TextReveal"
import { PropertiesMiniMap } from "./PropertiesMiniMap"
import { PROPERTIES } from "../../lib/properties"
import { useLeadForm } from "../../lib/leadFormContext"

/** Карта всех трёх БЦ и призыв подобрать офис. */
export function MapLeadSection() {
  const { openLeadForm } = useLeadForm()

  return (
    <section id="map-lead" className="bg-ivory-100 py-24 sm:py-32">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Высота задана явно: Leaflet берёт размер карты из контейнера */}
        <MediaReveal className="h-[420px] rounded-3xl bg-ivory-200 sm:h-[520px] lg:col-span-7 lg:h-[640px]">
          <PropertiesMiniMap />
        </MediaReveal>

        <div className="flex flex-col justify-center lg:col-span-4 lg:col-start-9">
          <Appear className="flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-12 bg-ochre-500" />
            <p className="label text-ochre-700">Подбор офиса</p>
          </Appear>
          <TextReveal as="h2" className="mt-6 text-display-md font-medium">
            Не знаете, какой <span className="accent-serif text-ochre-700">офис выбрать?</span>
          </TextReveal>
          <Appear as="p" delay={0.15} className="mt-6 text-lead text-graphite-600">
            Оставьте заявку — подберём подходящий бизнес-центр и формат офиса под задачи вашей
            компании.
          </Appear>

          <Appear as="ol" delay={0.2} stagger={0.06} className="mt-10 border-t border-graphite-950/10">
            {PROPERTIES.map((property, index) => (
              <li key={property.slug} className="flex gap-5 border-b border-graphite-950/10 py-4">
                <span className="numeric pt-0.5 text-sm text-ochre-700">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-medium">{property.name}</span>
                  <span className="block text-sm text-graphite-500">{property.address}</span>
                </span>
              </li>
            ))}
          </Appear>

          <Appear delay={0.3} className="mt-10">
            <Action variant="dark" size="lg" onClick={() => openLeadForm({ source: "home-select-office" })}>
              Подобрать офис
              <ArrowUpRight className={actionArrowClass} />
            </Action>
          </Appear>
        </div>
      </div>
    </section>
  )
}
