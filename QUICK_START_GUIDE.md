# 🚀 SimuAI - Quick Start Guide

## ⚡ Fastest Way to Start (Windows)

### Option 1: Use Batch Scripts (Recommended)

**Terminal 1 - Start Backend:**
```bash
start-backend.bat
```

**Terminal 2 - Start Frontend:**
```bash
start-frontend.bat
```

These scripts will automatically:
- Install dependencies
- Setup database
- Create test accounts
- Start the servers

---

## 📋 Manual Setup (Step by Step)

### Step 1: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed database with test accounts
npx prisma db seed

# Start backend server
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ Database connected
🔌 Socket.IO initialized
```

### Step 2: Setup Frontend (New Terminal)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

**Expected Output:**
```
VITE v5.4.21  ready in 3905 ms
➜  Local:   http://localhost:3000/
```

---

## 🎯 Test Accounts (Created by Seed Script)

After running `npx prisma db seed`, you'll have these accounts:

### 👨‍💼 Admin Account
- **Email:** `admin@simuai.com`
- **Password:** `Admin@123`
- **Access:** Full admin dashboard
- **URL:** http://localhost:3000/login → redirects to `/admin`

### 🏢 Employer Account
- **Email:** `employer@simuai.com`
- **Password:** `Employer@123`
- **Access:** Employer dashboard
- **URL:** http://localhost:3000/login → redirects to `/dashboard`

### 👤 Candidate Account
- **Email:** `candidate@simuai.com`
- **Password:** `Candidate@123`
- **Access:** Candidate dashboard
- **URL:** http://localhost:3000/login → redirects to `/my-assessments`

---

## 🔐 How to Login as Admin

1. **Start both servers** (backend and frontend)
2. **Open browser:** http://localhost:3000/login
3. **Enter credentials:**
   - Email: `admin@simuai.com`
   - Password: `Admin@123`
4. **Click "Sign In"**
5. **Automatic redirect** to admin dashboard at `/admin`

---

## 🎨 Admin Dashboard Features

Once logged in as admin, you can access:

### 📊 Dashboard (`/admin`)
- Total users count
- Total assessments
- Revenue metrics
- Active users statistics

### 👥 User Management (`/admin/users`)
- View all users (Admin, Employer, Candidate)
- Filter by role
- Update user status (Active, Suspended)
- Search users by name/email

### 📝 System Logs (`/admin/logs`)
- View system activity logs
- Filter by log level (Info, Warning, Error)
- Search logs by content
- Real-time log updates

### ✅ Verification (`/admin/verification`)
- Verify employer accounts
- Review company information
- Approve/reject applications

### ⚙️ Settings (`/admin/settings`)
- System configuration
- Platform settings
- Security settings

---

## 🔧 Common Issues & Solutions

### Issue 1: "Cannot find module 'C:\...\backend\server'"
**Problem:** Running `node server` instead of using npm scripts

**Solution:**
```bash
cd backend
npm run dev
```

### Issue 2: "Database connection failed"
**Problem:** PostgreSQL not running or wrong credentials

**Solution:**
1. Start PostgreSQL service
2. Check `backend/.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:MYlove8#@localhost:5432/Simuai"
   ```
3. Run: `npx prisma generate`

### Issue 3: "Port 5000 already in use"
**Problem:** Another process is using port 5000

**Solution:**
1. Change PORT in `backend/.env`:
   ```env
   PORT=5001
   ```
2. Update `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5001
   ```

### Issue 4: "Prisma Client not generated"
**Problem:** Prisma Client needs to be generated after schema changes

**Solution:**
```bash
cd backend
npx prisma generate
```

### Issue 5: "Test accounts don't exist"
**Problem:** Database not seeded

**Solution:**
```bash
cd backend
npx prisma db seed
```

### Issue 6: Tailwind CSS errors
**Problem:** Tailwind v4 configuration issues

**Solution:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Verify Everything is Working

### 1. Check Backend Health
Open: http://localhost:5000/health

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-02-10T..."
}
```

