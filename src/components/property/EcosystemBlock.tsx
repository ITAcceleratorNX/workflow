import { Handshake, Network, TrendingUp } from "lucide-react"
import { Section } from "../ui/Section"
import { Reveal } from "../ui/Reveal"
import { ECOSYSTEM } from "../../lib/properties"

const ACCENTS = [Network, Handshake, TrendingUp]

/**
 * Выделенный блок об экосистеме TMK (раздел 5.6 ТЗ).
 * Присутствует на страницах всех трёх объектов.
 */
export function EcosystemBlock({ level: Heading }: { level: "h2" | "h3" }) {
  return (
    <Section tone="deep" size="lg">
      <Reveal className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          {ACCENTS.map((Icon, index) => (
            <span
              key={index}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400"
            >
              <Icon className="h-5 w-5" />
            </span>
          ))}
        </div>

        <Heading className="mt-6 text-3xl text-white sm:text-4xl lg:text-[42px]">
          {ECOSYSTEM.title}
        </Heading>

        <div className="mt-6 space-y-5">
          {ECOSYSTEM.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? "text-base leading-relaxed text-brand-100 sm:text-lg"
                  : "text-base leading-relaxed text-brand-200"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
