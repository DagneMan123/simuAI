@echo off
echo ========================================
echo   Fixing Frontend Dependencies
echo ========================================
echo.

cd frontend

echo Removing node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo Installing dependencies with Tailwind CSS v4...
call npm install

echo.
echo ========================================
echo   Fix Complete!
echo ========================================
echo.
echo Starting dev server...
call npm run dev

