# 📂 ПОЛНАЯ СТРУКТУРА ПРОЕКТА

## 👀 ВИЗУАЛЬНАЯ СТРУКТУРА:

```
sitezakataw/  ← ВАШ ПРОЕКТ
│
├─ 📄 !READ_ME_FIRST!.txt           ← НАЧНИТЕ С ЭТОГО ФАЙЛА! 🔴
├─ 📄 START_HERE.md                 ← Описание всего проекта
├─ 📄 INSTALLATION.md               ← Пошаговая установка (ПОДРОБНО)
├─ 📄 GETTING_STARTED.md            ← Быстрый старт
├─ 📄 DATABASE_SETUP.md             ← Установка MongoDB
├─ 📄 README.md                     ← Полное описание проекта
│
├─ ⚙️ start-servers.bat              ← Запуск всего (Windows)
├─ ⚙️ start-servers.sh               ← Запуск всего (Mac/Linux)
│
│
├─ 📁 server/                        ← BACKEND (API, ЛОГИКА)
│   ├─ 📁 routes/
│   │   ├─ auth.js                 ← Аутентификация (логин/регистрация)
│   │   ├─ questions.js            ← Управление вопросами (АДМИН)
│   │   └─ answers.js              ← Ответы пользователей
│   │
│   ├─ 📁 models/
│   │   ├─ User.js                 ← Схема пользователя (юзер/админ)
│   │   ├─ Question.js             ← Схема вопроса
│   │   └─ Answer.js               ← Схема ответа
│   │
│   ├─ index.js                    ← Главный файл сервера
│   ├─ package.json                ← Dependencies
│   ├─ .env.example                ← ПЕРЕПИСАТЬ В .env
│   ├─ .gitignore
│   └─ README.md                   ← Документация API
│
│
└─ 📁 client/                        ← FRONTEND (ИНТЕРФЕЙС)
    ├─ 📁 src/
    │   │
    │   ├─ 📁 pages/               ← ВСЕ СТРАНИЦЫ
    │   │   ├─ Login.jsx           ← Страница входа
    │   │   ├─ Login.css           
    │   │   ├─ Register.jsx        ← Страница регистрации
    │   │   ├─ Auth.css            ← Стили для логина
    │   │   │
    │   │   ├─ Home.jsx            ← Главная страница
    │   │   ├─ Home.css
    │   │   │
    │   │   ├─ Coalition.jsx       ← 🤝 Форма для вступления (ГЛАВНАЯ!)
    │   │   ├─ Coalition.css       ← Стили карусели вопросов
    │   │   │
    │   │   ├─ News.jsx            ← 📰 Новости
    │   │   ├─ News.css
    │   │   │
    │   │   ├─ AdminPanel.jsx      ← ⚙️ Панель администратора (АДМИНЫ)
    │   │   └─ AdminPanel.css      ← Управление вопросами/ответами
    │   │
    │   ├─ 📁 components/          ← ПЕРЕИСПОЛЬЗУЕМЫЕ КОМПОНЕНТЫ
    │   │   ├─ Navigation.jsx      ← Навигация (меню, логотип)
    │   │   └─ Navigation.css      ← Стили навигации
    │   │
    │   ├─ 📁 context/             ← STATE MANAGEMENT
    │   │   └─ AuthContext.jsx     ← Управление аутентификацией
    │   │
    │   ├─ 📁 styles/              ← ГЛОБАЛЬНЫЕ СТИЛИ
    │   │   └─ globals.css         ← НЕОН ДИЗАЙН (синий-фиолетовый)
    │   │
    │   ├─ api.js                  ← HTTP клиент (axios)
    │   ├─ App.jsx                 ← Главный компонент
    │   └─ main.jsx                ← Точка входа React
    │
    ├─ index.html                  ← HTML страница
    ├─ vite.config.js              ← Конфигурация Vite
    ├─ package.json                ← Dependencies
    ├─ tsconfig.json               ← TypeScript конфиг
    ├─ .gitignore
    ├─ README.md                   ← Документация клиента
    └─ node_modules/               ← (создается автоматически при npm install)

```

---

## 📋 ОПИСАНИЕ ОСНОВНЫХ ПАПОК:

### `/server` - BACKEND

**Что это:** Node.js + Express сервер с API

**Основные файлы:**
- `index.js` - Запуск сервера, конфигурация
- `routes/auth.js` - Логин, регистрация, аутентификация
- `routes/questions.js` - Создание и управление вопросами (админ)
- `routes/answers.js` - Отправка и получение ответов
- `models/User.js` - Схема пользователя (username, email, password, role)
- `models/Question.js` - Схема вопроса (title, description)
- `models/Answer.js` - Схема ответа (questionId, userId, answer)

