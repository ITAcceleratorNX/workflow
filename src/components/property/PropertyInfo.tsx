import { MapPin } from "lucide-react"
import { Appear } from "../motion/Appear"
import { TextReveal } from "../motion/TextReveal"
import type { Property } from "../../lib/properties"

/** Информация об объекте (разделы 5.5 / 6.2 / 7.2 ТЗ): описание и карточка с адресом. */
export function PropertyInfo({
  property,
  level,
}: {
  property: Property
  level: "h2" | "h3"
}) {
  return (
    <section className="bg-ivory-50 py-24 sm:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Appear className="flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-12 bg-ochre-500" />
            <p className="label text-ochre-700">Об объекте</p>
          </Appear>
          <TextReveal as={level} className="mt-6 text-display-lg font-medium">
            {property.name}
          </TextReveal>

          <div className="mt-10 space-y-6">
            {property.description.map((paragraph, index) => (
              <Appear
                as="p"
                key={index}
                delay={0.1 + index * 0.05}
                className={index === 0 ? "text-title text-graphite-950" : "text-lead text-graphite-600"}
              >
                {paragraph}
              </Appear>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <Appear delay={0.2} className="rounded-3xl bg-ivory-100 p-6 sm:p-8 lg:sticky lg:top-28">
            <p className="label text-ochre-700">Адрес</p>
            <p className="mt-3 flex items-start gap-2 font-medium">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-ochre-700" />
              {property.address}
            </p>
            <dl className="mt-8 divide-y divide-graphite-950/10 border-t border-graphite-950/10">
              {property.specs.slice(0, 4).map((spec) => (
                <div key={spec.label} className="py-4">
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
