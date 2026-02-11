@echo off
cls
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║        SimuAI - Complete Setup and Start                 ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

echo Step 1: Setting up Backend...
echo ────────────────────────────────────────────────────────────
cd backend

echo.
echo [1/4] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo [2/4] Creating Database Tables...
call npx prisma db push
if errorlevel 1 (
    echo ❌ Failed to create database tables
    pause
    exit /b 1
)

echo.
echo [3/4] Creating Test Users...
call node setup-db.js
if errorlevel 1 (
    echo ❌ Failed to create test users
    pause
    exit /b 1
)

echo.
echo [4/4] Starting Backend Server...
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║  Backend is starting on http://localhost:5000/           ║
echo ║                                                           ║
echo ║  Test Users Created:                                     ║
echo ║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
echo ║  Admin:      admin@simuai.com / password123              ║
echo ║  Employer:   employer@simuai.com / password123           ║
echo ║  Candidate:  candidate@simuai.com / password123          ║
echo ║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
echo ║                                                           ║
echo ║  Press Ctrl+C to stop the server                         ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

call npm start