**Порт:** 5000 (http://localhost:5000)

**Главная фишка:** API эндпоинты для работы с вопросами и ответами

---

### `/client` - FRONTEND

**Что это:** React приложение с Vite сборщиком

**Основные папки:**
- `src/pages/` - 6 страниц приложения
- `src/components/` - Переиспользуемые компоненты
- `src/context/` - Управление состоянием (юзер, токен)
- `src/styles/` - Глобальные CSS стили

**Порт:** 3000 (http://localhost:3000)

**Главная фишка:** Красивый неон интерфейс для взаимодействия

---

## 🎯 КЛЮЧЕВЫЕ ФАЙЛЫ:

| Файл | Что там | Почему важно |
|------|---------|------------|
| `server/index.js` | Запуск сервера | Главный файл backend |
| `server/routes/auth.js` | Логин/регестрация | Безопасность |
| `server/routes/questions.js` | Создание вопросов | Главная фишка (админ) |
| `server/routes/answers.js` | Ответы пользователей | Главная фишка (юзер) |
| `client/App.jsx` | Маршруты и логика | Главный компонент |
| `client/src/pages/Coalition.jsx` | Форма с вопросами | ГЛАВНАЯ СТРАНИЦА для юзеров |
| `client/src/pages/AdminPanel.jsx` | Панель админа | ГЛАВНАЯ СТРАНИЦА для админов |
| `client/src/styles/globals.css` | Неон стили | ДИЗАЙН (синий-фиолетовый) |

---

## 🚀 ПОТОК РАБОТЫ:

### Регистрация:
1. Юзер видит `/register` страницу
2. Заполняет форму (username, email, password)
3. Отправляется POST запрос на `server/routes/auth.js`
4. Пароль хешируется (bcrypt)
5. Данные сохраняются в MongoDB
6. Возвращается JWT токен
7. Юзер перенаправляется на главную

### Вход в коалицию:
1. Юзер видит `/coalition` страницу с вопросами
2. Вопросы загружаются с `GET /api/questions`
3. Юзер видит карусель вопросов
4. Юзер ответствует в текстовое поле
5. Юзер нажимает "Отправить"
6. Отправляется POST запрос на `POST /api/answers`
7. Ответ сохраняется в MongoDB
8. Вопрос помечается как "Ответлено"

### Просмотр ответов (АДМИН):
1. Админ видит `/admin` страницу
2. Видит список всех вопросов
3. Нажимает "👁️ Просмотр"
4. Загружаются ВСЕ ОТВЕТЫ от ВСЕх пользователей
5. Видит кто и что ответил
6. Может удалить вопрос или создать новый

---

## 📦 УСТАНОВЛЕННЫЕ ПАКЕТЫ:

### Server `server/package.json`:
- `express` - веб-фреймворк
- `mongoose` - MongoDB драйвер
- `jsonwebtoken` - JWT
- `bcryptjs` - хеширование паролей
- `cors` - crossorigin requests
- `dotenv` - переменные окружения
- `nodemon` - автоперезагрузка при разработке

### Client `client/package.json`:
- `react` - UI библиотека
- `react-dom` - рендер в DOM
- `react-router-dom` - маршрутизация
- `vite` - быстрый сборщик
- `axios` - HTTP клиент
- `lucide-react` - иконки

---

## 🔄 ОБЩЕЙ ФАЙЛЫ (КОНФИГУРАЦИЯ):

| Файл | Назначение |
|------|-----------|
| `.env.example` | Пример переменных (скопируйте в `.env`) |
| `.gitignore` | Файлы для игнорирования git |
| `package.json` | Dependencies и scripts |
| `README.md` | Документация |
| `start-servers.bat` | Автозапуск (Windows) |
| `start-servers.sh` | Автозапуск (Mac/Linux) |

---

## 📊 РАЗМЕР ПРОЕКТА:

```
total files: ~50+
code files: ~25
documentation: ~8
config files: ~10
```

Компактный, но полностью функциональный! 🚀

---

## ✅ БЫСТРАЯ НАВИГАЦИЯ:

**НАЧНИТЕ ОТСЮДА:**
1. Откройте `!READ_ME_FIRST!.txt`
2. Или откройте `INSTALLATION.md`

**ЗАПУСК:**
- Windows: `start-servers.bat` (двойной клик)
- Mac/Linux: `chmod +x start-servers.sh && ./start-servers.sh`

**ДОКУМЕНТАЦИЯ:**
- `README.md` - Полное описание
- `DATABASE_SETUP.md` - MongoDB
- `server/README.md` - API
- `client/README.md` - Frontend

---

## 🎊 ВСЁ ГОТОВО К ЗАПУСКУ!

Структура ясна, файлы организованы, документация полная.

**Всё что нужно - уже в проекте!** ✅

Начните с установки Node.js и запуска `start-servers.bat` или `start-servers.sh`! 🚀
