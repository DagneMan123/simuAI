@echo off
echo ========================================
echo   SimuAI Backend Fix Script
echo ========================================
echo.
echo This script will fix common backend issues:
echo   - Reinstall dependencies
echo   - Regenerate Prisma Client
echo   - Reset and migrate database
echo   - Seed test accounts
echo.
echo WARNING: This will delete all existing data!
echo.
set /p confirm="Continue? (y/n): "
if /i not "%confirm%"=="y" (
    echo Cancelled.
    pause
    exit /b 0
)
echo.

cd backend

echo [1/5] Cleaning node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo Removed node_modules
)
if exist package-lock.json (
    del package-lock.json
    echo Removed package-lock.json
)
echo.

echo [2/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [3/5] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma Client
    pause
    exit /b 1
)
echo.

echo [4/5] Resetting and migrating database...
call npx prisma migrate reset --force
if %errorlevel% neq 0 (
    echo ERROR: Failed to reset database
    pause
    exit /b 1
)
echo.

echo [5/5] Seeding database...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo ERROR: Failed to seed database
    pause
    exit /b 1
)
echo.

echo ========================================
echo   Backend Fixed Successfully!
echo ========================================
echo.
echo Test Accounts Created:
echo   Admin: admin@simuai.com / Admin@123
echo   Employer: employer@simuai.com / Employer@123
echo   Candidate: candidate@simuai.com / Candidate@123
echo.
echo You can now start the backend:
echo   npm run dev
echo.
pause
