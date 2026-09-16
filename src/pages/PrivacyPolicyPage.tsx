import type { ReactNode } from "react"
import { Seo } from "../components/layout/Layout"
import { Appear } from "../components/motion/Appear"
import { TextReveal } from "../components/motion/TextReveal"
import { CONTACTS, SITE_URL } from "../lib/site"
import { useScrollToElement } from "../lib/smoothScroll"

function EmailLink() {
  return (
    <a
      href={`mailto:${CONTACTS.email}`}
      className="font-medium text-graphite-950 underline underline-offset-4 transition-colors hover:text-ochre-700"
    >
      {CONTACTS.email}
    </a>
  )
}

/*
 * TODO (заказчику): подставить полные реквизиты оператора персональных данных -
 * наименование юридического лица, БИН и юридический адрес - в блок «Оператор».
 */
const SECTIONS: { title: string; body: ReactNode }[] = [
  {
    title: "Оператор",
    body: (
      <p>
        Оператором персональных данных выступает TMK WorkFlow - владелец сайта tmk-workflow.kz.
        Вопросы по обработке данных направляйте на <EmailLink />.
      </p>
    ),
  },
  {
    title: "Какие данные собираются",
    body: (
      <>
        <p>
          Через формы на сайте пользователь передаёт: имя, номер телефона, а также по своему
          усмотрению - название компании, адрес электронной почты и комментарий к заявке. Вместе с
          заявкой передаётся служебная информация: выбранный объект, страница и источник формы.
        </p>
        <p>
          Дополнительно могут обрабатываться обезличенные данные веб-аналитики: тип устройства,
          браузер, источник перехода, действия на странице.
        </p>
      </>
    ),
  },
  {
    title: "Цели обработки",
    body: (
      <ul className="list-disc space-y-2 pl-5 marker:text-ochre-700">
        <li>Обработка заявки и обратная связь по вопросам аренды помещений.</li>
        <li>Согласование просмотра объекта и подготовка коммерческого предложения.</li>
        <li>Улучшение работы сайта на основе обезличенной статистики.</li>
      </ul>
    ),
  },
  {
    title: "Правовое основание",
    body: (
      <p>
        Обработка производится на основании согласия пользователя, которое он даёт, отмечая
        соответствующий чекбокс при отправке формы, в соответствии с законодательством Республики
        Казахстан о персональных данных и их защите.
      </p>
    ),
  },
  {
    title: "Передача третьим лицам",
    body: (
      <p>
        Персональные данные не продаются и не передаются третьим лицам, за исключением поставщиков
        технической инфраструктуры (хостинг, сервис доставки электронной почты, системы
        веб-аналитики), действующих по поручению оператора, а также случаев, предусмотренных
        законодательством.
      </p>
    ),
  },
  {
    title: "Срок хранения и отзыв согласия",
    body: (
      <p>
        Данные хранятся до достижения целей обработки либо до отзыва согласия. Чтобы отозвать
        согласие или запросить удаление данных, отправьте письмо на <EmailLink />. Запрос
        обрабатывается в сроки, установленные законодательством.
      </p>
    ),
  },
  {
    title: "Файлы cookie",
    body: (
      <p>
        Сайт использует технические файлы cookie, необходимые для его работы, и, при подключении
        соответствующих сервисов, аналитические cookie. Отключить их можно в настройках браузера -
        часть функций сайта при этом может работать некорректно.
      </p>
    ),
  },
  {
    title: "Изменения политики",
    body: (
      <p>
        Оператор вправе обновлять эту политику. Актуальная редакция всегда доступна по адресу{" "}
        {SITE_URL}/privacy.
      </p>
    ),
  },
]

const sectionId = (index: number) => `privacy-${index + 1}`

export function PrivacyPolicyPage() {
  const scrollToElement = useScrollToElement()

  return (
    <>
      <Seo
        title="Политика конфиденциальности | TMK WorkFlow"
        description="Политика обработки персональных данных пользователей сайта TMK WorkFlow: какие данные собираются через формы заявок, зачем и как их удалить."
        path="/privacy"
      />

      <section className="bg-ivory-100 pb-16 pt-20 sm:pb-24 sm:pt-28">
        <div className="shell">
          <Appear play="mount" className="flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-12 bg-ochre-500" />
            <p className="label text-ochre-700">Правовая информация</p>
          </Appear>
          <TextReveal as="h1" play="mount" delay={0.1} className="mt-6 max-w-4xl text-display-lg font-medium">
            Политика <span className="accent-serif text-ochre-700">конфиденциальности</span>
          </TextReveal>
          <Appear as="p" play="mount" delay={0.35} className="mt-6 max-w-3xl text-lead text-graphite-600">
            Политика описывает, какие персональные данные собирает сайт {SITE_URL.replace("https://", "")},
            с какой целью они обрабатываются и как пользователь может отозвать согласие.
          </Appear>
        </div>
      </section>

      <section className="bg-ivory-50 py-16 sm:py-24">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
          <nav aria-label="Разделы политики" className="hidden lg:col-span-3 lg:block">
            <ol className="sticky top-28 border-l border-graphite-950/10">
              {SECTIONS.map((section, index) => (
                <li key={section.title}>
                  <button
                    type="button"
                    onClick={() => scrollToElement(document.getElementById(sectionId(index)))}
                    className="-ml-px block border-l border-transparent py-2 pl-5 text-left text-sm text-graphite-500 transition-colors duration-400 hover:border-ochre-500 hover:text-graphite-950"
                  >
                    {index + 1}. {section.title}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-3xl space-y-12 lg:col-span-8 lg:col-start-5">
            {SECTIONS.map((section, index) => (
              <section
                key={section.title}
                id={sectionId(index)}
                className="scroll-mt-28 border-t border-graphite-950/10 pt-8"
              >
                <h2 className="flex items-baseline gap-4 text-title font-medium">
                  <span className="numeric text-base text-ochre-700">{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-graphite-600">{section.body}</div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
