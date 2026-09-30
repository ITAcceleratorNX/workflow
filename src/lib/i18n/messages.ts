import type { Locale } from "./types"

export interface Messages {
  nav: {
    objects: string
    contactUs: string
    openMenu: string
    closeMenu: string
    call: string
    tagline: string
  }
  footer: {
    about: string
    objects: string
    contacts: string
    rights: string
    privacy: string
  }
  common: {
    whatsapp: string
    selectOffice: string
    bookViewing: string
    sendRequest: string
    submitting: string
    orCall: string
    closeForm: string
    privacyPolicy: string
    privacyConsent: string
    privacyConsentPrefix: string
    privacyConsentSuffix: string
    withoutVat: string
  }
  home: {
    seoTitle: string
    seoDescription: string
    objectsEyebrow: string
    objectsTitle: string
    objectsDescription: string
    viewObject: string
    mapEyebrow: string
    mapTitle: string
    mapDescription: string
    viewingEyebrow: string
    viewingTitle: string
    viewingDescription: string
  }
  hero: {
    eyebrow: string
    title: string
    titleAccent: string
    description: string
    cta: string
    objectsLine: string
  }
  formats: {
    eyebrow: string
    title: string
    description: string
    cards: Array<{ title: string; text: string; imageAlt: string }>
  }
  property: {
    about: string
    address: string
    availabilityEyebrow: string
    availabilityTitle: string
    specsEyebrow: string
    specsTitle: string
    advantagesEyebrow: string
    advantagesTitle: string
    galleryEyebrow: string
    galleryTitle: string
    galleryHint: string
    showAllPhotos: string
    otherEyebrow: string
    otherTitle: string
    otherDescription: string
    viewingTitle: string
    selectAreaAria: string
    allPhotos: string
  }
  form: {
    name: string
    company: string
    phone: string
    email: string
    property: string
    propertyPlaceholder: string
    comment: string
    commentPlaceholder: string
    namePlaceholder: string
    companyPlaceholder: string
    emailPlaceholder: string
    nameRequired: string
    phoneRequired: string
    phoneIncomplete: string
    emailInvalid: string
    propertyRequired: string
    propertyInvalid: string
    consentRequired: string
    success: string
    errorRetry: string
    writeWhatsApp: string
    honeypot: string
  }
  leadModal: {
    heroSelect: { title: string; description: string }
    homeSelect: { title: string; description: string }
    serviced: { title: string; description: string }
    viewing: { title: string; description: string }
    headerContact: { title: string; description: string }
    propertyContact: { title: string; description: string }
    footerContact: { title: string; description: string }
  }
  whatsappGate: {
    title: string
    description: string
    submit: string
    fallbackHint: string
    openWhatsApp: string
    consent: string
    phoneError: string
  }
  photoCategories: Record<string, string>
  notFound: {
    title: string
    description: string
    home: string
  }
  privacy: {
    title: string
    seoTitle: string
    seoDescription: string
  }
}

