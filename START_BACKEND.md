# 🚀 Quick Start - Backend Server

## Step 1: Install Dependencies (if not done)
```bash
cd backend
npm install
```

## Step 2: Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with test accounts (Admin, Employer, Candidate)
npx prisma db seed
```

## Step 3: Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

## ✅ Expected Output
```
🚀 Server running on port 5000
✅ Database connected
🔌 Socket.IO initialized
```

## 🎯 Test Accounts (After Seeding)

**Admin Account:**
- Email: `admin@simuai.com`
- Password: `Admin@123`
- Dashboard: http://localhost:3000/admin

**Employer Account:**
- Email: `employer@simuai.com`
- Password: `Employer@123`
- Dashboard: http://localhost:3000/dashboard

**Candidate Account:**
- Email: `candidate@simuai.com`
- Password: `Candidate@123`
- Dashboard: http://localhost:3000/my-assessments

## 🔧 Troubleshooting

### Error: "Cannot find module 'C:\...\backend\server'"
**Solution:** Don't run `node server`, use `npm run dev` or `npm start`

### Error: "Database connection failed"
**Solution:** 
1. Make sure PostgreSQL is running
2. Check DATABASE_URL in `.env` file
3. Run: `npx prisma generate`

### Error: "Port 5000 already in use"
**Solution:** 
1. Change PORT in `.env` to another port (e.g., 5001)
2. Or kill the process using port 5000

### Error: "Prisma Client not generated"
**Solution:** Run `npx prisma generate`

## 📝 Common Commands

```bash
# View database in browser
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name your_migration_name

# Seed database again
npx prisma db seed
```

## 🌐 API Endpoints

Once running, API is available at: `http://localhost:5000`

Test endpoints:
- Health check: `GET http://localhost:5000/health`
- Login: `POST http://localhost:5000/api/auth/login`
- Register: `POST http://localhost:5000/api/auth/register`

## 📊 Next Steps

1. Start backend: `npm run dev`
2. Start frontend: `cd ../frontend && npm run dev`
3. Login at: http://localhost:3000/login
4. Use test accounts above

---

**Ready to go!** 🎉
