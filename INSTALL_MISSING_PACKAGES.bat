@echo off
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║         📦 INSTALLING MISSING PACKAGES 📦                  ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd backend

echo Installing nodemailer and other missing packages...
echo.
call npm install nodemailer openai

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              ✅ PACKAGES INSTALLED! ✅                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo Generating Prisma Client...
call npx prisma generate

echo.
echo Starting server...
echo.
call npm run dev
