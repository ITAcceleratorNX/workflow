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
  cardBlurb: string
  description: string[]
  availability: Array<{ note: string; rate: string }>
  variantsNote?: string
  splitNote?: string
  specs: Array<{ label: string; value: string }>
  advantages: string[]
}

const kkOverlays: Record<PropertySlug, PropertyOverlay> = {
  "time-square": {
    h1: "Алматыдағы Time Square бизнес-орталығы",
    metaTitle: "Time Square — Алматыдағы А класты бизнес-орталықта офис жалдау | TMK WorkFlow",
    metaDescription:
      "Time Square — Алматы, Самал-3-тегі А класты бизнес-орталық. Бос ≈ 3 800 м²: коммерция және офис блоктары, жер асты паркинг, тау панорамасы.",
    coverAlt: "Іле Алатауы таулары аясындағы Алматыдағы Time Square бизнес-орталығының қасбеті",
    heroPhotoAlt:
      "Алматы, Самал-3 шағын ауданындағы А класты Time Square бизнес-орталығы, Іле Алатауына панорама",
    address: "Самал-3 шағын ауданы, 15/1, Алматы",
    shortLabel: "А класс · Самал-3",
    cardBlurb:
      "Әл-Фарабидегі А класты премиум БО. Бос ≈ 3 800 м² — коммерция және офис блоктары, жер асты паркинг, тау көрінісі.",
    description: [
      "Time Square — Әл-Фараби мен Мендіқұлов қиылысындағы, Іле Алатауына панорамасы бар А класты заманауи премиум бизнес-орталық.",
      "Бірінші қабат — шыны күмбезді аса биік атриумды, мүсіндік арт-инсталляциясы және жоғары жаяу ағынды кешеннің кіреберіс тобы.",
      "Жалға бос — шамамен 3 800 м²: бірінші қабаттағы 400 м² коммерциялық үй-жай және 2–3-қабаттардағы екі офис блогы. Офистер қабатпен, блокпен немесе екі блокпен бірден беріледі — кез келген көлемдегі компанияға сай.",
    ],
    availability: [
      { note: "коммерциялық үй-жай, 1-қабат", rate: "19 000 ₸/м²/ай ҚҚС-сыз" },
      { note: "офис блогындағы бір қабат", rate: "21 550 ₸/м²/ай ҚҚС-сыз" },
      { note: "офис блогы толығымен, екі қабат", rate: "21 550 ₸/м²/ай ҚҚС-сыз" },
      { note: "екі офис блогы", rate: "21 550 ₸/м²/ай ҚҚС-сыз" },
    ],
    variantsNote:
      "850, 1 700 және 3 400 м² — бір көлемнің нұсқалары: блоктағы қабат, блок толығымен немесе екі блок. Офис блоктары 2 және 3-қабаттарды алады, бұл алаңдарды бір мезгілде жалға алуға болмайды, оларды қосудың қажеті жоқ.",
    splitNote: "Сұранысқа сай 300 м²-ден бастап бөлеміз",
    specs: [
      { label: "Жалпы алаң (GBA)", value: "10 000 м²" },
      { label: "Бос алаң", value: "≈ 3 800 м²" },
      { label: "Офистерге", value: "3 400 м² — 2 және 3-қабаттардағы екі блок" },
      { label: "Коммерцияға", value: "бірінші қабаттағы 400 м²" },
      { label: "Класс", value: "А" },
      { label: "Салынған жылы", value: "2024" },
      { label: "Қабаттылығы", value: "3" },
      {
        label: "Төбе биіктігі",
        value: "офис блоктарында 3,5 м, коммерциялық үй-жайда 4 м",
      },
      { label: "Паркинг", value: "жер асты, 72 орын" },
    ],
    advantages: [
      "А класс",
      "Панорамалық шынылау",
      "Заманауи инженерлік жүйелер",
      "Жоғары жылдамдықты лифтілер",
      "Жер асты паркинг",
      "Тәулік бойы күзет",
      "Кәсіби басқарушы компания",
      "Дамыған инфрақұрылым",
    ],
  },
  venus: {
    h1: "Алматыдағы Venus бизнес-орталығы",
    metaTitle: "Venus — Алматыдағы А класты бизнес-орталықта офис жалдау | TMK WorkFlow",
    metaDescription:
      "Venus — Алматы, Медеу ауданы, Елебеков к. 10/1-дегі А класты бизнес-орталық. Open Space және кабинеттік жоспарлау, төбе 3,9 м, 85 орынды жерүсті паркинг.",
    coverAlt: "Алматыдағы Venus бизнес-орталығының қасбеті",
    heroPhotoAlt: "Алматы, Елебеков к. 10/1-дегі А класты Venus бизнес-орталығы, дроннан тау аясында",
    address: "Елебеков к., 10/1, Медеу ауданы, Алматы",
    shortLabel: "А класс · Медеу ауданы",
    cardBlurb:
      "Медеу ауданындағы А класты БО. Open Space және кабинеттер, төбе 3,9 м, жерүсті паркинг — кез келген форматтағы командаға ыңғайлы.",
    description: [
      "Venus — Алматының беделді Медеу ауданында, Елебеков к., 10/1 мекенжайында орналасқан А класты заманауи бизнес-орталық.",
      "Қаланың негізгі көлік магистральдарына жақын орналасуының арқасында бизнес-орталық қызметкерлер мен қонақтар үшін ыңғайлы қолжетімділікті қамтамасыз етеді.",
      "Кабинеттік және ашық (Open Space) жоспарлауы бар заманауи офис үй-жайлары. Ғимарат заманауи инженерлік жүйелермен, орталық кондиционерлеумен, кіріс-шығыс желдетумен және өз паркингімен жабдықталған.",
    ],
    availability: [
      { note: "офис блогы", rate: "21 500 ₸/м²/ай ҚҚС-сыз" },
      { note: "офис блогы", rate: "21 500 ₸/м²/ай ҚҚС-сыз" },
    ],
    specs: [
      { label: "Жалпы алаң (GBA)", value: "22 000 м²" },
      { label: "Жалға жарамды алаң", value: "19 130 м²" },
      { label: "Бос", value: "120 м²" },
      { label: "Класс", value: "А" },
      { label: "Салынған жылы", value: "2021" },
      { label: "Қабаттылығы", value: "3" },
      { label: "Төбе биіктігі", value: "3,9 м" },
      { label: "Жоспарлау", value: "Open Space, кабинеттік" },
      { label: "Сейсмотұрақтылық", value: "9 балл" },
      { label: "Желдету", value: "кіріс-шығыс" },
      { label: "Кондиционерлеу", value: "орталық және жергілікті" },
      { label: "Паркинг", value: "жерүсті, 85 орын" },
    ],
    advantages: [
      "А класс",
      "Медеу ауданындағы ыңғайлы орналасу",
      "Заманауи инженерлік жүйелер",
      "Орталық кондиционерлеу",
      "Кіріс-шығыс желдету",
      "Биік төбелер — 3,9 м",
      "Open Space және кабинеттік жоспарлау",
      "Жерүсті паркинг",
      "Дамыған инфрақұрылым",
    ],
  },
  "koktem-towers": {
    h1: "Алматыдағы Koktem Towers бизнес-орталығы",
    metaTitle: "Koktem Towers — Алматы, Достық 180-дегі А класты офис жалдау | TMK WorkFlow",
    metaDescription:
      "Koktem Towers — «Абай» метросына жақын Достық даңғылы, 180-дегі А класты бизнес-орталық. Тоғызыншы қабат толығымен бос — 643 м². Жерүсті және жер асты паркинг.",
    coverAlt: "Алматыдағы Koktem Towers бизнес-орталығының қасбеті",
    heroPhotoAlt: "А класты Koktem Towers бизнес-орталығы, Достық даңғылы 180, Алматы",
    address: "Достық даңғылы, 180, Медеу ауданы, Алматы",
    shortLabel: "А класс · Достық даңғылы",
    cardBlurb:
      "Достықтағы А класты БО, «Абай» метросына жақын. 9-қабат толығымен бос — 643 м², жерүсті және жер асты паркинг.",
    description: [
      "Koktem Towers — Алматының беделді Медеу ауданында, Достық даңғылы, 180 мекенжайында орналасқан А класты заманауи бизнес-орталық. «Абай» метро станциясы мен қаланың негізгі көлік магистральдарына жақын орналасуының арқасында қызметкерлер мен клиенттер үшін ыңғайлы көлік қолжетімділігін қамтамасыз етеді.",
      "Нысан 2005 жылы пайдалануға берілген және кабинеттік әрі ашық (Open Space) жоспарлауы бар заманауи офис үй-жайларын ұсынады. Бизнес-орталық заманауи инженерлік жүйелермен, орталық және жергілікті кондиционерлеумен, кіріс-шығыс желдетумен, лифтілермен және өз паркингімен жабдықталған.",
    ],
    availability: [{ note: "тоғызыншы қабат толығымен, офистер", rate: "21 500 ₸/м²/ай ҚҚС-сыз" }],
    splitNote: "Сұранысқа сай 100 м²-ден бастап бөлеміз",
    specs: [
      { label: "Жалпы алаң (GBA)", value: "5 148 м²" },
      { label: "Жалға жарамды алаң", value: "4 752 м²" },
      { label: "Типтік қабат мөлшері", value: "396 м²" },
      { label: "Класс", value: "А" },
      { label: "Салынған жылы", value: "2005" },
      { label: "Қабаттылығы", value: "13" },
      { label: "Төбе биіктігі", value: "2,8 м" },
      { label: "Жоспарлау", value: "Open Space, кабинеттік" },
      { label: "Сейсмотұрақтылық", value: "9 балл" },
      { label: "Желдету", value: "кіріс-шығыс" },
      { label: "Кондиционерлеу", value: "орталық және жергілікті" },
      { label: "Жерүсті паркинг", value: "70 орын" },
      { label: "Жер асты паркинг", value: "46 орын" },
    ],
    advantages: [
      "А класс",
      "Достық даңғылындағы беделді орналасу",
      "«Dostyk Plaza» СОО-на жақындық",
      "Open Space және кабинеттік жоспарлау",
      "Заманауи инженерлік жүйелер",
      "Орталық және жергілікті кондиционерлеу",
      "Кіріс-шығыс желдету",
      "Жерүсті және жер асты паркинг",
      "Дамыған инфрақұрылым",
      "Ыңғайлы көлік қолжетімділігі",
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
    cardBlurb: overlay.cardBlurb,
    description: overlay.description,
    availability: property.availability.map((item, index) => ({
      ...item,
      note: overlay.availability[index]?.note ?? item.note,
      rate: overlay.availability[index]?.rate ?? item.rate,
    })),
    variantsNote: overlay.variantsNote ?? property.variantsNote,
    splitNote: overlay.splitNote ?? property.splitNote,
    specs: property.specs.map((spec, index) => ({
      label: overlay.specs[index]?.label ?? spec.label,
      value: overlay.specs[index]?.value ?? spec.value,
    })),
    advantages: property.advantages.map((item, index) => ({
      ...item,
      label: overlay.advantages[index] ?? item.label,
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
