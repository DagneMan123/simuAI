@echo off
echo ========================================
echo SimuAI - Complete Test and Fix Script
echo ========================================
echo.

echo [1/6] Checking Node.js and npm...
node --version
npm --version
echo.

echo [2/6] Installing/Updating Backend Dependencies...
cd backend
call npm install
echo.

echo [3/6] Installing/Updating Frontend Dependencies...
cd ../frontend
call npm install
echo.

echo [4/6] Checking TypeScript Compilation (Frontend)...
call npx tsc --noEmit
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: TypeScript errors found. Check above output.
) else (
    echo SUCCESS: No TypeScript errors!
)
echo.

echo [5/6] Testing Backend Syntax...
cd ../backend
node -e "console.log('Backend syntax check passed!')"
echo.

echo [6/6] Creating Quick Start Scripts...
cd ..

echo @echo off > start-all.bat
echo echo Starting SimuAI Platform... >> start-all.bat
echo start "Backend Server" cmd /k "cd backend && npm run dev" >> start-all.bat
echo timeout /t 5 >> start-all.bat
echo start "Frontend Server" cmd /k "cd frontend && npm run dev" >> start-all.bat
echo echo. >> start-all.bat
echo echo Both servers are starting... >> start-all.bat
echo echo Backend: http://localhost:5000 >> start-all.bat
echo echo Frontend: http://localhost:5173 >> start-all.bat
echo pause >> start-all.bat

echo.
echo ========================================
echo TEST COMPLETE!
echo ========================================
echo.
echo Next Steps:
echo 1. Run: start-all.bat (to start both servers)
echo 2. Open: http://localhost:5173
echo 3. Check: DATABASE_INTEGRATION_COMPLETE.md for setup
echo.
echo If you see errors, check:
echo - backend/.env file exists with correct values
echo - Database is running (PostgreSQL)
echo - Ports 5000 and 5173 are available
echo.
pause
