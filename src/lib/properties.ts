/**
 * Контент объектов по документу «ТМК - офисы для сайта» (ТЗ демо-версии, октябрь 2026).
 * Характеристики, площади, ставки и описания перенесены из документа без пересчёта.
 *
 * Единый формат площади по всему сайту — «м²»: он же стоит внутри ставки
 * (₸/м²/мес), и разнобой с «кв. м» бросался в глаза в одной карточке.
 */

export type PropertySlug = "time-square" | "venus" | "koktem-towers"

/** Категории фотографий — подписи к наборам визуалов из ТЗ */
export type PhotoCategory =
  | "facade"
  | "ground"
  | "entrance"
  | "hall"
  | "commerce"
  | "kitchen"
  | "meeting"
  | "offices"
  | "office3"
  | "office9"
  | "elevators"
  | "common"
  | "parking"
  | "renders"
  | "infrastructure"

export const PHOTO_CATEGORY_LABELS: Record<PhotoCategory, string> = {
  facade: "Фасад с дрона",
  ground: "Вид с земли",
  entrance: "Входная группа",
  hall: "Холл",
  commerce: "Коммерция",
  kitchen: "Кухня",
  meeting: "Переговорные",
  offices: "Офисы",
  office3: "Офис, 3 этаж",
  office9: "Офис, 9 этаж",
  elevators: "Лифты",
  common: "Общие зоны",
  parking: "Паркинг",
  renders: "Рендеры проекта",
  infrastructure: "Инфраструктура",
}

export interface PropertyPhoto {
  src: string
  alt: string
  category: PhotoCategory
}

export interface SpecRow {
  label: string
  value: string
}

export interface Advantage {
  icon: AdvantageIcon
  label: string
  /** Пояснение под названием преимущества */
  text?: string
}

export type AdvantageIcon =
  | "class"
  | "glazing"
  | "engineering"
  | "elevator"
  | "parking"
  | "security"
  | "management"
  | "infrastructure"
  | "location"
  | "cooling"
  | "ventilation"
  | "ceiling"
  | "layout"
  | "mall"
  | "transport"

export interface AvailabilityItem {
  area: string
  note: string
  /**
   * Ставка рядом с площадью (ТЗ правок от 07.09.2026, общее правило).
   * Хранится целиком строкой, включая пометку «без НДС»: ставки указаны
   * без налога, и потерять эту пометку при вёрстке нельзя.
   */
  rate: string
  /** Ставка — нижняя граница («от …»): точная зависит от ремонта и формата, см. rateTiers */
  rateFrom?: boolean
  /** Фото или рендеры этого помещения: первое — миниатюра в карточке площади */
  photos?: string[]
}

export interface RateTier {
  rate: string
  note: string
}

export interface Property {
  slug: PropertySlug
  /** Название в навигации и карточках */
  name: string
  path: string
  h1: string
  metaTitle: string
  metaDescription: string
  /** Обложка объекта — фасад снаружи (раздел 8 ТЗ) */
  cover: string
  coverAlt: string
  /** Большое фото фасада в начале блока объекта (5.4 / 6.1 / 7.1) */
  heroPhoto: string
  heroPhotoAlt: string
  /** Tailwind-класс кадрирования первого экрана (object-position); по умолчанию — по центру */
  heroPhotoPosition?: string
  address: string
  shortLabel: string
  /** Короткие факты для карточки на главной, выводятся через «•» */
  cardFacts: string[]
  /** Что свободно — колонка «Этаж / блок» в сводной таблице на главной */
  availabilitySummary: string
  /** Координаты для мини-карты на главной */
  map: { lat: number; lng: number }
  description: string[]
  availability: AvailabilityItem[]
  /** Строка под плашками о делении площадей */
  splitNote?: string
  /** Ставки по вариантам ремонта и формата, если у объекта их несколько */
  rateTiers?: RateTier[]
  specs: SpecRow[]
  advantages: Advantage[]
  photos: PropertyPhoto[]
}

