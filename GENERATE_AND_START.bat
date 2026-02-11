@echo off
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║         🔧 GENERATE PRISMA AND START SERVER 🔧             ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd backend

echo Step 1: Generating Prisma Client...
echo (This will take 30 seconds)
echo.
call npx prisma generate

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Prisma generate failed!
    echo.
    echo Trying with database migration...
    call npx prisma migrate dev --name init
    echo.
    echo Generating again...
    call npx prisma generate
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              ✅ PRISMA CLIENT GENERATED! ✅                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo Step 2: Starting server...
echo.
call npm run dev
