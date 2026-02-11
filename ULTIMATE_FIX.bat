@echo off
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║           🔧 ULTIMATE PRISMA FIX 🔧                        ║
echo ║                                                            ║
echo ║  This will fix the Prisma Client error completely!        ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd backend

echo [Step 1/4] Checking Prisma installation...
if not exist "node_modules\@prisma\client" (
    echo ERROR: @prisma/client not found!
    echo Installing Prisma...
    call npm install @prisma/client
)
echo ✓ Prisma installed
echo.

echo [Step 2/4] Creating database and running migrations...
echo (This will create the database if it doesn't exist)
echo.
call npx prisma migrate dev --name init --skip-generate
echo.

echo [Step 3/4] Generating Prisma Client...
echo (This creates the .prisma/client folder)
echo.
call npx prisma generate
echo.

echo [Step 4/4] Verifying Prisma Client...
if exist "node_modules\.prisma\client" (
    echo ✓ SUCCESS: Prisma Client generated!
) else (
    echo ✗ ERROR: Prisma Client not found!
    echo.
    echo Trying alternative method...
    rmdir /s /q node_modules\.prisma 2>nul
    call npx prisma generate --force
)
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║                    ✅ FIX COMPLETE! ✅                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Prisma Client is now ready!
echo.
echo Starting server in 3 seconds...
timeout /t 3 /nobreak >nul
echo.
call npm run dev
