@echo off
echo.
echo ╔═══════════════════════════════════════════╗
echo ║  ЗАПУСК САЙТА КОАЛИЦИИ С ПУБЛИЧНЫМ ДОСТУПОМ
echo ╚═══════════════════════════════════════════╝
echo.

REM Проверка ngrok
echo [1/3] Проверяю ngrok...
ngrok --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ngrok не установлен!
    echo Установи через: choco install ngrok
    pause
    exit /b 1
)
echo ✅ ngrok найден

echo.
echo [2/3] Запускаю серверы...
echo.

REM Запуск фронтенда
cd client
start "Frontend" cmd /k "npm run dev"
cd..

REM Запуск бэкенда
cd server
start "Backend" cmd /k "npm start"
cd..

timeout /t 3

REM Запуск ngrok
echo.
echo [3/3] Запускаю ngrok...
echo.
start "ngrok" cmd /k "ngrok http 3000"

echo.
echo ╔═══════════════════════════════════════════╗
echo ║  ЗАПУСТИЛИСЬ:
echo ║  - Фронтенд: http://localhost:3000
echo ║  - Бэкенд: http://localhost:5000
echo ║  - ngrok: Проверьте окно ngrok для публичной ссылки!
echo ╚═══════════════════════════════════════════╝
echo.
echo Скопируй HTTPS ссылку из окна ngrok и отправь друзьям!
echo.
pause
