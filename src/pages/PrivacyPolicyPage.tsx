import { Seo } from "../components/layout/Layout"
import { Section } from "../components/ui/Section"
import { CONTACTS, SITE_URL } from "../lib/site"

/*
 * TODO (заказчику): подставить полные реквизиты оператора персональных данных —
 * наименование юридического лица, БИН и юридический адрес — в блок «Оператор».
 */
export function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Политика конфиденциальности | TMK WorkFlow"
        description="Политика обработки персональных данных пользователей сайта TMK WorkFlow: какие данные собираются через формы заявок, зачем и как их удалить."
        path="/privacy"
      />

      <Section tone="brand" size="md">
        <p className="eyebrow">Правовая информация</p>
        <h1 className="mt-3 text-3xl sm:text-4xl lg:text-[42px]">
          Политика конфиденциальности
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted">
          Политика описывает, какие персональные данные собирает сайт {SITE_URL.replace("https://", "")},
          с какой целью они обрабатываются и как пользователь может отозвать согласие.
        </p>
      </Section>

      <Section tone="white" size="md">
        <div className="max-w-3xl space-y-8 text-[15px] leading-relaxed text-ink-muted">
          <section>
            <h2 className="text-xl sm:text-2xl">1. Оператор</h2>
            <p className="mt-3">
              Оператором персональных данных выступает TMK WorkFlow — владелец сайта
              tmk-workflow.kz. Вопросы по обработке данных направляйте на{" "}
              <a
                href={`mailto:${CONTACTS.email}`}
                className="font-medium text-brand-700 underline underline-offset-2 hover:text-orange-600"
              >
                {CONTACTS.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl">2. Какие данные собираются</h2>
            <p className="mt-3">
              Через формы на сайте пользователь передаёт: имя, номер телефона, а также по своему
              усмотрению — название компании, адрес электронной почты и комментарий к заявке.
              Вместе с заявкой передаётся служебная информация: выбранный объект, страница и
              источник формы.
            </p>
            <p className="mt-3">
              Дополнительно могут обрабатываться обезличенные данные веб-аналитики: тип устройства,
              браузер, источник перехода, действия на странице.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl">3. Цели обработки</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Обработка заявки и обратная связь по вопросам аренды помещений.</li>
              <li>Согласование просмотра объекта и подготовка коммерческого предложения.</li>
              <li>Улучшение работы сайта на основе обезличенной статистики.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl">4. Правовое основание</h2>
            <p className="mt-3">
              Обработка производится на основании согласия пользователя, которое он даёт, отмечая
              соответствующий чекбокс при отправке формы, в соответствии с законодательством
              Республики Казахстан о персональных данных и их защите.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl">5. Передача третьим лицам</h2>
            <p className="mt-3">
              Персональные данные не продаются и не передаются третьим лицам, за исключением
              поставщиков технической инфраструктуры (хостинг, сервис доставки электронной почты,
              системы веб-аналитики), действующих по поручению оператора, а также случаев,
              предусмотренных законодательством.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl">6. Срок хранения и отзыв согласия</h2>
            <p className="mt-3">
              Данные хранятся до достижения целей обработки либо до отзыва согласия. Чтобы отозвать
              согласие или запросить удаление данных, отправьте письмо на{" "}
              <a
                href={`mailto:${CONTACTS.email}`}
                className="font-medium text-brand-700 underline underline-offset-2 hover:text-orange-600"
              >
                {CONTACTS.email}
              </a>
              . Запрос обрабатывается в сроки, установленные законодательством.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl">7. Файлы cookie</h2>
            <p className="mt-3">
              Сайт использует технические файлы cookie, необходимые для его работы, и,
              при подключении соответствующих сервисов, аналитические cookie. Отключить их можно в
              настройках браузера — часть функций сайта при этом может работать некорректно.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl">8. Изменения политики</h2>
            <p className="mt-3">
              Оператор вправе обновлять эту политику. Актуальная редакция всегда доступна по адресу{" "}
              {SITE_URL}/privacy.
            </p>
          </section>
        </div>
      </Section>
    </>
  )
}