/** Выделенный блок об экосистеме TMK (5.6). Присутствует на страницах всех трёх объектов. */
export const ECOSYSTEM = {
  title: "TMK WorkFlow — больше, чем аренда",
  paragraphs: [
    "TMK — не просто арендодатель, а точка входа в работающую бизнес-экосистему. Арендуя офис в TMK WorkFlow, компания получает доступ к партнёрской сети группы: ретейл, автобизнес, финансы, сервисы — арендаторам, которым есть что предложить друг другу, мы помогаем найти общий язык. Административный ресурс TMK открывает выход на профильные структуры и сопровождение переговоров на уровне первых лиц — от идеи до подписанных договорённостей. Внутри экосистемы выстраиваются реальные денежные и клиентские потоки: оборот вашего бизнеса растёт вместе с оборотами соседей по зданию.",
    "Подтверждение — не обещания, а состоявшиеся сделки: аренда офиса переросла в кросс-инвестиции и совместную компанию (Qaitadan, TMK Techno Horizon), поставка мебели — в девелопмент участка (Pomo Design Center), аренда офиса МФО — в финансовое партнёрство с автодилером Doscar Group.",
    "Дополнительно арендаторы WorkFlow получают приоритетный доступ к digital- и маркетинг-аудитам группы — диагностика точек роста бизнеса начинается уже на этапе переезда.",
  ],
} as const

/** Рендеры офисов Time Square — общие для обоих офисных блоков */
const TS_OFFICE_RENDERS = [
  "/TimeSquare/office-render-1.webp",
  "/TimeSquare/office-render-2.webp",
  "/TimeSquare/office-render-3.webp",
  "/TimeSquare/office-render-4.webp",
  "/TimeSquare/office-render-5.webp",
]

