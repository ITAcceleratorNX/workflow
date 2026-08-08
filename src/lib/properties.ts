/**
 * Контент объектов по ТЗ «TMK WorkFlow» v1.0.
 * Все площади и характеристики перенесены дословно, без пересчёта и объединения.
 */

export type PropertySlug = "time-square" | "venus" | "koktem-towers"

/** Категории фотографий из разделов 5.10 / 6.6 / 7.6 ТЗ */
export type PhotoCategory =
  | "facade"
  | "entrance"
  | "hall"
  | "offices"
  | "elevators"
  | "common"
  | "parking"
  | "renders"
  | "infrastructure"

export const PHOTO_CATEGORY_LABELS: Record<PhotoCategory, string> = {
  facade: "Фасад с дрона",
  entrance: "Входная группа",
  hall: "Холл",
  offices: "Офисы",
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
  address: string
  shortLabel: string
  description: string[]
  availability: AvailabilityItem[]
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

/**
 * Фотографии Time Square: файлы кладутся в public/TimeSquare/
 * (ожидаемые имена — в public/TimeSquare/README.md).
 * Пока файла нет, галерея показывает подпись категории вместо битой картинки.
 */
const timeSquare: Property = {
  slug: "time-square",
  name: "Time Square",
  path: "/",
  h1: "Офисы для бизнеса в Алматы",
  metaTitle: "TMK WorkFlow — офисы и коммерческие помещения в аренду в Алматы",
  metaDescription:
    "Аренда офисов и коммерческих помещений в Алматы: бизнес-центр Time Square класса А на пересечении Аль-Фараби и Мендикулова, а также объекты Venus и Koktem Towers.",
  cover: "/TimeSquare/facade-1.webp",
  coverAlt: "Фасад бизнес-центра Time Square в Алматы",
  heroPhoto: "/TimeSquare/facade-1.webp",
  heroPhotoAlt: "Бизнес-центр Time Square класса А, микрорайон Самал-3, Алматы",
  address: "микрорайон Самал-3, 15/1, Алматы",
  shortLabel: "Класс А · Самал-3",
  description: [
    "Time Square — современный бизнес-центр премиального уровня класса А на пересечении Аль-Фараби и Мендикулова, с панорамой на горы Заилийского Алатау.",
    "Первый этаж — входная группа комплекса с многосветным атриумом под стеклянным куполом, скульптурной арт-инсталляцией и высоким пешеходным трафиком.",
    "Свободно к аренде — 1 995,7 м², которые делятся на отдельные лоты: от компактного бутика до целого этажа под одного арендатора. Также имеются блоки по два этажа общей площадью 3 200 м² под офисы локальных и международных компаний.",
  ],
  availability: [
    { area: "1 100 кв. м", note: "цокольный этаж" },
    { area: "800 кв. м", note: "первый этаж блока" },
    { area: "1 200 кв. м", note: "под коммерческие точки — первый этаж" },
  ],
  specs: [
    { label: "Общая площадь (GBA)", value: "10 000 кв. м" },
    { label: "Вакантная площадь", value: "6 500 кв. м" },
    { label: "Под офисы", value: "1 600 кв. м" },
    { label: "Под коммерцию", value: "от 50 кв. м до 3 000 кв. м" },
    { label: "Класс", value: "А" },
    { label: "Этажность", value: "3" },
    { label: "Паркинг", value: "подземный, 72 парковочных места" },
  ],
  advantages: [
    { icon: "class", label: "Класс А" },
    { icon: "glazing", label: "Панорамное остекление" },
    { icon: "engineering", label: "Современные инженерные системы" },
    { icon: "elevator", label: "Высокоскоростные лифты" },
    { icon: "parking", label: "Подземный паркинг" },
    { icon: "security", label: "Круглосуточная охрана" },
    { icon: "management", label: "Профессиональная управляющая компания" },
    { icon: "infrastructure", label: "Развитая инфраструктура" },
  ],
  photos: [
    { src: "/TimeSquare/facade-1.webp", alt: "Фасад бизнес-центра Time Square с дрона", category: "facade" },
    { src: "/TimeSquare/facade-2.webp", alt: "Бизнес-центр Time Square с высоты, панорама на Заилийский Алатау", category: "facade" },
    { src: "/TimeSquare/entrance-1.webp", alt: "Входная группа бизнес-центра Time Square", category: "entrance" },
    { src: "/TimeSquare/entrance-2.webp", alt: "Вход в бизнес-центр Time Square со стороны Аль-Фараби", category: "entrance" },
    { src: "/TimeSquare/hall-1.webp", alt: "Многосветный атриум Time Square под стеклянным куполом", category: "hall" },
    { src: "/TimeSquare/hall-2.webp", alt: "Холл Time Square со скульптурной арт-инсталляцией", category: "hall" },
    { src: "/TimeSquare/office-1.webp", alt: "Офисное помещение в бизнес-центре Time Square", category: "offices" },
    { src: "/TimeSquare/office-2.webp", alt: "Офис с панорамным остеклением в Time Square", category: "offices" },
    { src: "/TimeSquare/elevators-1.webp", alt: "Высокоскоростные лифты бизнес-центра Time Square", category: "elevators" },
    { src: "/TimeSquare/common-1.webp", alt: "Общие зоны бизнес-центра Time Square", category: "common" },
    { src: "/TimeSquare/common-2.webp", alt: "Зона отдыха в общественном пространстве Time Square", category: "common" },
    { src: "/TimeSquare/parking-1.webp", alt: "Подземный паркинг бизнес-центра Time Square на 72 места", category: "parking" },
    { src: "/TimeSquare/render-1.webp", alt: "Рендер проекта бизнес-центра Time Square", category: "renders" },
    { src: "/TimeSquare/render-2.webp", alt: "Рендер общественных пространств Time Square", category: "renders" },
  ],
}

const venus: Property = {
  slug: "venus",
  name: "Venus",
  path: "/venus",
  h1: "Бизнес-центр Venus в Алматы",
  metaTitle: "Venus — аренда офисов в бизнес-центре класса B+ в Алматы | TMK WorkFlow",
  metaDescription:
    "Venus — бизнес-центр класса B+ в Медеуском районе Алматы, ул. Елебекова 10/1. Open Space и кабинетные планировки, потолки 3,9 м, наземный паркинг на 85 машиномест.",
  cover: "/venus.webp",
  coverAlt: "Фасад бизнес-центра Venus в Алматы",
  heroPhoto: "/venus.webp",
  heroPhotoAlt: "Бизнес-центр Venus класса B+, ул. Елебекова 10/1, Алматы",
  address: "ул. Елебекова, 10/1, Медеуский район, Алматы",
  shortLabel: "Класс B+ · Медеуский район",
  description: [
    "Venus — современный бизнес-центр класса B+, расположенный в престижном Медеуском районе Алматы по адресу: ул. Елебекова, 10/1.",
    "Благодаря удобному расположению рядом с основными транспортными магистралями города, бизнес-центр обеспечивает комфортную доступность для сотрудников и посетителей.",
    "Современные офисные помещения с кабинетной и открытой (Open Space) планировкой. Здание оборудовано современными инженерными системами, центральным кондиционированием, приточно-вытяжной вентиляцией и собственной парковкой.",
  ],
  availability: [
    { area: "70 кв. м", note: "офисный блок" },
    { area: "35 кв. м", note: "офисный блок" },
  ],
  specs: [
    { label: "Общая площадь (GBA)", value: "22 000 кв. м" },
    { label: "Арендопригодная площадь", value: "19 130 кв. м" },
    { label: "Класс", value: "B+" },
    { label: "Год постройки", value: "2021" },
    { label: "Этажность", value: "3" },
    { label: "Высота потолков", value: "3,9 м" },
    { label: "Планировка", value: "Open Space, кабинетная" },
    { label: "Сейсмоустойчивость", value: "9 баллов" },
    { label: "Вентиляция", value: "приточно-вытяжная" },
    { label: "Кондиционирование", value: "центральное и местное" },
    { label: "Паркинг", value: "наземный, 85 машиномест" },
  ],
  advantages: [
    { icon: "class", label: "Класс B+" },
    { icon: "location", label: "Удобное расположение в Медеуском районе" },
    { icon: "engineering", label: "Современные инженерные системы" },
    { icon: "cooling", label: "Центральное кондиционирование" },
    { icon: "ventilation", label: "Приточно-вытяжная вентиляция" },
    { icon: "ceiling", label: "Высокие потолки — 3,9 м" },
    { icon: "layout", label: "Open Space и кабинетная планировка" },
    { icon: "parking", label: "Наземный паркинг" },
    { icon: "infrastructure", label: "Развитая инфраструктура" },
  ],
  photos: [
    { src: "/venus.webp", alt: "Фасад бизнес-центра Venus в Медеуском районе Алматы", category: "facade" },
    { src: "/Venus/TMK_11292.webp", alt: "Холл бизнес-центра Venus со стойкой ресепшн", category: "hall" },
    { src: "/Venus/TMK_11435.webp", alt: "Входная зона офисного этажа бизнес-центра Venus", category: "hall" },
    { src: "/Venus/TMK_11297.webp", alt: "Коридор общих зон бизнес-центра Venus", category: "common" },
    { src: "/Venus/TMK_11311.webp", alt: "Конференц-зал бизнес-центра Venus", category: "common" },
    { src: "/Venus/TMK_11348.webp", alt: "Лаунж-зона с панорамными окнами в бизнес-центре Venus", category: "common" },
    { src: "/Venus/TMK_11352.webp", alt: "Зона отдыха для арендаторов бизнес-центра Venus", category: "common" },
    { src: "/Venus/TMK_11397.webp", alt: "Кухня и зона питания в бизнес-центре Venus", category: "infrastructure" },
    { src: "/Venus/TMK_11357.webp", alt: "Офисное помещение Venus с панорамным остеклением", category: "offices" },
    { src: "/Venus/TMK_11439.webp", alt: "Офисный блок Open Space в бизнес-центре Venus", category: "offices" },
  ],
}

const koktemTowers: Property = {
  slug: "koktem-towers",
  name: "Koktem Towers",
  path: "/koktem-towers",
  h1: "Бизнес-центр Koktem Towers в Алматы",
  metaTitle: "Koktem Towers — аренда офисов на Достык 180 в Алматы | TMK WorkFlow",
  metaDescription:
    "Koktem Towers — бизнес-центр класса B+ на проспекте Достык, 180 рядом с метро «Абая». Свободен девятый этаж целиком — 643 кв. м. Наземный и подземный паркинг.",
  cover: "/koktem-towers.webp",
  coverAlt: "Фасад бизнес-центра Koktem Towers в Алматы",
  heroPhoto: "/koktem-towers.webp",
  heroPhotoAlt: "Бизнес-центр Koktem Towers класса B+, проспект Достык 180, Алматы",
  address: "проспект Достык, 180, Медеуский район, Алматы",
  shortLabel: "Класс B+ · проспект Достык",
  description: [
    "Koktem Towers — современный бизнес-центр класса B+, расположенный в престижном Медеуском районе Алматы по адресу: проспект Достык, 180. Благодаря удобному расположению рядом со станцией метро «Абая» и ключевыми транспортными магистралями города, бизнес-центр обеспечивает комфортную транспортную доступность для сотрудников и клиентов.",
    "Объект введён в эксплуатацию в 2005 году и предлагает современные офисные помещения с кабинетной и открытой (Open Space) планировкой. Бизнес-центр оснащён современными инженерными системами, центральным и местным кондиционированием, приточно-вытяжной вентиляцией, лифтами и собственной парковкой.",
  ],
  availability: [{ area: "643 кв. м", note: "полностью девятый этаж" }],
  specs: [
    { label: "Общая площадь (GBA)", value: "5 148 кв. м" },
    { label: "Арендопригодная площадь", value: "4 752 кв. м" },
    { label: "Размер типового этажа", value: "396 кв. м" },
    { label: "Класс", value: "B+" },
    { label: "Год постройки", value: "2005" },
    { label: "Этажность", value: "13" },
    { label: "Высота потолков", value: "2,8 м" },
    { label: "Планировка", value: "Open Space, кабинетная" },
    { label: "Сейсмоустойчивость", value: "9 баллов" },
    { label: "Вентиляция", value: "приточно-вытяжная" },
    { label: "Кондиционирование", value: "центральное и местное" },
    { label: "Наземный паркинг", value: "70 машиномест" },
    { label: "Подземный паркинг", value: "46 машиномест" },
  ],
  advantages: [
    { icon: "class", label: "Класс B+" },
    { icon: "location", label: "Престижное расположение на проспекте Достык" },
    { icon: "mall", label: "Близость к ТРЦ «Dostyk Plaza»" },
    { icon: "layout", label: "Open Space и кабинетная планировка" },
    { icon: "engineering", label: "Современные инженерные системы" },
    { icon: "cooling", label: "Центральное и местное кондиционирование" },
    { icon: "ventilation", label: "Приточно-вытяжная вентиляция" },
    { icon: "parking", label: "Наземный и подземный паркинг" },
    { icon: "infrastructure", label: "Развитая инфраструктура" },
    { icon: "transport", label: "Удобная транспортная доступность" },
  ],
  photos: [
    { src: "/koktem-towers.webp", alt: "Фасад бизнес-центра Koktem Towers на проспекте Достык", category: "facade" },
    { src: "/Koktem Tower/TMK_11441.webp", alt: "Офисное помещение Koktem Towers с рабочими местами", category: "offices" },
    { src: "/Koktem Tower/TMK_11442.webp", alt: "Офис Open Space в бизнес-центре Koktem Towers", category: "offices" },
    { src: "/Koktem Tower/TMK_11444.webp", alt: "Общие зоны и коридор бизнес-центра Koktem Towers", category: "common" },
    { src: "/Koktem Tower/TMK_11445.webp", alt: "Холл этажа бизнес-центра Koktem Towers", category: "common" },
    { src: "/Koktem Tower/TMK_11450.webp", alt: "Коридор офисного этажа Koktem Towers", category: "common" },
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
