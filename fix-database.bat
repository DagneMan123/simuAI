@echo off
echo Fixing database schema...
cd backend
call npx prisma generate
call npx prisma db push --accept-data-loss
echo Database fixed!
pause
