import { Handshake, Network, TrendingUp } from "lucide-react"
import { Appear } from "../motion/Appear"
import { TextReveal } from "../motion/TextReveal"
import { ECOSYSTEM } from "../../lib/properties"

const ACCENTS = [Network, Handshake, TrendingUp]

/* «TMK WorkFlow - больше, чем аренда»: вторую часть заголовка выделяем курсивом */
const [TITLE_LEAD, TITLE_ACCENT] = ECOSYSTEM.title.split(" - ")

/**
 * Выделенный блок об экосистеме TMK (раздел 5.6 ТЗ).
 * Присутствует на страницах всех трёх объектов.
 */
export function EcosystemBlock({ level }: { level: "h2" | "h3" }) {
  return (
    <section className="bg-graphite-950 py-24 text-ivory-50 sm:py-32">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Appear className="flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-12 bg-ochre-500" />
            <p className="label text-ochre-400">Экосистема TMK</p>
          </Appear>
          <TextReveal as={level} className="mt-6 text-display-lg font-medium text-ivory-50">
            {TITLE_ACCENT ? (
              <>
                {TITLE_LEAD} - <span className="accent-serif text-ochre-300">{TITLE_ACCENT}</span>
              </>
            ) : (
              ECOSYSTEM.title
            )}
          </TextReveal>
          <Appear delay={0.2} stagger={0.08} className="mt-10 flex gap-3">
            {ACCENTS.map((Icon, index) => (
              <span
                key={index}
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-ochre-400"
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
            ))}
          </Appear>
        </div>

        <div className="space-y-6 lg:col-span-6 lg:col-start-7">
          {ECOSYSTEM.paragraphs.map((paragraph, index) => (
            <Appear
              as="p"
              key={index}
              delay={0.1 + index * 0.05}
              className={index === 0 ? "text-lead text-ivory-100" : "text-lead text-graphite-300"}
            >
              {paragraph}
            </Appear>
          ))}
        </div>
      </div>
    </section>
  )
}
