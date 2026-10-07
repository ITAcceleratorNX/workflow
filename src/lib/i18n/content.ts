import type { PhotoCategory, Property, PropertySlug } from "../properties"
import { getProperty, PHOTO_CATEGORY_LABELS, PROPERTIES } from "../properties"
import type { Locale } from "./types"
import { messages } from "./messages"

type PropertyOverlay = {
  h1: string
  metaTitle: string
  metaDescription: string
  coverAlt: string
  heroPhotoAlt: string
  address: string
  shortLabel: string
  cardFacts: string[]
  availabilitySummary: string
  description: string[]
  availability: Array<{ note: string; rate: string }>
  splitNote?: string
  rateTiers?: Array<{ rate: string; note: string }>
  specs: Array<{ label: string; value: string }>
  advantages: Array<{ label: string; text?: string }>
}

const kkOverlays: Record<PropertySlug, PropertyOverlay> = {
  "time-square": {
    h1: "Алматыдағы Time Square бизнес-орталығы",
    metaTitle: "Time Square — Алматыдағы А класты бизнес-орталықта офис жалдау | TMK WorkFlow",
    metaDescription:
      "Time Square — Алматы, Самал-3-тегі А класты бизнес-орталық. 2 және 3-қабаттарда 900 м²-ден офис блоктары, бірінші қабатта 400 м² коммерция, 72 орындық жер асты паркинг.",
    coverAlt: "Алматыдағы Time Square бизнес-орталығы, Іле Алатауы аясында дроннан көрініс",
    heroPhotoAlt:
      "Алматы, Самал-3 шағын ауданындағы А класты Time Square бизнес-орталығы, Іле Алатауына панорама",
    address: "Самал-3 шағын ауданы, 15/1, Алматы",
    shortLabel: "А класс · Самал-3",
    cardFacts: ["900 м²-ден офис блоктары", "Коммерция 400 м²", "Жер асты паркинг"],
    availabilitySummary: "2 және 3-қабаттарда офис блоктары, 1-қабатта коммерция",
    description: [
      "Алматы қаласының үздік локациясындағы А класты жаңа премиум бизнес-орталық. Заманауи инженерия, кәсіби PM және FM қызметтері, кепілдендірілген трафик, жоғары көлік қолжетімділігі және жоғары мәртебе — Time Square-де кепілдендірілген.",
    ],
    availability: [
      { note: "офис блогы, 2-қабат", rate: "25 000 ₸/м²/ай ҚҚС-сыз" },
      { note: "офис блогы, 3-қабат", rate: "25 000 ₸/м²/ай ҚҚС-сыз" },
      { note: "коммерция, 1-қабат", rate: "19 000 ₸/м²/ай ҚҚС-сыз" },
    ],
    splitNote: "Офистер мен коммерциялық алаңды бөлуге болады",
    specs: [
      { label: "Класс", value: "A" },
      { label: "Жалға жарамды алаң", value: "9 800 м²" },
      { label: "Мәртебесі", value: "пайдалануға берілген" },
      { label: "Салынған жылы", value: "2024" },
      { label: "Жалпы алаң", value: "10 000 м²" },
      { label: "Жоспарлау", value: "еркін" },
      { label: "Қабаттылығы", value: "3 қабат" },
      { label: "Төбе биіктігі", value: "3,5–4 м" },
      { label: "Лифтілер", value: "3" },
      { label: "Желдету", value: "кіріс-шығыс" },
      { label: "Кондиционерлеу", value: "орталық" },
      { label: "Жерүсті паркинг", value: "15 орын" },
      { label: "Жер асты паркинг", value: "72 орын" },
    ],
    advantages: [
      { label: "А класс", text: "Үздік бизнес-орталық" },
      { label: "Панорамалық шынылау", text: "Күндізгі жарық көбірек, көшеге жақсы көрініс" },
      { label: "Заманауи инженерлік жүйелер", text: "Және кәсіби FM қызметтері" },
      {
        label: "Жоғары жылдамдықты лифтілер",
        text: "Жүк көтергіштігі 1600 кг, 18 адамға есептелген 3 лифт",
      },
      { label: "Жер асты паркинг", text: "72 көлік орнына" },
      { label: "Тәулік бойы күзет", text: "Қауіпсіздік 24/7" },
      { label: "Кәсіби басқарушы компания", text: "Нарықта 2017 жылдан бері" },
      {
        label: "Дамыған инфрақұрылым",
        text: "Жанында дүкендер, СОО, дәріханалар, банкоматтар, электромобильдерге арналған зарядтау станциялары",
      },
    ],
  },
  venus: {
    h1: "Алматыдағы Venus бизнес-орталығы",
    metaTitle: "Venus — Алматыдағы А класты бизнес-орталықта офис жалдау | TMK WorkFlow",
    metaDescription:
      "Venus — Алматы, Медеу ауданы, Елебеков к. 10/1-дегі А класты бизнес-орталық. 40 және 70 м² кабинеттер, төбе 4 м, келіссөз бөлмелері, жерүсті паркинг.",
    coverAlt: "Алматыдағы Venus бизнес-орталығы, дроннан көрініс",
    heroPhotoAlt: "Алматы, Елебеков к. 10/1-дегі А класты Venus бизнес-орталығы, дроннан тау аясында",
    address: "Елебеков к., 10/1, Медеу ауданы, Алматы",
    shortLabel: "А класс · Медеу ауданы",
    cardFacts: ["Төбе 4 м", "Кабинеттер", "Жерүсті паркинг"],
    availabilitySummary: "Кабинеттер",
    description: [
      "Іскер Алматының қақ ортасындағы сервистік офис, ставка форматы — All inclusive. Келіссөз бөлмелері, акустикалық кабиналар, ESG стандарттары, PropTech инновациялары және дамыған инфрақұрылым сізді күтеді.",
    ],
    availability: [
      { note: "3 кабинет", rate: "25 000 ₸/м²/ай ҚҚС-сыз" },
      { note: "1 кабинет", rate: "25 000 ₸/м²/ай ҚҚС-сыз" },
    ],
    specs: [
      { label: "Класс", value: "A" },
      { label: "Мәртебесі", value: "пайдалануға берілген" },
      { label: "Салынған жылы", value: "2021" },
      { label: "Жоспарлау", value: "кабинеттер" },
      { label: "Төбе биіктігі", value: "4 м" },
      { label: "Лифтілер", value: "2" },
      { label: "Желдету", value: "кіріс-шығыс" },
      { label: "Кондиционерлеу", value: "жергілікті" },
      { label: "Паркинг", value: "жерүсті" },
    ],
    advantages: [
      { label: "А класс" },
      { label: "Төбе биіктігі — 4 м" },
      { label: "Кабинеттік жоспарлау" },
      { label: "2 лифт" },
      { label: "Кіріс-шығыс желдету" },
      { label: "Жергілікті кондиционерлеу" },
      { label: "Жерүсті паркинг" },
    ],
  },
  "koktem-towers": {
    h1: "Алматыдағы Koktem Towers бизнес-орталығы",
    metaTitle: "Koktem Towers — Алматы, Достық 180-дегі А класты офис жалдау | TMK WorkFlow",
    metaDescription:
      "Koktem Towers — Алматы, Достық даңғылы, 180-дегі А класты бизнес-орталық. 3-қабатта 95 м² офис және 9-қабат толығымен — 642 м². Жерүсті және жер асты паркинг.",
    coverAlt: "Алматыдағы Koktem Towers бизнес-орталығының қасбеті",
    heroPhotoAlt: "А класты Koktem Towers бизнес-орталығы, Достық даңғылы 180, Алматы, дроннан көрініс",
    address: "Достық даңғылы, 180, Медеу ауданы, Алматы",
    shortLabel: "А класс · Достық даңғылы",
    cardFacts: ["Open Space / кабинеттер", "9-қабат толығымен — 642 м²", "Жерүсті және жер асты паркинг"],
    availabilitySummary: "3-қабаттағы офис және 9-қабат толығымен",
    description: [
      "Қаланың CBD аймағындағы культтік нысан, Big 4 консалтингтік компаниялары мен FMCG көшбасшыларының таңдауы, орналасуы жағынан да, форматтардың кең таңдауы жағынан да ұзақ мерзімді жалгер үшін мінсіз шешім.",
    ],
    availability: [
      { note: "3-қабат, 3 кабинет", rate: "18 000 ₸/м²/ай ҚҚС-сыз" },
      { note: "9-қабат толығымен", rate: "18 000 ₸/м²/ай ҚҚС-сыз" },
    ],
    rateTiers: [
      { rate: "18 000 ₸/м²/ай ҚҚС-сыз", note: "жоспарлауды өзгертпей базалық жөндеу" },
      { rate: "21 000 ₸/м²/ай ҚҚС-сыз", note: "ТТ бойынша жөндеу + клининг" },
      { rate: "25 000 ₸/м²/ай ҚҚС-сыз", note: "сервистік офис" },
    ],
    specs: [
      { label: "Класс", value: "A" },
      { label: "Мәртебесі", value: "пайдалануға берілген" },
      { label: "Салынған жылы", value: "2011" },
      { label: "Жоспарлау", value: "Open Space / кабинеттер" },
      { label: "Лифтілер", value: "3" },
      { label: "Желдету", value: "кіріс-шығыс" },
      { label: "Кондиционерлеу", value: "орталық" },
      { label: "Паркинг", value: "жерүсті — қонақтарға, жер асты — жалгерлерге" },
    ],
    advantages: [
      { label: "А класс" },
      { label: "Open Space және кабинеттік жоспарлау" },
      { label: "3 лифт" },
      { label: "Кіріс-шығыс желдету" },
      { label: "Орталық кондиционерлеу" },
      { label: "Жерүсті қонақ және жер асты паркинг" },
    ],
  },
}

