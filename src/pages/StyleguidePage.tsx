import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { ArrowUpRight, Phone } from "lucide-react"
import { Action } from "../components/ui/Action"
import { actionArrowClass } from "../components/ui/actionVariants"
import { Appear } from "../components/motion/Appear"
import { MediaReveal } from "../components/motion/MediaReveal"
import { Parallax } from "../components/motion/Parallax"
import { TextReveal } from "../components/motion/TextReveal"
import { gsap, useGSAP } from "../lib/motion"
import { PROPERTIES } from "../lib/properties"
import { cn } from "../lib/utils"

/**
 * Витрина дизайн-системы редизайна (только в режиме разработки, маршрут /styleguide).
 *
 * HEX и контраст не записаны вручную, а считываются с отрисованных элементов:
 * витрина всегда показывает то, что реально лежит в tailwind.config.js.
 */

/* Классы перечислены целиком — иначе Tailwind не найдёт их в исходнике и не сгенерирует */
const PALETTE = [
  {
    name: "Графит",
    role: "Тёмные сцены: интро, hero, подвал. Основной цвет текста.",
    swatches: [
      ["graphite-50", "bg-graphite-50"],
      ["graphite-100", "bg-graphite-100"],
      ["graphite-200", "bg-graphite-200"],
      ["graphite-300", "bg-graphite-300"],
      ["graphite-400", "bg-graphite-400"],
      ["graphite-500", "bg-graphite-500"],
      ["graphite-600", "bg-graphite-600"],
      ["graphite-700", "bg-graphite-700"],
      ["graphite-800", "bg-graphite-800"],
      ["graphite-900", "bg-graphite-900"],
      ["graphite-950", "bg-graphite-950"],
    ],
  },
  {
    name: "Слоновая кость",
    role: "Светлые фоны секций и текст на тёмном.",
    swatches: [
      ["ivory-50", "bg-ivory-50"],
      ["ivory-100", "bg-ivory-100"],
      ["ivory-200", "bg-ivory-200"],
      ["ivory-300", "bg-ivory-300"],
      ["ivory-400", "bg-ivory-400"],
    ],
  },
  {
    name: "Охра",
    role: "Единственный яркий акцент: главная кнопка, тонкие линии, метки.",
    swatches: [
      ["ochre-300", "bg-ochre-300"],
      ["ochre-400", "bg-ochre-400"],
      ["ochre-500", "bg-ochre-500"],
      ["ochre-600", "bg-ochre-600"],
      ["ochre-700", "bg-ochre-700"],
    ],
  },
  {
    name: "Хвоя",
    role: "Вторая глубокая поверхность для тёмных секций.",
    swatches: [
      ["pine-500", "bg-pine-500"],
      ["pine-700", "bg-pine-700"],
      ["pine-800", "bg-pine-800"],
      ["pine-900", "bg-pine-900"],
    ],
  },
] as const

const CONTRAST_PAIRS = [
  { usage: "Основной текст на светлом", className: "bg-ivory-50 text-graphite-950" },
  { usage: "Вторичный текст на светлом", className: "bg-ivory-50 text-graphite-500" },
  { usage: "Охра текстом на светлом", className: "bg-ivory-50 text-ochre-700" },
  { usage: "Основной текст на тёмном", className: "bg-graphite-950 text-ivory-50" },
  { usage: "Вторичный текст на тёмном", className: "bg-graphite-950 text-graphite-400" },
  { usage: "Охра на тёмном", className: "bg-graphite-950 text-ochre-500" },
  { usage: "Текст на охристой кнопке", className: "bg-ochre-500 text-graphite-950" },
  { usage: "Текст на хвое", className: "bg-pine-800 text-ivory-50" },
] as const

const TYPE_SCALE = [
  { token: "display-2xl", note: "56 → 160px · одно слово на экран", sample: "WorkFlow" },
  {
    token: "display-xl",
    note: "44 → 104px · заголовок hero",
    sample: (
      <>
        Офисы, в которых <span className="accent-serif">хочется</span> работать
      </>
    ),
  },
  { token: "display-lg", note: "36 → 76px · заголовок секции", sample: "Бизнес-центры класса А" },
  {
    token: "display-md",
    note: "30 → 52px · подзаголовок",
    sample: (
      <>
        Переговорные, open space <span className="accent-serif">и</span> кабинеты
      </>
    ),
  },
  { token: "title", note: "22 → 30px · карточки", sample: "Сервисный офис под ключ" },
  {
    token: "lead",
    note: "17 → 21px · вводный абзац",
    sample:
      "Подберём офис, сервисное пространство или решение под ключ под задачи вашей компании. Сопроводим от заявки до заезда.",
  },
] as const

