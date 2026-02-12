@echo off
REM Скрипт для удобного запуска сервера и клиента
REM Откройте CMD и запустите этот файл

echo.
echo ========================================
echo   COALITION - Discord/Minecraft Server
echo   Запуск сервера и клиента...
echo ========================================
echo.

REM Проверка Node.js
node -v >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js не найден!
  echo Пожалуйста установите Node.js с https://nodejs.org
  pause
  exit /b 1
)

echo [OK] Node.js найден
echo.

REM Проверка MongoDB
echo Проверка MongoDB...
net start MongoDB >nul 2>&1
if errorlevel 1 (
  echo [WARNING] MongoDB может быть не запущена
  echo Убедитесь что MongoDB установлена и запущена
  echo Используйте: net start MongoDB
)

echo.
echo Установка зависимостей сервера...
cd server
if not exist node_modules (
  echo Первый запуск - установка npm зависимостей...
  call npm install
)
echo [OK] Сервер готов

cd ..
echo.
echo Установка зависимостей клиента...
cd client
if not exist node_modules (
  echo Первый запуск - установка npm зависимостей...
  call npm install
)
echo [OK] Клиент готов

cd ..

echo.
echo ========================================
echo   Запуск...
echo ========================================
echo.
echo Откроется 2 новых окна терминала:
echo - Первое: Сервер (API) на http://localhost:5000
echo - Второе: Клиент на http://localhost:3000
echo.
echo Обе окна должны остаться открытыми!
echo Введите CTRL+C в каждом окне чтобы остановить
echo.
pause

REM Запуск сервера в новом окне
start cmd /k "cd server && npm run dev"

REM Небольшая пауза
timeout /t 3 /nobreak

REM Запуск клиента в новом окне
start cmd /k "cd client && npm run dev"

echo.
echo [OK] Оба сервера запущены!
echo Откройте браузер на http://localhost:3000
echo.
pause
