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
- ✅ Секции: Hero, Портфолио, Тарифы, Преимущества, Контакты

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

## Деплой на Vercel

### Автоматический деплой через GitHub

1. Загрузите проект в GitHub репозиторий
2. Зайдите на [vercel.com](https://vercel.com)
3. Нажмите "Add New Project"
4. Импортируйте ваш GitHub репозиторий
5. Vercel автоматически определит настройки:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Нажмите "Deploy"

### Ручная настройка

Если автоматическое определение не сработало, укажите вручную:
- **Framework Preset:** Vite
- **Root Directory:** `./` (или оставьте пустым)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Файлы конфигурации

Проект уже содержит `vercel.json` с правильными настройками для деплоя.

## Настройка WhatsApp

Номер телефона для WhatsApp можно изменить в файле `src/lib/constants.ts`:
```typescript
export const WHATSAPP_PHONE = "77088241384"
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
│   ├── ContactFormSection.tsx
│   └── Footer.tsx
├── lib/
│   ├── constants.ts     # Константы (WhatsApp номер)
│   └── utils.ts         # Утилиты
├── App.tsx             # Главный компонент
├── main.tsx            # Точка входа
└── index.css           # Глобальные стили
```

## Возможные проблемы при деплое

### Ошибка сборки

Если сборка падает на Vercel:
1. Проверьте версию Node.js (используется Node 20, указано в `.nvmrc`)
2. Убедитесь, что все зависимости установлены
3. Проверьте логи сборки в Vercel Dashboard

### Проблемы с путями

Если страница не загружается после деплоя:
- Убедитесь, что `vercel.json` содержит правильные rewrites
- Проверьте, что `outputDirectory` указан как `dist`

### Проблемы с изображениями

Если изображения не загружаются:
- Убедитесь, что файлы в папке `public/` закоммичены в Git
- Проверьте пути к изображениям в коде

## Лицензия

Private
