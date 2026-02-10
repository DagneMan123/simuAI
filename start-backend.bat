@echo off
echo ========================================
echo   SimuAI Backend Setup and Start
echo ========================================
echo.

cd backend

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [2/4] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma Client
    pause
    exit /b 1
)
echo.

echo [3/4] Running database migrations...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo WARNING: Migration may have failed or already exists
)
echo.

echo [4/4] Seeding database with test accounts...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo WARNING: Seeding may have failed or accounts already exist
)
echo.

echo ========================================
echo   Starting Backend Server...
echo ========================================
echo.
echo Test Accounts:
echo   Admin: admin@simuai.com / Admin@123
echo   Employer: employer@simuai.com / Employer@123
echo   Candidate: candidate@simuai.com / Candidate@123
echo.
echo Server will start at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
