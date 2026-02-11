@echo off
echo ========================================
echo Installing Frontend Dependencies
echo ========================================
echo.

cd frontend

echo Installing packages...
call npm install

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Clear browser cache (Ctrl + Shift + Delete)
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000/
echo.
pause
