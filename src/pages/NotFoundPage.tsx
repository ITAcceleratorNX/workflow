import { Seo } from "../components/layout/Layout"
import { ActionLink } from "../components/ui/Action"
import { Appear } from "../components/motion/Appear"
import { TextReveal } from "../components/motion/TextReveal"
import { PROPERTIES } from "../lib/properties"

export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Страница не найдена | TMK WorkFlow"
        description="Такой страницы на сайте TMK WorkFlow нет. Перейдите к объектам Time Square, Venus или Koktem Towers."
        path="/404"
      />

      <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-graphite-950 py-24 text-ivory-50 lg:min-h-[calc(100svh-5rem)]">
        {/* Крупные цифры - фон страницы, читалкам экрана не нужны */}
        <p
          aria-hidden="true"
          className="numeric pointer-events-none absolute -bottom-[0.14em] right-0 select-none text-[44vw] font-medium leading-none tracking-[-0.06em] text-graphite-800 lg:text-[30vw]"
        >
          404
        </p>

        <div className="shell relative">
          <Appear play="mount" className="flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-12 bg-ochre-500" />
            <p className="label text-ochre-400">Ошибка 404</p>
          </Appear>
          <TextReveal as="h1" play="mount" delay={0.1} className="mt-6 max-w-3xl text-display-xl font-medium text-ivory-50">
            Страница <span className="accent-serif text-ochre-300">не найдена</span>
          </TextReveal>
          <Appear as="p" play="mount" delay={0.4} className="mt-6 max-w-xl text-lead text-graphite-300">
            Возможно, страница была перемещена. Выберите объект - покажем свободные площади,
            характеристики и фотографии.
          </Appear>

          <Appear play="mount" delay={0.55} stagger={0.06} className="mt-10 flex flex-wrap gap-3">
            {PROPERTIES.map((property, index) => (
              <ActionLink key={property.slug} to={property.path} variant={index === 0 ? "accent" : "glass"} size="lg">
                {property.name}
              </ActionLink>
            ))}
            <ActionLink to="/" variant="glass" size="lg">
              На главную
            </ActionLink>
          </Appear>
        </div>
      </section>
    </>
  )
}