const kkEcosystem = {
  title: "TMK WorkFlow — жалға алудан да артық",
  paragraphs: [
    "TMK — жай ғана жалға беруші емес, жұмыс істеп тұрған бизнес-экожүйеге кіру нүктесі. TMK WorkFlow-та офис жалдай отырып, компания топтың серіктестік желісіне қол жеткізеді: бөлшек сауда, автобизнес, қаржы, сервистер — бір-біріне ұсынары бар жалгерлерге ортақ тіл табуға көмектесеміз. TMK әкімшілік ресурсы бейінді құрылымдарға шығуды және бірінші тұлғалар деңгейіндегі келіссөздерді сүйемелдеуді ашады — идеядан қол қойылған уағдаластықтарға дейін. Экожүйе ішінде нақты ақшалай және клиенттік ағындар қалыптасады: бизнесіңіздің айналымы ғимараттағы көршілердің айналымымен бірге өседі.",
    "Растау — уәде емес, болған мәмілелер: офис жалдау кросс-инвестициялар мен бірлескен компанияға (Qaitadan, TMK Techno Horizon), жиһаз жеткізу учаскені игеруге (Pomo Design Center), МҚҰ офисін жалдау Doscar Group автодилерімен қаржылық әріптестікке ұласты.",
    "Қосымша WorkFlow жалгерлері топтың digital- және маркетинг-аудиттеріне басым қолжетімділік алады — бизнестің өсу нүктелерін диагностикалау көшу кезеңінен-ақ басталады.",
  ],
}

