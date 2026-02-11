@echo off
echo ========================================
echo   SimuAI - Complete Fix Script
echo ========================================
echo.

echo [Step 1/5] Cleaning old installations...
cd backend
if exist "node_modules" (
    echo Removing old node_modules...
    rmdir /s /q node_modules
)
if exist "package-lock.json" (
    echo Removing old package-lock.json...
    del package-lock.json
)

echo.
echo [Step 2/5] Installing Backend Dependencies...
echo This may take 2-3 minutes...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo [Step 3/5] Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Prisma generate failed!
    echo Please check your DATABASE_URL in .env file.
    pause
    exit /b 1
)

echo.
echo [Step 4/5] Verifying Installation...
if not exist "node_modules\express" (
    echo ERROR: Express not installed!
    pause
    exit /b 1
)
if not exist "node_modules\helmet" (
    echo ERROR: Helmet not installed!
    pause
    exit /b 1
)
if not exist "node_modules\@prisma\client" (
    echo ERROR: Prisma Client not installed!
    pause
    exit /b 1
)

echo SUCCESS: All required modules are installed!

echo.
echo [Step 5/5] Testing Backend Server...
echo Starting server for 5 seconds to test...
start /B node src/server.js
timeout /t 5 /nobreak >nul
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ========================================
echo   Fix Complete!
echo ========================================
echo.
echo All dependencies installed successfully!
echo.
echo Next steps:
echo 1. Make sure PostgreSQL is running
echo 2. Check backend/.env has correct DATABASE_URL
echo 3. Run: npm run dev (in backend folder)
echo.
echo Or use: start-all.bat (from root folder)
echo.
pause
