@echo off
echo Установка зависимостей...
npm install

if %errorlevel% neq 0 (
    echo Ошибка при установке зависимостей.
    exit /b %errorlevel%
) else (
    echo Зависимости успешно установлены!
)

echo Запуск приложения...
start cmd /k "npm run start"

timeout /t 5 >nul 2>&1

echo Открытие в браузере...
start "" http://localhost:3000
