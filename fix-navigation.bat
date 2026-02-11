@echo off
echo ========================================
echo SimuAI - Navigation Fix Script
echo ========================================
echo.

echo This script will help fix navigation issues
echo.

echo Step 1: Checking if servers are running...
echo.

echo Checking frontend (port 5173)...
netstat -an | findstr ":5173" >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend server is running on port 5173
) else (
    echo ❌ Frontend server is NOT running
    echo    Start it with: cd frontend ^&^& npm run dev
)

echo.
echo Checking backend (port 5000)...
netstat -an | findstr ":5000" >nul
if %errorlevel% equ 0 (
    echo ✅ Backend server is running on port 5000
) else (
    echo ❌ Backend server is NOT running
    echo    Start it with: cd backend ^&^& npm run dev
)

echo.
echo ========================================
echo Step 2: Opening test page...
echo ========================================
echo.

start TEST_NAVIGATION.html

echo.
echo ========================================
echo Step 3: Quick Fixes
echo ========================================
echo.
echo If navigation still doesn't work:
echo.
echo 1. Clear browser cache (Ctrl+Shift+Delete)
echo 2. Hard refresh page (Ctrl+F5)
echo 3. Try incognito mode
echo 4. Check browser console for errors (F12)
echo.
echo ========================================
echo Step 4: Test URLs
echo ========================================
echo.
echo Try these URLs directly in browser:
echo.
echo Landing: http://localhost:5173/
echo Register: http://localhost:5173/register
echo Login: http://localhost:5173/login
echo.
echo ========================================
echo.

pause
