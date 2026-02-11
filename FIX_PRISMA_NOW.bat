@echo off
echo ========================================
echo   Fixing Prisma Client Error
echo ========================================
echo.

cd backend

echo Step 1: Generating Prisma Client...
call npx prisma generate

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Prisma generate failed!
    echo.
    echo Possible reasons:
    echo 1. DATABASE_URL not set in .env
    echo 2. schema.prisma has errors
    echo.
    echo Trying to fix...
    echo.
    
    echo Step 2: Running Prisma migrate...
    call npx prisma migrate dev --name init
    
    echo.
    echo Step 3: Generating again...
    call npx prisma generate
)

echo.
echo ========================================
echo   Fix Complete!
echo ========================================
echo.
echo Now try: npm run dev
echo.
pause
