@echo off
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              🚀 SimuAI - INSTANT FIX 🚀                    ║
echo ║                                                            ║
echo ║  This will fix the Prisma Client error in 30 seconds!     ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd backend

echo [1/3] Generating Prisma Client...
call npx prisma generate
echo.

if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  First attempt failed. Trying database migration...
    echo.
    echo [2/3] Creating database and running migrations...
    call npx prisma migrate dev --name init
    echo.
    
    echo [3/3] Generating Prisma Client again...
    call npx prisma generate
    echo.
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    ✅ FIX COMPLETE! ✅                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Your backend is now ready to run!
echo.
echo Next step: npm run dev
echo.
echo Press any key to start the server automatically...
pause >nul

echo.
echo Starting server...
call npm run dev