function applyOverlay(property: Property, overlay: PropertyOverlay): Property {
  return {
    ...property,
    h1: overlay.h1,
    metaTitle: overlay.metaTitle,
    metaDescription: overlay.metaDescription,
    coverAlt: overlay.coverAlt,
    heroPhotoAlt: overlay.heroPhotoAlt,
    address: overlay.address,
    shortLabel: overlay.shortLabel,
    cardFacts: overlay.cardFacts,
    availabilitySummary: overlay.availabilitySummary,
    description: overlay.description,
    availability: property.availability.map((item, index) => ({
      ...item,
      note: overlay.availability[index]?.note ?? item.note,
      rate: overlay.availability[index]?.rate ?? item.rate,
    })),
    splitNote: overlay.splitNote ?? property.splitNote,
    rateTiers: property.rateTiers?.map((tier, index) => ({
      rate: overlay.rateTiers?.[index]?.rate ?? tier.rate,
      note: overlay.rateTiers?.[index]?.note ?? tier.note,
    })),
    specs: property.specs.map((spec, index) => ({
      label: overlay.specs[index]?.label ?? spec.label,
      value: overlay.specs[index]?.value ?? spec.value,
    })),
    advantages: property.advantages.map((item, index) => ({
      ...item,
      label: overlay.advantages[index]?.label ?? item.label,
      text: overlay.advantages[index]?.text ?? item.text,
    })),
  }
}

export function getLocalizedProperty(slug: PropertySlug, locale: Locale): Property {
  const property = getProperty(slug)
  if (locale === "ru") return property
  return applyOverlay(property, kkOverlays[slug])
}

export function getLocalizedProperties(locale: Locale): Property[] {
  return PROPERTIES.map((property) => getLocalizedProperty(property.slug, locale))
}

export function getLocalizedEcosystem(locale: Locale) {
  if (locale === "ru") {
    return {
      title: "TMK WorkFlow — больше, чем аренда",
      paragraphs: [
        "TMK — не просто арендодатель, а точка входа в работающую бизнес-экосистему. Арендуя офис в TMK WorkFlow, компания получает доступ к партнёрской сети группы: ретейл, автобизнес, финансы, сервисы — арендаторам, которым есть что предложить друг другу, мы помогаем найти общий язык. Административный ресурс TMK открывает выход на профильные структуры и сопровождение переговоров на уровне первых лиц — от идеи до подписанных договорённостей. Внутри экосистемы выстраиваются реальные денежные и клиентские потоки: оборот вашего бизнеса растёт вместе с оборотами соседей по зданию.",
        "Подтверждение — не обещания, а состоявшиеся сделки: аренда офиса переросла в кросс-инвестиции и совместную компанию (Qaitadan, TMK Techno Horizon), поставка мебели — в девелопмент участка (Pomo Design Center), аренда офиса МФО — в финансовое партнёрство с автодилером Doscar Group.",
        "Дополнительно арендаторы WorkFlow получают приоритетный доступ к digital- и маркетинг-аудитам группы — диагностика точек роста бизнеса начинается уже на этапе переезда.",
      ],
    }
  }
  return kkEcosystem
}

export function getPhotoCategoryLabel(category: PhotoCategory, locale: Locale): string {
  if (locale === "ru") return PHOTO_CATEGORY_LABELS[category]
  return messages.kk.photoCategories[category] ?? PHOTO_CATEGORY_LABELS[category]
}
