# Workflow Landing Page

Лендинг-страница для сервисных офисов премиум-класса Workflow в Алматы.

## Технологии

- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик
- **Tailwind CSS** - стилизация
- **Lucide React** - иконки

## Функционал

- ✅ Адаптивный дизайн для всех устройств
- ✅ Интеграция с WhatsApp для связи
- ✅ Форма заявки с отправкой в WhatsApp
- ✅ Секции: Hero, Портфолио, Тарифы, Преимущества, Резиденты, Контакты

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Просмотр production сборки
npm run preview
```

## Структура проекта

```
src/
├── components/          # React компоненты
│   ├── ui/             # Базовые UI компоненты
│   ├── HeroSection.tsx
│   ├── PortfolioSection.tsx
│   ├── RatesSection.tsx
│   ├── AdvantagesSection.tsx
│   ├── ResidentsSection.tsx
│   ├── ContactFormSection.tsx
│   └── Footer.tsx
├── lib/
│   └── utils.ts        # Утилиты
├── App.tsx             # Главный компонент
├── main.tsx            # Точка входа
└── index.css           # Глобальные стили
```

## Настройка WhatsApp

Номер телефона для WhatsApp можно изменить в компонентах:
- `HeroSection.tsx`
- `PortfolioSection.tsx`
- `AdvantagesSection.tsx`
- `ContactFormSection.tsx`

Текущий номер: `77088241384`

## Лицензия

Private
# workflow-leading
