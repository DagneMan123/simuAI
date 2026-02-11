# 🔧 BACKEND FIX - Complete Setup Guide

## The Problem

- Login shows "Invalid credentials"
- Register not working
- Backend not functioning

## Root Cause

The database hasn't been initialized. You need to:
1. Generate Prisma Client
2. Create database tables
3. Create test users

## Quick Fix (Automated)

### Option 1: Use the Batch File (Easiest)
```bash
# Just double-click this file:
SETUP_AND_START.bat
```

This will automatically:
- Generate Prisma Client
- Create database tables
- Create test users
- Start the backend server

### Option 2: Manual Setup (Step by Step)

#### Step 1: Open Terminal
```bash
cd C:\Users\Hena\Desktop\simuAI\backend
```

#### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

Expected output:
```
✔ Generated Prisma Client
```

#### Step 3: Create Database Tables
```bash
npx prisma db push
```

Expected output:
```
✔ Database synchronized
```

#### Step 4: Create Test Users
```bash
node setup-db.js
```

Expected output:
```
✅ Admin created: admin@simuai.com
✅ Employer created: employer@simuai.com
✅ Candidate created: candidate@simuai.com
```

#### Step 5: Start Backend Server
```bash
npm start
```

Expected output:
```
AI-Hire Backend Server Started!
===================================
Port: 5000
Environment: development
Database: PostgreSQL (Connected)
===================================
```

## Test Users Created

After running the setup, you'll have these test users:

### 1. Admin User
```
Email: admin@simuai.com
Password: password123
Role: ADMIN
Dashboard: /admin
```

### 2. Employer User
```
Email: employer@simuai.com
Password: password123
Role: EMPLOYER
Company: Test Company
Dashboard: /dashboard
```

### 3. Candidate User
```
Email: candidate@simuai.com
Password: password123
Role: CANDIDATE
Dashboard: /my-assessments
```

## Testing Login

### Test 1: Admin Login
1. Go to: `http://localhost:3000/login`
2. Enter:
   - Email: `admin@simuai.com`
   - Password: `password123`
3. Click "Sign In"
4. Should redirect to `/admin` dashboard

### Test 2: Employer Login
1. Go to: `http://localhost:3000/login`
2. Enter:
   - Email: `employer@simuai.com`
   - Password: `password123`
3. Click "Sign In"
4. Should redirect to `/dashboard`

### Test 3: Candidate Login
1. Go to: `http://localhost:3000/login`
2. Enter:
   - Email: `candidate@simuai.com`
   - Password: `password123`
3. Click "Sign In"
4. Should redirect to `/my-assessments`

## Testing Register

### Test New User Registration
1. Go to: `http://localhost:3000/register`
2. Fill form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Role: Select `Candidate` or `Employer`
   - Company: (if Employer) `My Company`
3. Click "Create Account"
4. Should redirect to appropriate dashboard

## Troubleshooting

### Error: "Cannot find module 'bcryptjs'"
**Solution:**
```bash
cd backend
npm install
```

### Error: "Database connection failed"
**Causes:**
1. PostgreSQL not running
2. Wrong DATABASE_URL in .env

**Solution:**
1. Start PostgreSQL service
2. Check `.env` file:
```
DATABASE_URL="postgresql://postgres:MYlove8%23@localhost:5432/Simuai?schema=public"
```

### Error: "Prisma Client not generated"
**Solution:**
```bash
npx prisma generate
```

### Error: "Table does not exist"
**Solution:**
```bash
npx prisma db push
```

### Error: "Invalid credentials" (after setup)
**Causes:**
1. Test users not created
2. Wrong email/password

**Solution:**
1. Run: `node setup-db.js` again
2. Use exact credentials:
   - Email: `admin@simuai.com`
   - Password: `password123`

## Verify Backend is Running

When backend starts successfully, you should see:

```
AI-Hire Backend Server Started!
===================================
Port: 5000
Environment: development
Database: PostgreSQL (Connected)
API: http://localhost:5000/api
Docs: http://localhost:5000/api/docs
WebSocket: Ready
===================================
```

## Complete Setup Sequence

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies (if not done)
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Create database tables
npx prisma db push

# 5. Create test users
node setup-db.js

# 6. Start server
npm start
```

## Quick Start (All in One)

```bash
cd backend && npm install && npx prisma generate && npx prisma db push && node setup-db.js && npm start
```

## Files Created

1. **backend/setup-db.js** - Script to create test users
2. **SETUP_AND_START.bat** - Automated setup and start
3. **FIX_BACKEND_NOW.txt** - Quick reference guide

## What Happens After Setup

### Database Tables Created:
- ✅ User
- ✅ Simulation
- ✅ SimulationStep
- ✅ Rubric
- ✅ Invitation
- ✅ UserSimulation
- ✅ Submission
- ✅ Analytics

### Test Users Created:
- ✅ Admin (admin@simuai.com)
- ✅ Employer (employer@simuai.com)
- ✅ Candidate (candidate@simuai.com)

### Backend Ready:
- ✅ API endpoints working
- ✅ Authentication functional
- ✅ Database connected
- ✅ Ready to accept requests

## Summary

✅ **Setup script created** - `setup-db.js`
✅ **Batch file created** - `SETUP_AND_START.bat`
✅ **Test users ready** - 3 users with different roles
✅ **Complete guide** - Step-by-step instructions

**Just run `SETUP_AND_START.bat` or follow the manual steps above!**
