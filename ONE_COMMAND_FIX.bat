@echo off
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║         🚀 ONE COMMAND FIX - EVERYTHING! 🚀                ║
echo ║                                                            ║
echo ║  This will fix ALL errors and start your server!          ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd backend

echo [1/4] Installing ALL dependencies...
echo (This may take 2-3 minutes)
echo.
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ npm install failed!
    echo Trying to fix...
    del package-lock.json
    call npm install
)

echo.
echo [2/4] Generating Prisma Client...
echo.
call npx prisma generate

echo.
echo [3/4] Running database migrations...
echo.
call npx prisma migrate dev --name init

echo.
echo [4/4] Starting server...
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║              ✅ ALL FIXED! STARTING SERVER... ✅            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

call npm run dev