const ru: Messages = {
  nav: {
    objects: "Объекты",
    contactUs: "Связаться с нами",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    call: "Позвонить",
    tagline: "Коммерческая недвижимость",
  },
  footer: {
    about:
      "Офисные и коммерческие помещения в Алматы. Подберём формат под задачи вашей компании и сопроводим от заявки до заезда.",
    objects: "Объекты",
    contacts: "Контакты",
    rights: "Все права защищены.",
    privacy: "Политика конфиденциальности",
  },
  common: {
    whatsapp: "WhatsApp",
    selectOffice: "Подобрать офис",
    bookViewing: "Записаться на просмотр",
    sendRequest: "Отправить заявку",
    submitting: "Отправляем…",
    orCall: "Или позвоните:",
    closeForm: "Закрыть форму",
    privacyPolicy: "политикой конфиденциальности",
    privacyConsent: "Я согласен на обработку персональных данных в соответствии с",
    privacyConsentPrefix: "Я согласен на обработку персональных данных в соответствии с",
    privacyConsentSuffix: ".",
    withoutVat: "без НДС",
  },
  home: {
    seoTitle: "TMK WorkFlow — офисы и коммерческие помещения в аренду в Алматы",
    seoDescription:
      "Аренда офисов в Алматы: бизнес-центры Time Square, Venus и Koktem Towers класса А. Подберём объект и формат офиса под задачи компании.",
    objectsEyebrow: "Бизнес-центры",
    objectsTitle: "Выберите объект",
    objectsDescription:
      "Три бизнес-центра класса А в Алматы — откройте страницу, чтобы посмотреть площади, ставки и фото.",
    viewObject: "Смотреть",
    mapEyebrow: "Подбор офиса",
    mapTitle: "Не знаете, какой офис выбрать?",
    mapDescription:
      "Оставьте заявку — подберём подходящий бизнес-центр и формат офиса под задачи вашей компании.",
    viewingEyebrow: "Запись на просмотр",
    viewingTitle: "Посмотрите вживую",
    viewingDescription:
      "Оставьте заявку — согласуем удобное время, покажем свободные помещения и ответим на вопросы по условиям аренды.",
  },
  hero: {
    eyebrow: "КОММЕРЧЕСКАЯ НЕДВИЖИМОСТЬ · АЛМАТЫ",
    title: "Офисы для бизнеса",
    titleAccent: "в Алматы",
    description:
      "Подберём офис, сервисное пространство или решение под ключ под задачи вашей компании. Сопроводим от заявки до заезда.",
    cta: "Подобрать офис",
    objectsLine: "Time Square · Venus · Koktem Towers",
  },
  formats: {
    eyebrow: "ФОРМАТЫ ОФИСНЫХ РЕШЕНИЙ",
    title: "Под разные задачи бизнеса",
    description:
      "Эти форматы помогают точнее описать запрос в заявке — выбор формата не ограничивает каталог.",
    cards: [
      {
        title: "Офис",
        text: "Классический офис в бизнес-центре под аренду: выбираете площадь и этаж под структуру команды.",
        imageAlt: "Современное офисное пространство с зоной отдыха и переговорными",
      },
      {
        title: "Сервисный офис",
        text: "Готовое рабочее пространство с мебелью, инфраструктурой и обслуживанием — можно заехать быстрее.",
        imageAlt: "Сервисный офис с мебелью и лаунж-зоной",
      },
      {
        title: "Офис под ключ",
        text: "Решение под задачи бизнеса: подбор, планировка и подготовка пространства к заезду.",
        imageAlt: "Свободное помещение под отделку офиса под ключ",
      },
    ],
  },
  property: {
    about: "Об объекте",
    address: "Адрес",
    availabilityEyebrow: "Свободно к аренде",
    availabilityTitle: "Доступные площади",
    specsEyebrow: "Характеристики",
    specsTitle: "Краткая карточка объекта",
    advantagesEyebrow: "Преимущества",
    advantagesTitle: "Основные преимущества",
    galleryEyebrow: "Фотографии",
    galleryTitle: "Как выглядит",
    galleryHint: "Нажмите на фотографию, чтобы открыть её в увеличенном виде.",
    showAllPhotos: "Показать все фото",
    otherEyebrow: "Другие объекты",
    otherTitle: "Другие бизнес-центры TMK WorkFlow",
    otherDescription:
      "Откройте страницу объекта, чтобы посмотреть свободные площади, характеристики и фотографии.",
    viewingTitle: "Посмотрите {name} вживую",
    selectAreaAria: "Выбрать площадь {area} и записаться на просмотр",
    allPhotos: "Все",
  },
  form: {
    name: "Имя",
    company: "Компания",
    phone: "Телефон",
    email: "Email",
    property: "Интересующий объект",
    propertyPlaceholder: "Выберите объект",
    comment: "Комментарий",
    commentPlaceholder: "Нужная площадь, сроки заезда, пожелания",
    namePlaceholder: "Как к вам обращаться",
    companyPlaceholder: "Название компании",
    emailPlaceholder: "name@company.kz",
    nameRequired: "Укажите имя",
    phoneRequired: "Укажите телефон",
    phoneIncomplete: "Введите номер полностью: +7 (___) ___-__-__",
    emailInvalid: "Проверьте адрес электронной почты",
    propertyRequired: "Выберите объект",
    propertyInvalid: "Выберите объект из списка",
    consentRequired: "Необходимо согласие на обработку персональных данных",
    success: "Спасибо! Заявка успешно отправлена. Наш менеджер свяжется с вами в ближайшее время",
    errorRetry:
      "Попробуйте отправить ещё раз или напишите нам в WhatsApp — ответим быстро.",
    writeWhatsApp: "Написать в WhatsApp",
    honeypot: "Не заполняйте это поле",
  },
  leadModal: {
    heroSelect: {
      title: "Подобрать офис",
      description: "Оставьте контакты — подберём подходящие варианты и вернёмся с предложением.",
    },
    homeSelect: {
      title: "Подобрать офис",
      description:
        "Оставьте заявку — подберём подходящий бизнес-центр и формат офиса под задачи вашей компании.",
    },
    serviced: {
      title: "Подобрать сервисный офис",
      description: "Расскажем о свободных сервисных пространствах и условиях заезда.",
    },
    viewing: {
      title: "Записаться на просмотр",
      description: "Согласуем удобное время и покажем свободные помещения.",
    },
    headerContact: {
      title: "Связаться с нами",
      description: "Оставьте заявку — менеджер свяжется с вами в ближайшее время.",
    },
    propertyContact: {
      title: "Связаться с нами",
      description: "Оставьте заявку — менеджер свяжется с вами в ближайшее время.",
    },
    footerContact: {
      title: "Связаться с нами",
      description: "Оставьте заявку — менеджер свяжется с вами в ближайшее время.",
    },
  },
  whatsappGate: {
    title: "Оставьте телефон, чтобы связаться в WhatsApp",
    description: "Мы откроем WhatsApp после отправки телефона",
    submit: "Перейти в WhatsApp",
    fallbackHint: "Если WhatsApp не открылся автоматически, нажмите кнопку ниже.",
    openWhatsApp: "Открыть WhatsApp",
    consent: "Нажимая кнопку, вы соглашаетесь на обработку персональных данных",
    phoneError: "Введите номер полностью: +7 (___) ___-__-__",
  },
  photoCategories: {
    facade: "Фасад с дрона",
    entrance: "Входная группа",
    hall: "Холл",
    offices: "Офисы",
    elevators: "Лифты",
    common: "Общие зоны",
    parking: "Паркинг",
    renders: "Рендеры проекта",
    infrastructure: "Инфраструктура",
  },
  notFound: {
    title: "Страница не найдена",
    description: "Такой страницы нет. Вернитесь на главную или выберите объект.",
    home: "На главную",
  },
  privacy: {
    title: "Политика конфиденциальности",
    seoTitle: "Политика конфиденциальности | TMK WorkFlow",
    seoDescription: "Политика обработки персональных данных сайта TMK WorkFlow.",
  },
}