/** Фотографии Time Square — public/TimeSquare/ (см. README.md в этой папке). */
const timeSquare: Property = {
  slug: "time-square",
  name: "Time Square",
  path: "/time-square",
  h1: "Бизнес-центр Time Square в Алматы",
  metaTitle: "Time Square — аренда офисов в бизнес-центре класса А в Алматы | TMK WorkFlow",
  metaDescription:
    "Time Square — бизнес-центр класса А в Самал-3, Алматы. Офисные блоки по 900 м² на 2 и 3 этажах, коммерция 400 м² на первом этаже, подземный паркинг на 72 места.",
  cover: "/TimeSquare/facade-4.webp",
  coverAlt: "Бизнес-центр Time Square в Алматы, вид с дрона на фоне гор Заилийского Алатау",
  heroPhoto: "/TimeSquare/facade-4.webp",
  heroPhotoAlt:
    "Бизнес-центр Time Square класса А в микрорайоне Самал-3 в Алматы с панорамой на горы Заилийского Алатау",
  address: "микрорайон Самал-3, 15/1, Алматы",
  shortLabel: "Класс А · Самал-3",
  cardFacts: ["Офисные блоки по 900 м²", "Коммерция 400 м²", "Подземный паркинг"],
  availabilitySummary: "Офисные блоки на 2 и 3 этажах, коммерция на 1 этаже",
  map: { lat: 43.227971, lng: 76.95603 },
  description: [
    "Новый премиальный бизнес-центр класса А в топовой локации г. Алматы. Современная инженерия, профессиональные PM и FM услуги, гарантированный трафик, высокая транспортная доступность и высокий статус гарантированы в Time Square.",
  ],
  availability: [
    {
      area: "900 м²",
      note: "офисный блок, 2 этаж",
      rate: "25 000 ₸/м²/мес без НДС",
      photos: TS_OFFICE_RENDERS,
    },
    {
      area: "900 м²",
      note: "офисный блок, 3 этаж",
      rate: "25 000 ₸/м²/мес без НДС",
      photos: TS_OFFICE_RENDERS,
    },
    {
      area: "400 м²",
      note: "коммерция, 1 этаж",
      rate: "19 000 ₸/м²/мес без НДС",
      photos: [
        "/TimeSquare/commerce-render-1.webp",
        "/TimeSquare/commerce-render-2.webp",
        "/TimeSquare/commerce-render-3.webp",
        "/TimeSquare/commerce-render-4.webp",
        "/TimeSquare/office-5.webp",
      ],
    },
  ],
  splitNote: "Офисы и коммерческую площадь можно делить",
  specs: [
    { label: "Класс", value: "A" },
    { label: "Арендопригодная площадь", value: "9 800 м²" },
    { label: "Статус", value: "введён в эксплуатацию" },
    { label: "Год постройки", value: "2024" },
    { label: "Общая площадь", value: "10 000 м²" },
    { label: "Планировка", value: "свободная" },
    { label: "Этажность", value: "3 этажа" },
    { label: "Высота потолков", value: "3,5–4 м" },
    { label: "Лифты", value: "3" },
    { label: "Вентиляция", value: "приточно-вытяжная" },
    { label: "Кондиционирование", value: "центральное" },
    { label: "Наземный паркинг", value: "15 мест" },
    { label: "Подземный паркинг", value: "72 места" },
  ],
  advantages: [
    { icon: "class", label: "Класс А", text: "Топовый бизнес-центр" },
    {
      icon: "glazing",
      label: "Панорамное остекление",
      text: "Больше дневного света, хороший обзор вида на улицу",
    },
    {
      icon: "engineering",
      label: "Современные инженерные системы",
      text: "И профессиональные FM услуги",
    },
    {
      icon: "elevator",
      label: "Высокоскоростные лифты",
      text: "3 лифта грузоподъёмностью 1600 кг, рассчитанные на 18 человек",
    },
    { icon: "parking", label: "Подземный паркинг", text: "На 72 машиноместа" },
    { icon: "security", label: "Круглосуточная охрана", text: "Безопасность 24/7" },
    {
      icon: "management",
      label: "Профессиональная управляющая компания",
      text: "На рынке с 2017 года",
    },
    {
      icon: "infrastructure",
      label: "Развитая инфраструктура",
      text: "Рядом магазины, ТРЦ, аптеки, банкоматы, зарядные станции для электромобилей",
    },
  ],
  photos: [
    { src: "/TimeSquare/facade-4.webp", alt: "Бизнес-центр Time Square с дрона: проспект Аль-Фараби и горы Заилийского Алатау", category: "facade" },
    { src: "/TimeSquare/ground-1.webp", alt: "Бизнес-центр Time Square, вид с земли", category: "ground" },
    { src: "/TimeSquare/atrium-1.webp", alt: "Рендер холла-атриума Time Square со стеклянным куполом", category: "hall" },
    { src: "/TimeSquare/atrium-2.webp", alt: "Рендер зоны ожидания в атриуме Time Square", category: "hall" },
    { src: "/TimeSquare/atrium-3.webp", alt: "Рендер холла Time Square со стойкой ресепшн", category: "hall" },
    { src: "/TimeSquare/office-5.webp", alt: "Коммерческое помещение на первом этаже Time Square, текущее состояние", category: "commerce" },
    { src: "/TimeSquare/commerce-render-1.webp", alt: "Рендер коммерческого помещения Time Square: магазин", category: "commerce" },
    { src: "/TimeSquare/commerce-render-2.webp", alt: "Рендер коммерческого помещения Time Square: бутик", category: "commerce" },
    { src: "/TimeSquare/commerce-render-3.webp", alt: "Рендер коммерческого помещения Time Square: фронт-офис", category: "commerce" },
    { src: "/TimeSquare/commerce-render-4.webp", alt: "Рендер коммерческого помещения Time Square: магазин у дома", category: "commerce" },
    { src: "/TimeSquare/office-render-1.webp", alt: "Рендер офиса Open Space в Time Square с панорамными окнами", category: "offices" },
    { src: "/TimeSquare/office-render-2.webp", alt: "Рендер рабочей зоны офисного блока Time Square", category: "offices" },
    { src: "/TimeSquare/office-render-3.webp", alt: "Рендер переговорной комнаты в офисе Time Square", category: "offices" },
    { src: "/TimeSquare/office-render-4.webp", alt: "Рендер рабочих мест у окна в офисе Time Square", category: "offices" },
    { src: "/TimeSquare/office-render-5.webp", alt: "Рендер санузла в офисном блоке Time Square", category: "offices" },
    { src: "/TimeSquare/parking-4.webp", alt: "Подземный паркинг бизнес-центра Time Square на 72 места", category: "parking" },
    { src: "/TimeSquare/parking-1.webp", alt: "Проезд подземного паркинга Time Square", category: "parking" },
  ],
}

