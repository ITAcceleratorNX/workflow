export interface OfficeImage {
  src: string
  alt: string
}

export interface OfficeDetails {
  id: number
  name: string
  mainImage: string
  images: OfficeImage[] // Карусель изображений
  location: string
  address: string
  class?: string
  year?: string
  rentableArea?: string
  totalBlockArea?: string
  capacity?: string
  cost: string
  format: string
  // Подробная информация
  detailedInfo: {
    areaAndFormat?: {
      rentableArea?: string
      totalBlockArea?: string
      format: string
    }
    building?: {
      class?: string
      year?: string
      totalArea?: string
      location?: string
      floors?: string
    }
    infrastructure?: string[]
    included?: string[]
    engineering?: string[]
    parking?: string[]
    environment?: string[]
    usageScenario?: string[]
  }
}

export const officesData: OfficeDetails[] = [
  {
    id: 1,
    name: "Venus",
    mainImage: "/venus.jpg",
    images: [
      { src: "/Venus/TMK_11292.jpg", alt: "Venus офис - вид 1" },
      { src: "/Venus/TMK_11297.jpg", alt: "Venus офис - вид 2" },
      { src: "/Venus/TMK_11311.jpg", alt: "Venus офис - вид 3" },
      { src: "/Venus/TMK_11348.jpg", alt: "Venus офис - вид 4" },
      { src: "/Venus/TMK_11352.jpg", alt: "Venus офис - вид 5" },
      { src: "/Venus/TMK_11257.jpg", alt: "Venus офис - вид 6" },
      { src: "/Venus/TMK_11397.jpg", alt: "Venus офис - вид 7" },
      { src: "/Venus/TMK_11435.jpg", alt: "Venus офис - вид 8" },
      { src: "/Venus/TMK_11439.jpg", alt: "Venus офис - вид 9" },
    ],
    location: "Алматы",
    address: "ул. Елебекова 10/1",
    class: "B+",
    year: "2021",
    rentableArea: "1 900 м²",
    totalBlockArea: "2 100 м²",
    capacity: "~200 рабочих мест",
    cost: "по запросу",
    format: "all inclusive",
    detailedInfo: {
      areaAndFormat: {
        rentableArea: "1 900 м²",
        totalBlockArea: "2 100 м²",
        format: "all inclusive с фиксированным составом услуг"
      },
      building: {
        class: "B+",
        year: "2021",
        totalArea: "22 000 м²",
        location: "Алматы, Медеуский район"
      },
      infrastructure: [
        "6 переговорных комнат",
        "10 Zoom-будок",
        "3 кухни",
        "Мягкие зоны на каждом этаже"
      ],
      included: [
        "Эксплуатационные расходы",
        "Коммунальные услуги",
        "Интернет",
        "Ежедневная уборка",
        "Базовое обслуживание офиса",
        "Сервис по SLA"
      ]
    }
  },
  {
    id: 2,
    name: "Koktem Towers",
    mainImage: "/koktem-towers.png",
    images: [
      { src: "/Koktem Tower/TMK_11441.jpg", alt: "Koktem Towers офис - вид 1" },
      { src: "/Koktem Tower/TMK_11442.jpg", alt: "Koktem Towers офис - вид 2" },
      { src: "/Koktem Tower/TMK_11444.jpg", alt: "Koktem Towers офис - вид 3" },
      { src: "/Koktem Tower/TMK_11445.jpg", alt: "Koktem Towers офис - вид 4" },
      { src: "/Koktem Tower/TMK_11450.jpg", alt: "Koktem Towers офис - вид 5" },
    ],
    location: "Алматы",
    address: "пр. Достык",
    class: "B+",
    year: "2005",
    totalBlockArea: "~5 148 м²",
    cost: "по запросу",
    format: "офисные пространства для корпоративных арендаторов",
    detailedInfo: {
      areaAndFormat: {
        totalBlockArea: "около 5 148 м²",
        format: "офисные блоки под корпоративные и представительские офисы"
      },
      building: {
        class: "B+",
        year: "2005",
        totalArea: "около 5 148 м²",
        location: "Алматы, Медеуский район, пр. Достык",
        floors: "13 этажей"
      },
      engineering: [
        "Приточно-вытяжная вентиляция",
        "Центральное кондиционирование",
        "Локальные системы кондиционирования"
      ],
      parking: [
        "Наземный паркинг",
        "Подземный паркинг"
      ],
      included: [
        "Эксплуатационные расходы",
        "Коммунальные услуги",
        "Интернет",
        "Ежедневная уборка",
        "Базовое обслуживание офиса",
        "Сервис по SLA"
      ]
    }
  },
  {
    id: 3,
    name: "Teniz Towers",
    mainImage: "/teniz-towers.jpg",
    images: [
      { src: "/teniz-towers.jpg", alt: "Teniz Towers офис - вид 1" },
      { src: "/venus.jpg", alt: "Teniz Towers офис - вид 2" },
      { src: "/koktem-towers.png", alt: "Teniz Towers офис - вид 3" },
      { src: "/orion.jpg", alt: "Teniz Towers офис - вид 4" },
    ],
    location: "Алматы",
    address: "пр. Назарбаева 240Г",
    totalBlockArea: "~12 767 м²",
    cost: "по запросу",
    format: "офисные блоки, возможна передача с ремонтом и мебелью",
    detailedInfo: {
      areaAndFormat: {
        totalBlockArea: "порядка 12 767 м²",
        format: "в текущем состоянии либо с ремонтом и мебелью под срок заезда"
      },
      building: {
        totalArea: "порядка 12 767 м²",
        location: "Алматы, пр. Назарбаева 240Г",
        floors: "11 этажей"
      },
      environment: [
        "Развитая городская инфраструктура",
        "Сервисы и точки питания в пешей доступности"
      ],
      engineering: [
        "Инженерные системы офисного уровня",
        "Базовая система климата"
      ],
      usageScenario: [
        "штаб-квартиру",
        "офис продаж",
        "региональный офис"
      ]
    }
  },
  {
    id: 4,
    name: "Orion",
    mainImage: "/orion.jpg",
    images: [
      { src: "/orion.jpg", alt: "Orion офис - вид 1" },
      { src: "/teniz-towers.jpg", alt: "Orion офис - вид 2" },
      { src: "/venus.jpg", alt: "Orion офис - вид 3" },
    ],
    location: "Алматы",
    address: "деловой контур города",
    rentableArea: "300 м²",
    cost: "по запросу",
    format: "компактный корпоративный офис",
    detailedInfo: {
      areaAndFormat: {
        rentableArea: "300 м²",
        format: "офис с возможностью адаптации пространства под бренд"
      },
      building: {
        location: "Деловой контур Алматы"
      },
      usageScenario: [
        "Корпоративный офис",
        "Баланс представительских зон и рабочих пространств",
        "Управляемая эксплуатация"
      ],
      engineering: [
        "Инженерные системы офисного стандарта"
      ],
      parking: [
        "Паркинг — по запросу",
        "Гостевой режим — по запросу",
        "Условия фиксируются в рамках сделки"
      ]
    }
  }
]
