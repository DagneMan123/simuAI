@echo off
echo.
echo ========================================
echo   Running Fix Commands
echo ========================================
echo.

cd backend

echo Step 1: Generating Prisma Client...
echo (This creates the missing .prisma/client folder)
echo.
call npx prisma generate

echo.
echo ========================================
echo   Prisma Client Generated!
echo ========================================
echo.

echo Step 2: Starting the server...
echo.
call npm run dev
