# TMK WorkFlow

Сайт коммерческой недвижимости TMK WorkFlow (Алматы): аренда офисных и
коммерческих помещений в бизнес-центрах **Time Square**, **Venus** и
**Koktem Towers**.

Домен: https://tmk-workflow.kz/

## Структура

| Страница          | Маршрут           | Что на ней                                        |
|-------------------|-------------------|---------------------------------------------------|
| Главная           | `/`               | Хиро-блок, форматы офисных решений, сервисный офис, полный блок Time Square, переходы на Venus и Koktem Towers |
| Venus             | `/venus`          | Полный блок объекта                                |
| Koktem Towers     | `/koktem-towers`  | Полный блок объекта                                |
| Политика          | `/privacy`        | Обработка персональных данных                      |

Блок объекта одинаков для всех трёх страниц и идёт в порядке ТЗ: большое фото →
информация → экосистема TMK → свободные площади и характеристики → преимущества →
фотогалерея → запись на просмотр.

## Технологии

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 3 (палитра: голубой, белый, оранжевый)
- React Router 7
- Lucide React — иконки
- Vercel Serverless Function — приём заявок

## Запуск

```bash
npm install
npm run dev
```

Сборка и проверки:

```bash
npm run build
```

```bash
npm run lint
```

## Где что лежит

```
src/
  lib/properties.ts      — весь контент объектов: тексты, площади, характеристики,
                           преимущества, фотографии и alt-тексты
  lib/homeContent.ts     — контент главной (хиро, форматы, сервисный офис)
  lib/site.ts            — контакты, WhatsApp, обёртка над аналитикой
  lib/leadForm.ts        — маска телефона, валидация, отправка заявки
  components/property/   — секции блока объекта
  components/home/       — секции главной страницы
  components/lead/       — форма заявки и модальное окно
api/lead.js              — приём заявки и отправка письма
```

Чтобы поправить текст, площадь или список фотографий объекта — правится только
`src/lib/properties.ts`.

## Заявки с форм

Формы отправляют `POST /api/lead`. Функция валидирует данные, отсекает ботов
(honeypot + минимальное время заполнения + ограничение частоты по IP) и шлёт
письмо через [Resend](https://resend.com).

Переменные окружения на Vercel:

| Переменная        | Обязательна | Значение по умолчанию                        |
|-------------------|-------------|----------------------------------------------|
| `RESEND_API_KEY`  | да          | —                                            |
| `LEAD_TO_EMAIL`   | нет         | `yerlepessov.t@tmk-limited.com`              |
| `LEAD_FROM_EMAIL` | нет         | `TMK WorkFlow <noreply@tmk-workflow.kz>`     |

Домен отправителя должен быть подтверждён в Resend, иначе письма не уйдут.

В письме передаются: объект, страница, источник формы, имя, компания, телефон,
email и комментарий.

## Фотографии

- `public/TimeSquare/` — фото Time Square, ожидаемые имена файлов описаны
  в [public/TimeSquare/README.md](public/TimeSquare/README.md)
- `public/Venus/`, `public/Koktem Tower/` — фото Venus и Koktem Towers
- `public/venus.webp`, `public/koktem-towers.webp` — фасады для обложек

Если файла нет, на его месте выводится подписанная заглушка — вёрстка не ломается.

Оптимизация изображений:

```bash
npm run convert-images
```

## Аналитика

`track()` из `src/lib/site.ts` отправляет события в `dataLayer`, `gtag`, `ym`
и `fbq`, если счётчик подключён на странице. События: `lead_form_open`,
`lead_submit`, `phone_click`, `whatsapp_click`. Идентификатор Яндекс.Метрики
задаётся переменной `VITE_YM_COUNTER_ID`.

## Деплой

Vercel, framework preset **Vite**. Настройки в `vercel.json`: сборка в `dist`,
SPA-rewrite всех маршрутов кроме `/api/*`.
