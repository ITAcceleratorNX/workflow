import type { ReactNode } from "react"
import { Appear } from "../motion/Appear"
import { TextReveal } from "../motion/TextReveal"
import { cn } from "../../lib/utils"

interface SectionTitleProps {
  label: string
  /** Заголовок; акцентное слово - <span className="accent-serif">…</span> */
  title: ReactNode
  description?: ReactNode
  as?: "h2" | "h3"
  /** light - секция светлая (тёмный текст), dark - секция тёмная */
  tone?: "light" | "dark"
  className?: string
}

/**
 * Заголовок секции редизайна: метка с охристой линией и крупный заголовок слева,
 * описание - справа на широком экране и под заголовком на телефоне.
 */
export function SectionTitle({
  label,
  title,
  description,
  as = "h2",
  tone = "light",
  className,
}: SectionTitleProps) {
  const dark = tone === "dark"

  return (
    <div className={cn("grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8", className)}>
      <div className="lg:col-span-7">
        <Appear className="flex items-center gap-4">
          <span aria-hidden="true" className="h-px w-12 bg-ochre-500" />
          <p className={cn("label", dark ? "text-ochre-400" : "text-ochre-700")}>{label}</p>
        </Appear>
        <TextReveal
          as={as}
          className={cn("mt-6 text-display-lg font-medium", dark ? "text-ivory-50" : "text-graphite-950")}
        >
          {title}
        </TextReveal>
      </div>

      {description && (
        <Appear
          as="p"
          delay={0.15}
          className={cn(
            "max-w-xl text-lead lg:col-span-4 lg:col-start-9",
            dark ? "text-graphite-300" : "text-graphite-600"
          )}
        >
          {description}
        </Appear>
      )}
    </div>
  )
}
