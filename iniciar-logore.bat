@echo off
title Logore AI - Iniciando...
cd /d "%~dp0"

echo.
echo  ==========================================
echo   LOGORE AI - Herramienta Inteligente
echo  ==========================================
echo.
echo  Iniciando servidor de desarrollo...
echo  La aplicacion se abrira automaticamente.
echo.

REM Espera 3 segundos y abre el navegador
start "" timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"

REM Inicia el servidor Next.js
npm run dev

pause
