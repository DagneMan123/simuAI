@echo off
echo ========================================
echo SimuAI - Authentication Testing Script
echo ========================================
echo.

echo Step 1: Checking Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)

echo.
echo Step 2: Generating Prisma Client...
call npx prisma generate

echo.
echo Step 3: Starting Backend Server...
echo Backend will run on http://localhost:5000
echo.
start cmd /k "cd backend && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo Step 4: Checking Frontend...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)

echo.
echo Step 5: Starting Frontend Server...
echo Frontend will run on http://localhost:5173
echo.
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo ✅ SERVERS STARTING...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo 📝 Open TEST_AUTH_FLOW.md for testing instructions
echo.
echo Press any key to open the test guide...
pause >nul
start TEST_AUTH_FLOW.md

echo.
echo Testing URLs:
echo - Register: http://localhost:5173/register
echo - Login: http://localhost:5173/login
echo.
pause
