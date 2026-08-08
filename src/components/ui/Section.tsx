import type { ReactNode } from "react"
import { cn } from "../../lib/utils"
import { Reveal } from "./Reveal"

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  /** Голубой фон для визуального разделения секций */
  tone?: "white" | "brand" | "deep"
  size?: "sm" | "md" | "lg"
}

const toneClasses = {
  white: "bg-white",
  brand: "bg-brand-50",
  deep: "bg-brand-900 text-white",
} as const

const sizeClasses = {
  sm: "py-10 sm:py-14",
  md: "py-14 sm:py-20",
  lg: "py-16 sm:py-24",
} as const

export function Section({ id, children, className, tone = "white", size = "md" }: SectionProps) {
  return (
    <section id={id} className={cn(toneClasses[tone], sizeClasses[size], className)}>
      <div className="container-site">{children}</div>
    </section>
  )
}

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  level?: "h1" | "h2" | "h3"
  align?: "left" | "center"
  inverted?: boolean
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  level = "h2",
  align = "left",
  inverted = false,
  className,
}: SectionHeadingProps) {
  const Title = level

  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow", inverted && "text-brand-300")}>{eyebrow}</p>
      )}
      <Title
        className={cn(
          "mt-3 text-3xl leading-[1.15] sm:text-4xl lg:text-[42px]",
          inverted && "text-white"
        )}
      >
        {title}
      </Title>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-ink-muted sm:text-lg",
            inverted && "text-brand-100"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  )
}