### 2. Check Frontend
Open: http://localhost:3000

You should see the professional landing page with:
- Hero section with animated badge
- Feature cards
- Pricing section
- Testimonials

### 3. Test Admin Login
1. Go to: http://localhost:3000/login
2. Login with: `admin@simuai.com` / `Admin@123`
3. Should redirect to: http://localhost:3000/admin
4. Should see admin dashboard with statistics

### 4. Test API Endpoints
Using Postman or curl:

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@simuai.com\",\"password\":\"Admin@123\"}"
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "admin@simuai.com",
    "role": "ADMIN",
    "firstName": "Admin",
    "lastName": "User"
  }
}
```

---

## 🗄️ Database Management

### View Database in Browser
```bash
cd backend
npx prisma studio
```
Opens at: http://localhost:5555

### Reset Database (WARNING: Deletes all data)
```bash
cd backend
npx prisma migrate reset
```

### Create New Admin User Manually
```bash
cd backend
npx prisma studio
```
1. Click "User" table
2. Click "Add record"
3. Fill in:
   - email: your@email.com
   - password: (use bcrypt hash)
   - role: ADMIN
   - firstName: Your Name
   - lastName: Last Name
   - isVerified: true
4. Save

---

## 📁 Project Structure

```
simuAI/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── services/        # AI, payment services
│   │   └── server.js        # Main server file
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Test data seeding
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # All pages (Admin, Employer, Candidate)
│   │   ├── components/      # Reusable components
│   │   ├── lib/             # API services, utilities
│   │   ├── hooks/           # Custom React hooks
│   │   └── contexts/        # Auth, Socket contexts
│   ├── .env                 # Frontend environment variables
│   └── package.json
│
├── start-backend.bat        # Windows script to start backend
├── start-frontend.bat       # Windows script to start frontend
├── QUICK_START_GUIDE.md     # This file
└── ADMIN_SETUP.md           # Detailed admin setup guide
```

---

## 🌐 URLs Reference

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:5000 | REST API |
| Prisma Studio | http://localhost:5555 | Database GUI |
| Login Page | http://localhost:3000/login | User login |
| Admin Dashboard | http://localhost:3000/admin | Admin panel |
| Employer Dashboard | http://localhost:3000/dashboard | Employer panel |
| Candidate Dashboard | http://localhost:3000/my-assessments | Candidate panel |

---

## 🎓 Next Steps

1. ✅ **Start servers** using batch scripts or manual commands
2. ✅ **Login as admin** using test account
3. ✅ **Explore admin dashboard** features
4. 📝 **Create your first simulation** as employer
5. 👥 **Invite candidates** to assessments
6. 📊 **Review results** and analytics
7. 💳 **Test payment integration** with Chapa
8. 🤖 **Test AI features** in simulations

---

## 📞 Need Help?

### Check Logs

**Backend logs:**
- Terminal where backend is running
- Look for errors in red

**Frontend logs:**
- Browser DevTools (F12)
- Console tab
- Look for errors in red

### Common Commands

```bash
# Backend
cd backend
npm run dev              # Start development server
npm start                # Start production server
npx prisma studio        # Open database GUI
npx prisma db seed       # Seed test accounts
npx prisma generate      # Generate Prisma Client

# Frontend
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
```

---

## ✅ Success Checklist

- [ ] PostgreSQL is running
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Database migrated (`npx prisma migrate dev`)
- [ ] Database seeded (`npx prisma db seed`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access landing page (http://localhost:3000)
- [ ] Can login as admin (admin@simuai.com / Admin@123)
- [ ] Admin dashboard loads successfully
- [ ] No errors in browser console
- [ ] No errors in backend terminal

---

**🎉 You're all set! Start building amazing AI-powered assessments!**

For detailed admin features, see: `ADMIN_SETUP.md`
For integration guides, see: `INTEGRATION_GUIDE.md`
For full verification, see: `FINAL_VERIFICATION.md`
