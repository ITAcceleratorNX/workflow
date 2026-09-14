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
