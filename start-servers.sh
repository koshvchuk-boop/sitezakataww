#!/bin/bash
# Скрипт для запуска сервера и клиента на Mac/Linux

echo ""
echo "========================================"
echo "  COALITION - Discord/Minecraft Server"
echo "  Запуск сервера и клиента..."
echo "========================================"
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js не найден!"
    echo "Пожалуйста установите Node.js с https://nodejs.org"
    exit 1
fi

echo "[OK] Node.js найден"
echo ""

# Проверка MongoDB
echo "Проверка MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "[WARNING] MongoDB может быть не установлена"
    echo "Установите с https://www.mongodb.com/try/download/community"
    echo "Или используйте MongoDB Atlas"
fi

echo ""
echo "Установка зависимостей сервера..."
cd server
if [ ! -d "node_modules" ]; then
    echo "Первый запуск - установка npm зависимостей..."
    npm install
fi
echo "[OK] Сервер готов"

cd ..
echo ""
echo "Установка зависимостей клиента..."
cd client
if [ ! -d "node_modules" ]; then
    echo "Первый запуск - установка npm зависимостей..."
    npm install
fi
echo "[OK] Клиент готов"

cd ..

echo ""
echo "========================================"
echo "  Запуск..."
echo "========================================"
echo ""
echo "Откроется 2 новых терминала:"
echo "- Первый: Сервер (API) на http://localhost:5000"
echo "- Второй: Клиент на http://localhost:3000"
echo ""

# Запуск сервера в фоновом режиме
cd server
npm run dev &
SERVER_PID=$!
echo "Сервер запущен (PID: $SERVER_PID)"

# Пауза
sleep 3

# Запуск клиента в фоновом режиме
cd ../client
npm run dev &
CLIENT_PID=$!
echo "Клиент запущен (PID: $CLIENT_PID)"

cd ..
echo ""
echo "[OK] Оба сервера запущены!"
echo "Откройте браузер на http://localhost:3000"
echo ""
echo "Чтобы остановить, нажмите CTRL+C"
echo ""

# Жди пока оба процесса работают
wait $SERVER_PID $CLIENT_PID
