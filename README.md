# VetSoft

Веб-приложение ветеринарной клиники. Решает проблему утери бумажных справок, прививочных паспортов и рецептов: у владельца питомца всегда под рукой электронная история болезни, результаты анализов и график вакцинаций. Онлайн-запись к ветеринару доступна круглосуточно, без звонков и ожидания на линии, а автоматические напоминания о визитах и прививках снижают число пропущенных приемов и разгружают администраторов клиники.

## Стек

- **Frontend**: Vue 3, Nuxt 4, Pinia, TypeScript, Tailwind CSS, Socket.IO Client, Vitest
- **Backend**: Node.js, NestJS, TypeScript, TypeORM, PostgreSQL, Socket.IO, Jest
- **Инфраструктура**: Docker, Docker Compose, Nginx (статика + reverse-proxy для REST API и WebSocket)

## Структура проекта

```
vetsoft/
├── app/
│   ├── server/   # NestJS REST API + WebSocket-сервер
│   └── client/   # Nuxt-приложение (сайт клиники + личный кабинет)
├── infra/
│   └── nginx.conf  # конфиг nginx: статика фронтенда + проксирование /api и /socket.io на backend
└── docker-compose.yml
```

## Быстрый старт через Docker

Из корня проекта:

**bash**
```bash
cp .env.example .env
docker compose up --build
```

**PowerShell**
```powershell
Copy-Item .env.example .env
docker compose up --build
```

После сборки сайт будет доступен на `http://localhost:8080`. При первом запуске бэкенд автоматически создаст таблицы и заполнит базу демонстрационными данными (услуги, врачи, статьи, тестовый клиент со связкой аккаунтов):

- Администратор клиники: `admin@vetsoft.local` / `ChangeMe123!`
- Врач: `doctor@vetsoft.local` / `ChangeMe123!`
- Демо-клиент с питомцем и медкартой: `demo@vetsoft.local` / `ChangeMe123!`

Пароль по умолчанию задается переменной `SEED_STAFF_PASSWORD` в `.env`.

Остановить и удалить контейнеры:

**bash**
```bash
docker compose down
```

**PowerShell**
```powershell
docker compose down
```

Чтобы удалить и данные базы:

**bash**
```bash
docker compose down -v
```

**PowerShell**
```powershell
docker compose down -v
```

## Локальная разработка без Docker

Понадобится Node.js 20+ и локальный PostgreSQL 16.

### 1. База данных

Создайте базу и пользователя (пример для psql), либо поднимите только контейнер с базой:

**bash**
```bash
docker compose up -d db
```

**PowerShell**
```powershell
docker compose up -d db
```

### 2. Backend

**bash**
```bash
cd app/server
cp .env.example .env
npm install
npm run start:dev
```

**PowerShell**
```powershell
cd app\server
Copy-Item .env.example .env
npm install
npm run start:dev
```

API будет доступен на `http://localhost:3001/api`, документация Swagger — на `http://localhost:3001/api/docs`.

### 3. Frontend

В новом терминале:

**bash**
```bash
cd app/client
cp .env.example .env
npm install
npm run dev
```

**PowerShell**
```powershell
cd app\client
Copy-Item .env.example .env
npm install
npm run dev
```

Сайт откроется на `http://localhost:3000` и будет обращаться к API на `http://localhost:3001/api` (адрес задается в `app/client/.env`).

## Тесты

**bash**
```bash
cd app/server && npm test
cd ../client && npm test
```

**PowerShell**
```powershell
cd app\server; npm test
cd ..\client; npm test
```

## Основные возможности

- **Личный кабинет владельца**: питомцы, электронная история болезни, результаты анализов, рецепты, график вакцинаций с напоминаниями.
- **Онлайн-запись к врачу**: живой календарь свободных слотов на основе графика работы врача, защита от двойной записи на один и тот же слот, мгновенное обновление доступности через WebSocket.
- **Уведомления**: подтверждение записи, отмена, изменение статуса визита, напоминания о приеме (за сутки и за 2 часа) и о вакцинации (за неделю) — приходят мгновенно через WebSocket и дублируются на email.
- **Кабинет персонала**: расписание приемов на день, отметка статуса визита (завершен/неявка), поиск пациентов, ведение медкарты питомца.
- **Публичный сайт**: услуги и цены, врачи, чек-ап программы, статьи, контакты — с сохранением исходного дизайна.

## Карта клиники

Координаты для карты на сайте определяются автоматически по адресу из `CLINIC_ADDRESS` через бесплатный геокодер [Nominatim](https://nominatim.org/) (OpenStreetMap) — отдельный API-ключ не нужен. Результат кэшируется в памяти бэкенда на все время его работы (адрес меняется редко, а политика Nominatim требует не опрашивать сервис повторно без необходимости). Если Nominatim недоступен или не нашёл адрес, карта на сайте просто показывает точку по умолчанию (центр Великого Новгорода), ничего не ломая.

## Переменные окружения

Полный список переменных для backend — в `app/server/.env.example`, для frontend — в `app/client/.env.example`. Переменные для `docker compose up` — в `.env.example` в корне проекта.