const venus: Property = {
  slug: "venus",
  name: "Venus",
  path: "/venus",
  h1: "Бизнес-центр Venus в Алматы",
  metaTitle: "Venus — аренда офисов в бизнес-центре класса А в Алматы | TMK WorkFlow",
  metaDescription:
    "Venus — бизнес-центр класса А в Медеуском районе Алматы, ул. Елебекова 10/1. Кабинеты 40 и 70 м², потолки 4 м, переговорные комнаты, наземный паркинг.",
  cover: "/Venus/cover.webp",
  coverAlt: "Бизнес-центр Venus в Алматы, вид с дрона",
  heroPhoto: "/Venus/facade-drone-1.webp",
  heroPhotoAlt:
    "Бизнес-центр Venus класса А на ул. Елебекова 10/1 в Алматы, вид с дрона на фоне гор",
  address: "ул. Елебекова, 10/1, Медеуский район, Алматы",
  shortLabel: "Класс А · Медеуский район",
  cardFacts: ["Потолки 4 м", "Кабинеты", "Наземный паркинг"],
  availabilitySummary: "Кабинеты",
  map: { lat: 43.228363, lng: 76.962801 },
  description: [
    "Сервисный офис в сердце деловой Алматы, формат ставки All inclusive. Переговорные комнаты, акустические кабины, ESG-стандарты, PropTech-инновации и развитая инфраструктура ждут вас.",
  ],
  availability: [
    {
      area: "70 м²",
      note: "3 кабинета",
      rate: "25 000 ₸/м²/мес без НДС",
      photos: ["/Venus/office70-1.webp", "/Venus/office70-2.webp", "/Venus/office70-3.webp"],
    },
    {
      area: "40 м²",
      note: "1 кабинет",
      rate: "25 000 ₸/м²/мес без НДС",
      photos: ["/Venus/office40-1.webp", "/Venus/office40-2.webp"],
    },
  ],
  specs: [
    { label: "Класс", value: "A" },
    { label: "Статус", value: "введён в эксплуатацию" },
    { label: "Год постройки", value: "2021" },
    { label: "Планировка", value: "кабинеты" },
    { label: "Высота потолков", value: "4 м" },
    { label: "Лифты", value: "2" },
    { label: "Вентиляция", value: "приточно-вытяжная" },
    { label: "Кондиционирование", value: "местное" },
    { label: "Паркинг", value: "наземный" },
  ],
  advantages: [
    { icon: "class", label: "Класс А" },
    { icon: "ceiling", label: "Высота потолков — 4 м" },
    { icon: "layout", label: "Кабинетная планировка" },
    { icon: "elevator", label: "2 лифта" },
    { icon: "ventilation", label: "Приточно-вытяжная вентиляция" },
    { icon: "cooling", label: "Местное кондиционирование" },
    { icon: "parking", label: "Наземный паркинг" },
  ],
  photos: [
    { src: "/Venus/facade-drone-1.webp", alt: "Бизнес-центр Venus с дрона: фасад со стороны улицы Елебекова и горы на горизонте", category: "facade" },
    { src: "/Venus/elevators-1.webp", alt: "Входная группа и холл бизнес-центра Venus со стойкой ресепшн", category: "entrance" },
    { src: "/Venus/common-1.webp", alt: "Холл офисного этажа бизнес-центра Venus", category: "hall" },
    { src: "/Venus/kitchen-1.webp", alt: "Кухня в бизнес-центре Venus", category: "kitchen" },
    { src: "/Venus/TMK_11397.webp", alt: "Кухня и зона питания в бизнес-центре Venus", category: "kitchen" },
    { src: "/Venus/kitchen-2.webp", alt: "Обеденная зона кухни в бизнес-центре Venus", category: "kitchen" },
    { src: "/Venus/common-4.webp", alt: "Большая переговорная комната бизнес-центра Venus", category: "meeting" },
    { src: "/Venus/TMK_11311.webp", alt: "Большая переговорная Conference Hall в бизнес-центре Venus", category: "meeting" },
    { src: "/Venus/meeting-small-1.webp", alt: "Малая переговорная комната бизнес-центра Venus", category: "meeting" },
    { src: "/Venus/meeting-small-2.webp", alt: "Вход в малую переговорную Conference Room в бизнес-центре Venus", category: "meeting" },
    { src: "/Venus/meeting-small-3.webp", alt: "Малая переговорная комната бизнес-центра Venus, вид сбоку", category: "meeting" },
    { src: "/Venus/office70-1.webp", alt: "Офис 70 м² в бизнес-центре Venus: рабочая зона у окна", category: "offices" },
    { src: "/Venus/office70-2.webp", alt: "Офис 70 м² в бизнес-центре Venus: зона отдыха и рабочее место", category: "offices" },
    { src: "/Venus/office70-3.webp", alt: "Офис 70 м² в бизнес-центре Venus: рабочие места и переговорная зона", category: "offices" },
    { src: "/Venus/office40-1.webp", alt: "Офис 40 м² в бизнес-центре Venus", category: "offices" },
    { src: "/Venus/office40-2.webp", alt: "Офис 40 м² в бизнес-центре Venus с переговорным столом", category: "offices" },
  ],
}

