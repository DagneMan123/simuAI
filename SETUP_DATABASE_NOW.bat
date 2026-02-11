@echo off
echo ========================================
echo Setting Up Database for SimuAI
echo ========================================
echo.

cd backend

echo Step 1: Generating Prisma Client...
call npx prisma generate
echo.

echo Step 2: Pushing Database Schema...
call npx prisma db push
echo.

echo Step 3: Creating Test Users...
call node -e "const bcrypt = require('bcryptjs'); const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); async function seed() { try { const hashedPassword = await bcrypt.hash('password123', 10); const admin = await prisma.user.upsert({ where: { email: 'admin@simuai.com' }, update: {}, create: { email: 'admin@simuai.com', password: hashedPassword, role: 'ADMIN', firstName: 'Admin', lastName: 'User', isVerified: true } }); const employer = await prisma.user.upsert({ where: { email: 'employer@simuai.com' }, update: {}, create: { email: 'employer@simuai.com', password: hashedPassword, role: 'EMPLOYER', firstName: 'Employer', lastName: 'User', company: 'Test Company', isVerified: true } }); const candidate = await prisma.user.upsert({ where: { email: 'candidate@simuai.com' }, update: {}, create: { email: 'candidate@simuai.com', password: hashedPassword, role: 'CANDIDATE', firstName: 'Candidate', lastName: 'User', isVerified: true } }); console.log('Test users created successfully!'); console.log('Admin:', admin.email); console.log('Employer:', employer.email); console.log('Candidate:', candidate.email); } catch (error) { console.error('Error:', error); } finally { await prisma.$disconnect(); } } seed();"
echo.

echo ========================================
echo Database Setup Complete!
echo ========================================
echo.
echo Test Users Created:
echo.
echo 1. Admin:
echo    Email: admin@simuai.com
echo    Password: password123
echo.
echo 2. Employer:
echo    Email: employer@simuai.com
echo    Password: password123
echo.
echo 3. Candidate:
echo    Email: candidate@simuai.com
echo    Password: password123
echo.
echo ========================================
echo Now start the backend server:
echo npm start
echo ========================================
echo.

pause
