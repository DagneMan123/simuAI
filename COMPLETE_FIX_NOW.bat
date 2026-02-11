@echo off
cls
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║              SimuAI - COMPLETE FIX SCRIPT                        ║
echo ║         Fixes Backend + Frontend + Database                      ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

echo [1/5] Fixing Database Schema...
echo ═══════════════════════════════════════════════════════════════════
cd backend
echo Generating Prisma Client...
call npx prisma generate
echo.
echo Pushing schema to database...
call npx prisma db push --accept-data-loss
echo ✅ Database fixed!
cd ..

echo.
echo [2/5] Installing Backend Dependencies...
echo ═══════════════════════════════════════════════════════════════════
cd backend
if not exist node_modules (
    echo Installing packages...
    call npm install
) else (
    echo ✅ Dependencies already installed
)
cd ..

echo.
echo [3/5] Installing Frontend Dependencies...
echo ═══════════════════════════════════════════════════════════════════
cd frontend
if not exist node_modules (
    echo Installing packages...
    call npm install
) else (
    echo ✅ Dependencies already installed
)
cd ..

echo.
echo [4/5] Starting Backend Server...
echo ═══════════════════════════════════════════════════════════════════
start "SimuAI Backend" cmd /k "cd backend && npm run dev"
echo ✅ Backend starting on http://localhost:5000
timeout /t 3 /nobreak >nul

echo.
echo [5/5] Starting Frontend Server...
echo ═══════════════════════════════════════════════════════════════════
start "SimuAI Frontend" cmd /k "cd frontend && npm run dev"
echo ✅ Frontend starting on http://localhost:5173

echo.
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                    ✅ SETUP COMPLETE!                            ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
echo Servers are starting...
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Wait 10 seconds for servers to fully start, then:
echo.
echo 1. Open browser: http://localhost:5173
echo 2. You should see the landing page
echo 3. Click "Get Started" to go to register
echo 4. Or go to http://localhost:5173/register directly
echo.
echo If pages are blank:
echo - Clear browser cache (Ctrl+Shift+Delete)
echo - Hard refresh (Ctrl+F5)
echo - Try incognito mode
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.

timeout /t 10 /nobreak

echo Opening browser...
start http://localhost:5173

echo.
echo ✅ All done! Check the browser windows.
echo.
pause
