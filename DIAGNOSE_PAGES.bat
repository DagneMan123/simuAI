@echo off
cls
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║         Diagnosing Login/Register Page Display Issue            ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

echo This will help diagnose why pages don't show when typing URL directly.
echo.

echo Step 1: Opening test URLs...
echo.

timeout /t 2 /nobreak >nul

echo Opening Landing Page...
start http://localhost:5173/
timeout /t 1 /nobreak >nul

echo Opening Login Page...
start http://localhost:5173/login
timeout /t 1 /nobreak >nul

echo Opening Register Page...
start http://localhost:5173/register
timeout /t 1 /nobreak >nul

echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo ✅ Pages opened in browser
echo.
echo Now check each page:
echo.
echo 1. Landing Page (http://localhost:5173/)
echo    → Should show: Hero section, features, pricing
echo.
echo 2. Login Page (http://localhost:5173/login)
echo    → Should show: Email/password form
echo.
echo 3. Register Page (http://localhost:5173/register)
echo    → Should show: Role selection, registration form
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo If pages are BLANK or NOT SHOWING:
echo.
echo 1. Press F12 to open DevTools
echo 2. Go to Console tab
echo 3. Look for RED errors
echo 4. Take screenshot of errors
echo.
echo Common issues:
echo.
echo ❌ "Cannot read property..." → Component error
echo    Fix: Check console for exact error
echo.
echo ❌ Blank white page → JavaScript error
echo    Fix: Check console, clear cache
echo.
echo ❌ "404 Not Found" → Server not running
echo    Fix: Run COMPLETE_FIX_NOW.bat
echo.
echo ❌ Page flashes then disappears → Redirect issue
echo    Fix: Check if you're logged in (logout first)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Next steps:
echo.
echo 1. Check browser console (F12) for errors
echo 2. Clear browser cache (Ctrl+Shift+Delete)
echo 3. Hard refresh (Ctrl+F5)
echo 4. Try incognito mode (Ctrl+Shift+N)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.

pause