/* Размер задаётся полным именем класса — по той же причине, что и цвета */
const TYPE_CLASS: Record<(typeof TYPE_SCALE)[number]["token"], string> = {
  "display-2xl": "text-display-2xl font-medium",
  "display-xl": "text-display-xl font-medium",
  "display-lg": "text-display-lg font-medium",
  "display-md": "text-display-md font-medium",
  title: "text-title font-medium",
  lead: "text-lead text-graphite-600",
}

const EASINGS = [
  { name: "out-expo", use: "Появление блоков, раскрытие", className: "ease-out-expo" },
  { name: "out-quart", use: "Наведение, мелкие переходы", className: "ease-out-quart" },
  { name: "in-out-quart", use: "Шторки, смена сцен", className: "ease-in-out-quart" },
] as const

function toHex(rgb: string) {
  const [r, g, b] = rgb.match(/\d+(\.\d+)?/g)?.map(Number) ?? [0, 0, 0]
  return `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`.toUpperCase()
}

function luminance(rgb: string) {
  const [r, g, b] = (rgb.match(/\d+(\.\d+)?/g)?.map(Number) ?? [0, 0, 0]).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Читает фактические цвета элемента после отрисовки */
function useComputedColors<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [colors, setColors] = useState({ background: "", color: "" })

  useLayoutEffect(() => {
    if (!ref.current) return
    const style = getComputedStyle(ref.current)
    setColors({ background: style.backgroundColor, color: style.color })
  }, [])

  return [ref, colors] as const
}

function Swatch({ token, className }: { token: string; className: string }) {
  const [ref, { background }] = useComputedColors<HTMLDivElement>()
  const onLight = background ? contrast(background, "rgb(11, 13, 12)") : 0
  const onDark = background ? contrast(background, "rgb(247, 245, 240)") : 0
  const darkText = onLight >= onDark

  return (
    <div className="min-w-0">
      <div
        ref={ref}
        className={cn(
          "flex aspect-[4/5] items-end rounded-2xl p-3 ring-1 ring-inset ring-graphite-950/5",
          className,
          darkText ? "text-graphite-950" : "text-ivory-50"
        )}
      >
        <span className="numeric text-xs font-medium opacity-80">
          Aa {Math.max(onLight, onDark).toFixed(1)}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium">{token.split("-").pop()}</p>
      <p className="numeric text-xs text-graphite-500">{background && toHex(background)}</p>
    </div>
  )
}

function ContrastRow({ usage, className }: { usage: string; className: string }) {
  const [ref, { background, color }] = useComputedColors<HTMLDivElement>()
  const ratio = background ? contrast(background, color) : 0
  const level = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA крупный" : "не проходит"

  return (
    <div ref={ref} className={cn("flex items-center justify-between gap-4 rounded-2xl px-5 py-4", className)}>
      <span className="text-[15px]">{usage}</span>
      <span className="numeric shrink-0 text-sm font-medium">
        {ratio.toFixed(2)} · {level}
      </span>
    </div>
  )
}

function Block({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-graphite-950/10 py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-16">
        <div>
          <p className="label text-ochre-700">{label}</p>
          <h2 className="mt-4 text-display-md font-medium">{title}</h2>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  )
}

/** Полоса прогресса страницы: проверка, что ScrollTrigger идёт в ногу с плавным скроллом */
function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: true },
      }
    )
  })

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-ochre-500"
    />
  )
}

function DemoRow({ name, note, children }: { name: string; note: string; children: ReactNode }) {
  return (
    <div className="border-t border-graphite-950/10 pt-6">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-graphite-500">{note}</span>
      </div>
      {children}
    </div>
  )
}

