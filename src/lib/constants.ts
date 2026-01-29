// WhatsApp конфигурация
export const WHATSAPP_PHONE = "77088241384" // Номер без + и пробелов

// Сообщения для WhatsApp
export const WHATSAPP_MESSAGES = {
  hero: "Здравствуйте! Я хочу узнать больше о сервисных офисах премиум-класса.",
  portfolio: (officeName: string) => 
    `Здравствуйте! Меня интересует офисное пространство "${officeName}". Хотел бы узнать подробнее.`,
  advantages: "Здравствуйте! Хочу узнать больше о преимуществах ваших офисных пространств.",
  form: (name: string, company: string, phone: string) =>
    `Новая заявка с сайта:\n\nИмя: ${name}\nКомпания: ${company}\nТелефон: ${phone}`,
}

// Функция для открытия WhatsApp
export const openWhatsApp = (message: string) => {
  const encodedMessage = encodeURIComponent(message)
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`, "_blank")
}
