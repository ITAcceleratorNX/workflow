import { Link } from "react-router-dom"
import { Seo } from "../components/layout/Layout"
import { Section } from "../components/ui/Section"
import { buttonVariants } from "../components/ui/buttonVariants"
import { cn } from "../lib/utils"
import { PROPERTIES } from "../lib/properties"

export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Страница не найдена | TMK WorkFlow"
        description="Такой страницы на сайте TMK WorkFlow нет. Перейдите к объектам Time Square, Venus или Koktem Towers."
        path="/404"
      />

      <Section tone="white" size="lg">
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow">Ошибка 404</p>
          <h1 className="mt-3 text-3xl sm:text-4xl">Страница не найдена</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            Возможно, страница была перемещена. Выберите объект — покажем свободные площади,
            характеристики и фотографии.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {PROPERTIES.map((property, index) => (
              <Link
                key={property.slug}
                to={property.path}
                className={cn(
                  buttonVariants({ variant: index === 0 ? "primary" : "outline", size: "md" })
                )}
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