function EasingDemo() {
  const [played, setPlayed] = useState(false)

  return (
    <div>
      <div className="space-y-6">
        {EASINGS.map((easing) => (
          <div key={easing.name}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="font-medium">{easing.name}</span>
              <span className="text-graphite-500">{easing.use}</span>
            </div>
            <div className="mt-3 h-12 rounded-full bg-ivory-100 p-1">
              {/* Обёртка уже трека на ширину точки: сдвиг на 100% доводит точку ровно до края */}
              <div
                className={cn(
                  "h-full w-[calc(100%-2.5rem)] transition-transform duration-1200",
                  easing.className,
                  played ? "translate-x-full" : "translate-x-0"
                )}
              >
                <div className="h-10 w-10 rounded-full bg-graphite-950" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Action variant="dark" className="mt-8" onClick={() => setPlayed((value) => !value)}>
        {played ? "Вернуть" : "Проиграть"}
      </Action>
    </div>
  )
}

export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-ivory-50 text-graphite-950">
      <ScrollProgressBar />
      <header className="relative overflow-hidden bg-graphite-950 text-ivory-50">
        <div className="shell flex min-h-[80svh] flex-col justify-end pb-16 pt-24 sm:pb-24">
          <Appear play="mount" delay={0.1} className="flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-12 bg-ochre-500" />
            <p className="label text-ochre-400">Дизайн-система · этапы 1–2</p>
          </Appear>
          <TextReveal
            as="h1"
            play="mount"
            delay={0.2}
            className="mt-8 max-w-6xl text-display-xl font-medium text-ivory-50"
          >
            Графит, охра и <span className="accent-serif text-ochre-400">тишина</span> премиального
            офиса
          </TextReveal>
          <Appear play="mount" delay={0.7} as="p" className="mt-8 max-w-2xl text-lead text-graphite-300">
            Палитра снята с интерьеров из видео: графитовые потолки, охристые стены переговорных,
            хвойные двери и светлый камень. Эта страница есть только в режиме разработки.
          </Appear>
          <Appear play="mount" delay={0.85} stagger={0.08} className="mt-10 flex flex-wrap gap-3">
            <Action size="lg">
              Подобрать офис
              <ArrowUpRight className={actionArrowClass} />
            </Action>
            <Action variant="glass" size="lg">
              Смотреть объекты
            </Action>
          </Appear>
        </div>
      </header>

      <main className="shell">
        <Block label="01 · Цвет" title="Палитра">
          <div className="space-y-12">
            {PALETTE.map((group) => (
              <div key={group.name}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-title font-medium">
                    {group.name}{" "}
                    <span className="font-normal text-graphite-400">
                      · {group.swatches[0][0].split("-")[0]}
                    </span>
                  </h3>
                  <p className="text-sm text-graphite-500">{group.role}</p>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6 xl:grid-cols-11">
                  {group.swatches.map(([token, className]) => (
                    <Swatch key={token} token={token} className={className} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block label="02 · Доступность" title="Контраст пар">
          <p className="max-w-2xl text-graphite-600">
            Считается по WCAG прямо в браузере. Для обычного текста нужен уровень AA (от 4.5), для
            крупного — от 3.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {CONTRAST_PAIRS.map((pair) => (
              <ContrastRow key={pair.usage} usage={pair.usage} className={pair.className} />
            ))}
          </div>
        </Block>

        <Block label="03 · Типографика" title="Шкала заголовков">
          <p className="max-w-2xl text-graphite-600">
            Onest — основной гротеск. Cormorant Garamond курсивом — одно акцентное слово в
            заголовке. Размеры плавно растут от телефона к широкому экрану: потяните окно.
          </p>
          <div className="mt-10 divide-y divide-graphite-950/10">
            {TYPE_SCALE.map((row) => (
              <div key={row.token} className="grid gap-3 py-8 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
                <div className="text-sm">
                  <p className="font-medium">{row.token}</p>
                  <p className="text-graphite-500">{row.note}</p>
                </div>
                <p className={cn("min-w-0 break-words", TYPE_CLASS[row.token])}>{row.sample}</p>
              </div>
            ))}
            <div className="grid gap-3 py-8 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
              <div className="text-sm">
                <p className="font-medium">label</p>
                <p className="text-graphite-500">12px · прописные</p>
              </div>
              <p className="label text-graphite-600">Коммерческая недвижимость · Алматы</p>
            </div>
            <div className="grid gap-3 py-8 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
              <div className="text-sm">
                <p className="font-medium">numeric</p>
                <p className="text-graphite-500">цифры одной ширины</p>
              </div>
              <p className="numeric text-display-md font-light">0123456789 м² · ₸/м²</p>
            </div>
          </div>
        </Block>

        <Block label="04 · Действия" title="Кнопки">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-ivory-100 p-6 sm:p-8">
              <Action>
                Подобрать офис
                <ArrowUpRight className={actionArrowClass} />
              </Action>
              <Action variant="dark">Записаться на просмотр</Action>
              <Action variant="outline">Все объекты</Action>
              <Action variant="outline" size="icon" aria-label="Позвонить">
                <Phone className="h-5 w-5" />
              </Action>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-graphite-950 p-6 sm:p-8">
              <Action>
                Подобрать офис
                <ArrowUpRight className={actionArrowClass} />
              </Action>
              <Action variant="light">Записаться на просмотр</Action>
              <Action variant="glass">Все объекты</Action>
            </div>

            <div className="relative overflow-hidden rounded-3xl">
              <img
                src="/Carousel/TMK_11440.jpg.webp"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-graphite-950/40" />
              <div className="relative flex min-h-64 flex-wrap items-end gap-3 p-6 sm:p-8">
                <Action variant="glass" size="lg">
                  Стекло поверх фото
                </Action>
                <Action variant="glass" size="icon" aria-label="Позвонить">
                  <Phone className="h-5 w-5" />
                </Action>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-graphite-950/10 p-6 sm:p-8">
              <Action size="sm">Размер sm</Action>
              <Action size="md">Размер md</Action>
              <Action size="lg">Размер lg</Action>
              <Action disabled>Недоступна</Action>
            </div>
          </div>
        </Block>

        <Block label="05 · Поверхности" title="Фоны секций">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-3xl bg-ivory-100 p-8">
              <p className="label text-ochre-700">Светлая</p>
              <h3 className="mt-6 text-title font-medium">Слоновая кость</h3>
              <p className="mt-3 text-graphite-600">Основные секции: форматы офисов, карточки объектов.</p>
            </article>
            <article className="rounded-3xl bg-graphite-900 p-8 text-ivory-50">
              <p className="label text-ochre-400">Тёмная</p>
              <h3 className="mt-6 text-title font-medium text-ivory-50">Графит</h3>
              <p className="mt-3 text-graphite-300">Сцены с видео, цифры, подвал.</p>
            </article>
            <article className="rounded-3xl bg-pine-800 p-8 text-ivory-50">
              <p className="label text-ochre-400">Глубокая</p>
              <h3 className="mt-6 text-title font-medium text-ivory-50">Хвоя</h3>
              <p className="mt-3 text-ivory-200">Форма заявки и акцентные блоки.</p>
            </article>
          </div>
        </Block>

        <Block label="06 · Движение" title="Кривые анимации">
          <p className="mb-10 max-w-2xl text-graphite-600">
            Три кривые на весь сайт — у анимаций один «почерк». Здесь они растянуты до 1.2 секунды,
            чтобы разница была видна.
          </p>
          <EasingDemo />
        </Block>

        <Block label="07 · Скролл" title="Анимации при прокрутке">
          <p className="max-w-2xl text-graphite-600">
            Плавный скролл Lenis и GSAP ScrollTrigger считаются в одном кадре — полоска прогресса
            вверху окна идёт без отставания. Всё, кроме параллакса, появляется один раз. При
            системной настройке «уменьшить движение» анимаций нет, контент виден сразу.
          </p>

          <div className="mt-16 space-y-24">
            <DemoRow name="TextReveal · строки" note="заголовки секций">
              <TextReveal as="p" className="max-w-5xl text-display-lg font-medium">
                Три бизнес-центра <span className="accent-serif">класса А</span> в разных районах
                Алматы
              </TextReveal>
            </DemoRow>

            <DemoRow name="TextReveal · слова" note="вводные абзацы">
              <TextReveal as="p" by="words" className="max-w-3xl text-lead text-graphite-600">
                Подберём офис, сервисное пространство или решение под ключ под задачи вашей
                компании. Сопроводим от заявки до заезда.
              </TextReveal>
            </DemoRow>

            <DemoRow name="TextReveal · буквы" note="одно крупное слово">
              <TextReveal as="p" by="chars" className="text-display-2xl font-medium">
                WorkFlow
              </TextReveal>
            </DemoRow>

            <DemoRow name="Appear · по очереди" note="сетки карточек">
              <Appear stagger={0.12} className="grid gap-4 md:grid-cols-3">
                {PROPERTIES.map((property) => (
                  <article key={property.slug} className="rounded-3xl bg-ivory-100 p-8">
                    <p className="label text-ochre-700">{property.shortLabel}</p>
                    <h3 className="mt-8 text-title font-medium">{property.name}</h3>
                    <p className="mt-2 text-sm text-graphite-500">{property.address}</p>
                  </article>
                ))}
              </Appear>
            </DemoRow>

            <DemoRow name="MediaReveal" note="шторка + отъезд камеры">
              <MediaReveal className="aspect-[16/9] rounded-3xl">
                <img
                  src="/Carousel/TMK_11483.jpg.webp"
                  alt="Сервисный офис с лаунж-зоной"
                  className="h-full w-full object-cover"
                />
              </MediaReveal>
            </DemoRow>

            <DemoRow name="Parallax" note="едет вместе со скроллом, вперёд и назад">
              <Parallax className="aspect-[16/9] rounded-3xl" amount={12}>
                <img
                  src="/TimeSquare/office-3.webp"
                  alt="Свободное помещение под офис"
                  className="h-full w-full object-cover"
                />
              </Parallax>
            </DemoRow>
          </div>
        </Block>
      </main>
    </div>
  )
}
