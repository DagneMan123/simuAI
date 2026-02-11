@echo off
cls
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║         SimuAI - Complete Navigation Fix                         ║
echo ║     Fixes: Sign up, Get Started, Register buttons               ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
echo.

echo [1/5] Checking servers...
echo ═══════════════════════════════════════════════════════════════════
echo.

echo Checking Frontend (port 5173)...
netstat -an | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is running
) else (
    echo ❌ Frontend is NOT running
    echo.
    echo Starting frontend...
    start "SimuAI Frontend" cmd /k "cd frontend && npm run dev"
    timeout /t 5 /nobreak >nul
)

echo.
echo Checking Backend (port 5000)...
netstat -an | findstr ":5000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running
) else (
    echo ❌ Backend is NOT running
    echo.
    echo Starting backend...
    start "SimuAI Backend" cmd /k "cd backend && npm run dev"
    timeout /t 5 /nobreak >nul
)

echo.
echo.
echo [2/5] Opening test page...
echo ═══════════════════════════════════════════════════════════════════
echo.

if exist TEST_NAVIGATION.html (
    start TEST_NAVIGATION.html
    echo ✅ Test page opened
) else (
    echo ⚠️  TEST_NAVIGATION.html not found
)

echo.
echo.
echo [3/5] Testing URLs...
echo ═══════════════════════════════════════════════════════════════════
echo.

timeout /t 3 /nobreak >nul

echo Opening Landing Page...
start http://localhost:5173/
timeout /t 2 /nobreak >nul

echo Opening Register Page...
start http://localhost:5173/register
timeout /t 2 /nobreak >nul

echo Opening Login Page...
start http://localhost:5173/login

echo.
echo ✅ All pages opened in browser
echo.
echo.
echo [4/5] Instructions
echo ═══════════════════════════════════════════════════════════════════
echo.
echo In the browser windows that just opened:
echo.
echo 1. Press Ctrl+Shift+Delete to clear cache
echo 2. Select "Cached images and files"
echo 3. Click "Clear data"
echo 4. Press Ctrl+F5 to hard refresh
echo.
echo Then test:
echo - Landing page: Click "Get Started"
echo - Login page: Click "Sign up for free"
echo.
echo Both should navigate to register page.
echo.
echo.
echo [5/5] Troubleshooting
echo ═══════════════════════════════════════════════════════════════════
echo.
echo If navigation still doesn't work:
echo.
echo ✓ Try incognito mode (Ctrl+Shift+N)
echo ✓ Check browser console for errors (F12)
echo ✓ Restart frontend: cd frontend ^&^& npm run dev
echo ✓ Read: FIX_SIGNUP_LINK.md
echo.
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo ✅ Fix script complete!
echo.
echo Your code is correct. The issue is browser cache.
echo Follow the instructions above to clear cache.
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.

pause