const kk: Messages = {
  nav: {
    objects: "Нысандар",
    contactUs: "Бізбен байланысу",
    openMenu: "Мәзірді ашу",
    closeMenu: "Мәзірді жабу",
    call: "Қоңырау шалу",
    tagline: "Коммерциялық жылжымайтын мүлік",
  },
  footer: {
    about:
      "Алматыдағы офистік және коммерциялық үй-жайлар. Компанияңыздың міндеттеріне сай форматты таңдап, өтінімнен кіруге дейін бірге жүреміз.",
    objects: "Нысандар",
    contacts: "Байланыс",
    rights: "Барлық құқықтар қорғалған.",
    privacy: "Құпиялылық саясаты",
  },
  common: {
    whatsapp: "WhatsApp",
    selectOffice: "Офис таңдау",
    bookViewing: "Қарауға жазылу",
    sendRequest: "Өтінім жіберу",
    submitting: "Жіберілуде…",
    orCall: "Немесе қоңырау шалыңыз:",
    closeForm: "Форманы жабу",
    privacyPolicy: "құпиялылық саясатымен",
    privacyConsent: "Жеке деректерді өңдеуге",
    privacyConsentPrefix: "Жеке деректерді өңдеуге",
    privacyConsentSuffix: " келісемін.",
    withoutVat: "ҚҚС-сыз",
  },
  home: {
    seoTitle: "TMK WorkFlow — Алматыдағы жалға берілетін офистер мен коммерциялық үй-жайлар",
    seoDescription:
      "Алматыдағы офис жалдау: Time Square, Venus және Koktem Towers А класты бизнес-орталықтары. Компания міндеттеріне сай нысан мен форматты таңдаймыз.",
    objectsEyebrow: "Бизнес-орталықтар",
    objectsTitle: "Нысанды таңдаңыз",
    objectsDescription:
      "Алматыдағы А класты үш бизнес-орталық — алаңдарды, ставкаларды және фотоларды көру үшін бетті ашыңыз.",
    viewObject: "Қарау",
    mapEyebrow: "Офис таңдау",
    mapTitle: "Қай офисті таңдау керектігін білмейсіз бе?",
    mapDescription:
      "Өтінім қалдырыңыз — компанияңыздың міндеттеріне сай бизнес-орталық пен офис форматын таңдаймыз.",
    viewingEyebrow: "Қарауға жазылу",
    viewingTitle: "Өз көзіңізбен қараңыз",
    viewingDescription:
      "Өтінім қалдырыңыз — ыңғайлы уақытты келісіп, бос үй-жайларды көрсетеміз және жалға алу шарттары бойынша сұрақтарға жауап береміз.",
  },
  hero: {
    eyebrow: "КОММЕРЦИЯЛЫҚ ЖЫЛЖЫМАЙТЫН МҮЛІК · АЛМАТЫ",
    title: "Бизнеске арналған офистер",
    titleAccent: "Алматыда",
    description:
      "Компанияңыздың міндеттеріне сай офис, сервистік кеңістік немесе кілтпен дайын шешімді таңдаймыз. Өтінімнен кіруге дейін бірге жүреміз.",
    cta: "Офис таңдау",
    objectsLine: "Time Square · Venus · Koktem Towers",
  },
  formats: {
    eyebrow: "ОФИС ШЕШІМДЕРІНІҢ ФОРМАТТАРЫ",
    title: "Бизнестің әртүрлі міндеттеріне",
    description:
      "Бұл форматтар өтінімде сұранысты нақтылауға көмектеседі — форматты таңдау каталогты шектемейді.",
    cards: [
      {
        title: "Офис",
        text: "Бизнес-орталықтағы классикалық жалға берілетін офис: команда құрылымына сай алаң мен қабатты таңдайсыз.",
        imageAlt: "Демалыс аймағы мен келіссөз бөлмелері бар заманауи офис кеңістігі",
      },
      {
        title: "Сервистік офис",
        text: "Жиһазы, инфрақұрылымы және қызметі бар дайын жұмыс кеңістігі — тезірек кіруге болады.",
        imageAlt: "Жиһазы мен лаунж аймағы бар сервистік офис",
      },
      {
        title: "Кілтпен дайын офис",
        text: "Бизнес міндеттеріне сай шешім: таңдау, жоспарлау және кеңістікті кіруге дайындау.",
        imageAlt: "Кілтпен дайын офиске арналған бос үй-жай",
      },
    ],
  },
  property: {
    about: "Нысан туралы",
    address: "Мекенжайы",
    availabilityEyebrow: "Жалға бос",
    availabilityTitle: "Қолжетімді алаңдар",
    specsEyebrow: "Сипаттамалар",
    specsTitle: "Нысанның қысқаша карточкасы",
    advantagesEyebrow: "Артықшылықтар",
    advantagesTitle: "Негізгі артықшылықтар",
    galleryEyebrow: "Фотосуреттер",
    galleryTitle: "Қандай көрінеді",
    galleryHint: "Үлкейтіп көру үшін фотосуретті басыңыз.",
    showAllPhotos: "Барлық фотоны көрсету",
    otherEyebrow: "Басқа нысандар",
    otherTitle: "TMK WorkFlow басқа бизнес-орталықтары",
    otherDescription:
      "Бос алаңдарды, сипаттамаларды және фотоларды көру үшін нысан бетін ашыңыз.",
    viewingTitle: "{name} нысанын өз көзіңізбен қараңыз",
    selectAreaAria: "{area} алаңын таңдап, қарауға жазылу",
    allPhotos: "Барлығы",
  },
  form: {
    name: "Аты",
    company: "Компания",
    phone: "Телефон",
    email: "Email",
    property: "Қызықтырған нысан",
    propertyPlaceholder: "Нысанды таңдаңыз",
    comment: "Пікір",
    commentPlaceholder: "Қажетті алаң, кіру мерзімі, тілектер",
    namePlaceholder: "Сізге қалай жүгінейік",
    companyPlaceholder: "Компания атауы",
    emailPlaceholder: "name@company.kz",
    nameRequired: "Атыңызды көрсетіңіз",
    phoneRequired: "Телефонды көрсетіңіз",
    phoneIncomplete: "Нөмірді толық енгізіңіз: +7 (___) ___-__-__",
    emailInvalid: "Электрондық пошта мекенжайын тексеріңіз",
    propertyRequired: "Нысанды таңдаңыз",
    propertyInvalid: "Тізімнен нысанды таңдаңыз",
    consentRequired: "Жеке деректерді өңдеуге келісім қажет",
    success: "Рахмет! Өтінім сәтті жіберілді. Менеджеріміз жақын арада сізбен хабарласады",
    errorRetry: "Қайта жіберіп көріңіз немесе WhatsApp-қа жазыңыз — жылдам жауап береміз.",
    writeWhatsApp: "WhatsApp-қа жазу",
    honeypot: "Бұл өрісті толтырмаңыз",
  },
  leadModal: {
    heroSelect: {
      title: "Офис таңдау",
      description: "Байланыс қалдырыңыз — қолайлы нұсқаларды таңдап, ұсыныспен ораламыз.",
    },
    homeSelect: {
      title: "Офис таңдау",
      description:
        "Өтінім қалдырыңыз — компанияңыздың міндеттеріне сай бизнес-орталық пен офис форматын таңдаймыз.",
    },
    serviced: {
      title: "Сервистік офис таңдау",
      description: "Бос сервистік кеңістіктер мен кіру шарттары туралы айтамыз.",
    },
    viewing: {
      title: "Қарауға жазылу",
      description: "Ыңғайлы уақытты келісіп, бос үй-жайларды көрсетеміз.",
    },
    headerContact: {
      title: "Бізбен байланысу",
      description: "Өтінім қалдырыңыз — менеджер жақын арада сізбен хабарласады.",
    },
    propertyContact: {
      title: "Бізбен байланысу",
      description: "Өтінім қалдырыңыз — менеджер жақын арада сізбен хабарласады.",
    },
    footerContact: {
      title: "Бізбен байланысу",
      description: "Өтінім қалдырыңыз — менеджер жақын арада сізбен хабарласады.",
    },
  },
  whatsappGate: {
    title: "WhatsApp арқылы байланысу үшін телефон қалдырыңыз",
    description: "Телефон жіберілгеннен кейін WhatsApp ашылады",
    submit: "WhatsApp-қа өту",
    fallbackHint: "WhatsApp автоматты түрде ашылмаса, төмендегі батырманы басыңыз.",
    openWhatsApp: "WhatsApp ашу",
    consent: "Батырманы басу арқылы жеке деректерді өңдеуге келісесіз",
    phoneError: "Нөмірді толық енгізіңіз: +7 (___) ___-__-__",
  },
  photoCategories: {
    facade: "Дроннан қасбет",
    entrance: "Кіреберіс тобы",
    hall: "Холл",
    offices: "Офистер",
    elevators: "Лифтілер",
    common: "Ортақ аймақтар",
    parking: "Паркинг",
    renders: "Жоба рендерлері",
    infrastructure: "Инфрақұрылым",
  },
  notFound: {
    title: "Бет табылмады",
    description: "Мұндай бет жоқ. Басты бетке оралыңыз немесе нысанды таңдаңыз.",
    home: "Басты бетке",
  },
  privacy: {
    title: "Құпиялылық саясаты",
    seoTitle: "Құпиялылық саясаты | TMK WorkFlow",
    seoDescription: "TMK WorkFlow сайтының жеке деректерді өңдеу саясаты.",
  },
}

export const messages: Record<Locale, Messages> = { ru, kk }
