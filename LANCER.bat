@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js n est pas installe. Installez la version LTS sur https://nodejs.org puis relancez. & pause & exit /b)
findstr /c:vite package.json >nul 2>nul || (echo Ce dossier n est pas le projet React. Verifiez le dossier. & pause & exit /b)
if not exist node_modules call npm install
call npm run dev -- --open
pause