const koktemTowers: Property = {
  slug: "koktem-towers",
  name: "Koktem Towers",
  path: "/koktem-towers",
  h1: "Бизнес-центр Koktem Towers в Алматы",
  metaTitle: "Koktem Towers — аренда офисов класса А на Достык 180 в Алматы | TMK WorkFlow",
  metaDescription:
    "Koktem Towers — бизнес-центр класса А на проспекте Достык, 180 в Алматы. Офис 95 м² на 3 этаже и весь 9 этаж — 642 м². Наземный и подземный паркинг.",
  cover: "/koktem-towers.webp",
  coverAlt: "Фасад бизнес-центра Koktem Towers в Алматы",
  heroPhoto: "/Koktem Tower/facade-drone-1.webp",
  heroPhotoAlt: "Бизнес-центр Koktem Towers класса А, проспект Достык 180, Алматы, вид с дрона",
  /* Кадр почти квадратный: берём верх, чтобы в полосу попали купол и крыша главного здания */
  heroPhotoPosition: "object-[center_8%]",
  address: "проспект Достык, 180, Медеуский район, Алматы",
  shortLabel: "Класс А · проспект Достык",
  cardFacts: ["Open Space / кабинеты", "Весь 9 этаж — 642 м²", "Наземный и подземный паркинг"],
  availabilitySummary: "Офис на 3 этаже и весь 9 этаж",
  map: { lat: 43.232304, lng: 76.960183 },
  description: [
    "Культовый объект в CBD города, предпочтительный выбор консалтинговых компаний Big 4 и FMCG-лидеров, идеальное решение для долгосрочного арендатора как по локации, так и по широкому выбору форматов.",
  ],
  availability: [
    {
      area: "95 м²",
      note: "3 этаж, 3 кабинета",
      rate: "18 000 ₸/м²/мес без НДС",
      rateFrom: true,
      photos: [
        "/Koktem Tower/TMK_11442.webp",
        "/Koktem Tower/TMK_11441.webp",
        "/Koktem Tower/TMK_11444.webp",
        "/Koktem Tower/TMK_11445.webp",
        "/Koktem Tower/TMK_11448.webp",
        "/Koktem Tower/TMK_11453.webp",
      ],
    },
    {
      area: "642 м²",
      note: "весь 9 этаж",
      rate: "18 000 ₸/м²/мес без НДС",
      rateFrom: true,
      photos: [
        "/Koktem Tower/floor9-1.webp",
        "/Koktem Tower/floor9-2.webp",
        "/Koktem Tower/floor9-3.webp",
        "/Koktem Tower/floor9-4.webp",
      ],
    },
  ],
  rateTiers: [
    { rate: "18 000 ₸/м²/мес без НДС", note: "базовый ремонт без изменения планировки" },
    { rate: "21 000 ₸/м²/мес без НДС", note: "ремонт по ТЗ + клининг" },
    { rate: "25 000 ₸/м²/мес без НДС", note: "сервисный офис" },
  ],
  specs: [
    { label: "Класс", value: "A" },
    { label: "Статус", value: "введён в эксплуатацию" },
    { label: "Год постройки", value: "2011" },
    { label: "Планировка", value: "Open Space / кабинеты" },
    { label: "Лифты", value: "3" },
    { label: "Вентиляция", value: "приточно-вытяжная" },
    { label: "Кондиционирование", value: "центральное" },
    { label: "Паркинг", value: "наземный гостевой, подземный для арендаторов" },
  ],
  advantages: [
    { icon: "class", label: "Класс А" },
    { icon: "layout", label: "Open Space и кабинетная планировка" },
    { icon: "elevator", label: "3 лифта" },
    { icon: "ventilation", label: "Приточно-вытяжная вентиляция" },
    { icon: "cooling", label: "Центральное кондиционирование" },
    { icon: "parking", label: "Наземный гостевой и подземный паркинг" },
  ],
  photos: [
    { src: "/Koktem Tower/facade-drone-1.webp", alt: "Бизнес-центр Koktem Towers на проспекте Достык, вид с дрона", category: "facade" },
    { src: "/Koktem Tower/TMK_11442.webp", alt: "Офис на 3 этаже Koktem Towers с рабочими местами", category: "office3" },
    { src: "/Koktem Tower/TMK_11441.webp", alt: "Рабочие места у панорамных окон в офисе на 3 этаже Koktem Towers", category: "office3" },
    { src: "/Koktem Tower/TMK_11444.webp", alt: "Коридор офиса на 3 этаже Koktem Towers", category: "office3" },
    { src: "/Koktem Tower/TMK_11445.webp", alt: "Кабинеты офиса на 3 этаже Koktem Towers", category: "office3" },
    { src: "/Koktem Tower/TMK_11448.webp", alt: "Коридор с кабинетами в офисе на 3 этаже Koktem Towers", category: "office3" },
    { src: "/Koktem Tower/TMK_11453.webp", alt: "Стеклянные перегородки кабинетов на 3 этаже Koktem Towers", category: "office3" },
    { src: "/Koktem Tower/floor9-1.webp", alt: "Офис на 9 этаже Koktem Towers: светлое помещение с окнами", category: "office9" },
    { src: "/Koktem Tower/floor9-2.webp", alt: "Офис на 9 этаже Koktem Towers с рабочими местами", category: "office9" },
    { src: "/Koktem Tower/floor9-3.webp", alt: "Свободное помещение на 9 этаже Koktem Towers", category: "office9" },
    { src: "/Koktem Tower/floor9-4.webp", alt: "Коридор 9 этажа Koktem Towers", category: "office9" },
  ],
}

export const PROPERTIES: Property[] = [timeSquare, venus, koktemTowers]

export const getProperty = (slug: PropertySlug): Property => {
  const property = PROPERTIES.find((item) => item.slug === slug)
  if (!property) throw new Error(`Unknown property slug: ${slug}`)
  return property
}

export const TIME_SQUARE = timeSquare
export const VENUS = venus
export const KOKTEM_TOWERS = koktemTowers

/** Варианты поля «Интересующий объект» в формах (9.2 ТЗ) */
export const PROPERTY_OPTIONS = PROPERTIES.map((p) => p.name)
