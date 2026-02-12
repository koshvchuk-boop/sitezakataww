# 🚀 Развертывание сайта

## Вариант 1: Быстрый тест (ngrok)

### Шаг 1: Установить ngrok
```powershell
choco install ngrok
# или download с https://ngrok.com/download
```

### Шаг 2: Запустить оба сервера
```powershell
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Шаг 3: Создать публичный URL
```powershell
ngrok http 3000
```

Скопируйте URL (например `https://xxxx-xx-xxx.ngrok.io`) и поделитесь с друзьями!

---

## Вариант 2: Production (Vercel + Railway + MongoDB Atlas)

### Шаг 1: MongoDB Atlas (облачная база данных)

1. Зайдите на https://www.mongodb.com/cloud/atlas
2. Создайте аккаунт (бесплатно)
3. Создайте новый cluster (M0 - бесплатный)
4. В Security → Database Access создайте пользователя (username/password)
5. В Network Access добавьте 0.0.0.0/0 (разрешить всем)
6. Скопируйте connection string

Примерно так:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/coalition?retryWrites=true&w=majority
```

### Шаг 2: Развернуть Backend на Railway

1. Зайдите на https://railway.app
2. Подключите GitHub или создайте аккаунт
3. Нажмите "Deploy from GitHub" или "New Project"
4. Выберите папку с проектом
5. Railway автоматически создаст Node.js сервис
6. Добавьте переменные окружения:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/coalition
JWT_SECRET=ваш-секретный-ключ-123456
FRONTEND_URL=https://ваш-фронтенд.vercel.app
PORT=5000
```

7. Скопируйте URL (типа `https://your-backend-name.railway.app`)

### Шаг 3: Развернуть Frontend на Vercel

1. Зайдите на https://vercel.com
2. Нажмите "Import Project"
3. Выберите папку с проектом
4. На шаге "Build and Output Settings":
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Добавьте Environment Variables:
```
VITE_API_URL=https://your-backend-name.railway.app/api
```

6. Нажмите "Deploy"

Готово! Ваш сайт доступен по ссылке Vercel для всех! 🎉

---

## Шаг 4: Обновить ссылки

Со своего компьютера отредактируйте:

**client/.env.production**
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

**server/.env** (на Railway)
```
MONGO_URI=<из MongoDB Atlas>
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## Проверка

Откройте в браузере:
- Frontend: https://your-frontend.vercel.app
- API Health: https://your-backend.railway.app/api/health

Если видите `{"status":"ok"}` - всё работает! ✅

---

## Советы

- **Бесплатные сервисы имеют лимиты** - это нормально для теста
- **Для продакшена** рекомендуем платные tierы
- **Кэшируйте ответы** для лучшей производительности
- **Добавьте аналитику** (Google Analytics)

