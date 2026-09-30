import { Link } from "react-router-dom"
import { Seo } from "../components/layout/Layout"
import { Section } from "../components/ui/Section"
import { buttonVariants } from "../components/ui/buttonVariants"
import { cn } from "../lib/utils"
import { PROPERTIES } from "../lib/properties"
import { useLocale } from "../lib/i18n/LocaleProvider"

export function NotFoundPage() {
  const { t } = useLocale()

  return (
    <>
      <Seo
        title={`${t.notFound.title} | TMK WorkFlow`}
        description={t.notFound.description}
        path="/404"
      />

      <Section tone="white" size="lg">
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow">404</p>
          <h1 className="mt-3 text-3xl sm:text-4xl">{t.notFound.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">{t.notFound.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
              {t.notFound.home}
            </Link>
            {PROPERTIES.map((property) => (
              <Link
                key={property.slug}
                to={property.path}
                className={cn(buttonVariants({ variant: "outline", size: "md" }))}
              >
                {property.name}
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
