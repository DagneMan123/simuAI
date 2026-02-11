@echo off
echo ========================================
echo   Fixing MODULE_NOT_FOUND Error
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
call npm install

echo.
echo Step 2: Checking if Prisma Client is generated...
call npx prisma generate

echo.
echo Step 3: Verifying installation...
if exist "node_modules" (
    echo SUCCESS: node_modules folder exists
) else (
    echo ERROR: node_modules folder not found
    echo Please run: npm install manually
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Fix Complete!
echo ========================================
echo.
echo Now try running: npm run dev
echo.
pause
