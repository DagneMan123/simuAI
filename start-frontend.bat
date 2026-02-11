@echo off
echo ========================================
echo Starting SimuAI Frontend Server
echo ========================================
echo.

cd frontend

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting development server...
echo.
echo The website will be available at:
echo http://localhost:3000/
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev

pause
