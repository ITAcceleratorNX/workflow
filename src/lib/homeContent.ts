/** Контент главной страницы */

export const HERO = {
  eyebrow: "КОММЕРЧЕСКАЯ НЕДВИЖИМОСТЬ · АЛМАТЫ",
  title: "Офисы для бизнеса",
  titleAccent: "в Алматы",
  description:
    "Подберём офис, сервисное пространство или решение под ключ под задачи вашей компании. Сопроводим от заявки до заезда.",
  cta: "Подобрать офис",
  objectsLine: "Time Square · Venus · Koktem Towers",
} as const

/**
 * Короткие клипы для Hero-нарезки (public/hero/).
 * Чередуем экстерьеры с дрона и светлые интерьеры офисов.
 */
export const HERO_CLIPS = [
  { mp4: "/hero/ext-02.mp4", webm: "/hero/ext-02.webm", poster: "/hero/ext-02.jpg" },
  { mp4: "/hero/int-04.mp4", webm: "/hero/int-04.webm", poster: "/hero/int-04.jpg" },
  { mp4: "/hero/ext-05.mp4", webm: "/hero/ext-05.webm", poster: "/hero/ext-05.jpg" },
  { mp4: "/hero/int-05.mp4", webm: "/hero/int-05.webm", poster: "/hero/int-05.jpg" },
  { mp4: "/hero/ext-01.mp4", webm: "/hero/ext-01.webm", poster: "/hero/ext-01.jpg" },
  { mp4: "/hero/int-01.mp4", webm: "/hero/int-01.webm", poster: "/hero/int-01.jpg" },
  { mp4: "/hero/int-06.mp4", webm: "/hero/int-06.webm", poster: "/hero/int-06.jpg" },
] as const

/** Форматы офисных решений — карточки с фото по референсу office-six-virid */
export const OFFICE_FORMATS = {
  eyebrow: "ФОРМАТЫ ОФИСНЫХ РЕШЕНИЙ",
  title: "Под разные задачи бизнеса",
  description:
    "Эти форматы помогают точнее описать запрос в заявке — выбор формата не ограничивает каталог.",
  cards: [
    {
      title: "Офис",
      text: "Классический офис в бизнес-центре под аренду: выбираете площадь и этаж под структуру команды.",
      image: "/Carousel/TMK_11440.jpg.webp",
      imageAlt: "Современное офисное пространство с зоной отдыха и переговорными",
    },
    {
      title: "Сервисный офис",
      text: "Готовое рабочее пространство с мебелью, инфраструктурой и обслуживанием — можно заехать быстрее.",
      image: "/Carousel/TMK_11483.jpg.webp",
      imageAlt: "Сервисный офис с мебелью и лаунж-зоной",
    },
    {
      title: "Офис под ключ",
      text: "Решение под задачи бизнеса: подбор, планировка и подготовка пространства к заезду.",
      image: "/TimeSquare/office-3.webp",
      imageAlt: "Свободное помещение под отделку офиса под ключ",
    },
  ],
} as const
