# 👨‍💼 Admin Login Setup Guide

## 🎯 How to Create and Login as Admin

Since this is a new system, you need to create the first admin account. Here are the methods:

---

## Method 1: Register as Admin (Recommended for Development)

### Step 1: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 2: Register with Admin Role

1. Go to: `http://localhost:3000/register`
2. Fill in the registration form:
   - **First Name:** Your first name
   - **Last Name:** Your last name
   - **Email:** admin@simuai.com (or your email)
   - **Password:** Strong password (min 8 characters)
   - **Role:** Select "Employer" (we'll change this to Admin)

3. Click "Create Account"

### Step 3: Manually Update Role in Database

Since the registration doesn't allow direct admin creation (security), you need to update the database:

**Option A: Using Prisma Studio (Easiest)**
```bash
cd backend
npx prisma studio
```
- Opens at `http://localhost:5555`
- Click on "User" table
- Find your user
- Change `role` from `EMPLOYER` to `ADMIN`
- Save

**Option B: Using PostgreSQL Command**
```bash
# Connect to PostgreSQL
psql -U simuai -d simuai

# Update user role
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@simuai.com';

# Exit
\q
```

### Step 4: Login as Admin

1. Go to: `http://localhost:3000/login`
2. Enter your credentials:
   - **Email:** admin@simuai.com
   - **Password:** Your password
3. Click "Sign In"
4. You'll be redirected to `/admin` dashboard

---

## Method 2: Create Admin via Database Seed Script

Create a seed script to automatically create admin users.

### Create Seed File

**File:** `backend/prisma/seed.js`

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@simuai.com' },
    update: {},
    create: {
      email: 'admin@simuai.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Test Employer
  const employerPassword = await bcrypt.hash('Employer@123', 10);
  const employer = await prisma.user.upsert({
    where: { email: 'employer@simuai.com' },
    update: {},
    create: {
      email: 'employer@simuai.com',
      password: employerPassword,
      firstName: 'Test',
      lastName: 'Employer',
      role: 'EMPLOYER',
      emailVerified: true,
    },
  });
  console.log('✅ Employer user created:', employer.email);

  // Create Test Candidate
  const candidatePassword = await bcrypt.hash('Candidate@123', 10);
  const candidate = await prisma.user.upsert({
    where: { email: 'candidate@simuai.com' },
    update: {},
    create: {
      email: 'candidate@simuai.com',
      password: candidatePassword,
      firstName: 'Test',
      lastName: 'Candidate',
      role: 'CANDIDATE',
      emailVerified: true,
    },
  });
  console.log('✅ Candidate user created:', candidate.email);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Update package.json

Add to `backend/package.json`:
```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

### Run Seed Script

```bash
cd backend
npx prisma db seed
```

### Default Test Accounts

After seeding, you can login with:

**Admin Account:**
- Email: `admin@simuai.com`
- Password: `Admin@123`
- Access: Full admin dashboard

**Employer Account:**
- Email: `employer@simuai.com`
- Password: `Employer@123`
- Access: Employer dashboard

**Candidate Account:**
- Email: `candidate@simuai.com`
- Password: `Candidate@123`
- Access: Candidate dashboard

---

## Method 3: Direct Database Insert

If you have direct database access:

```sql
-- Connect to database
psql -U simuai -d simuai

-- Insert admin user (password is 'Admin@123' hashed)
INSERT INTO "User" (id, email, password, "firstName", "lastName", role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@simuai.com',
  '$2a$10$YourHashedPasswordHere',
  'Admin',
  'User',
  'ADMIN',
  true,
  NOW(),
  NOW()
);
```

**Note:** You need to hash the password first using bcrypt.

---

## 🔐 Admin Login Flow

### 1. Access Login Page
```
http://localhost:3000/login
```

### 2. Enter Credentials
- **Email:** admin@simuai.com
- **Password:** Your admin password

### 3. Automatic Redirect
After successful login, the system automatically redirects based on role:
- **ADMIN** → `/admin` (Admin Dashboard)
- **EMPLOYER** → `/dashboard` (Employer Dashboard)
- **CANDIDATE** → `/my-assessments` (Candidate Dashboard)

---

## 🎯 Admin Dashboard Features

Once logged in as admin, you have access to:

### 1. User Management (`/admin/users`)
- View all users
- Filter by role (Admin, Employer, Candidate)
- Update user status (Active, Suspended)
- Search users

### 2. System Logs (`/admin/logs`)
- View system activity logs
- Filter by log level (Info, Warning, Error)
- Search logs

### 3. Statistics (`/admin/stats`)
- Total users count
- Total assessments
- Revenue metrics
- Active users

### 4. Verification (`/admin/verification`)
- Verify employer accounts
- Review company information
- Approve/reject applications

### 5. Invitations Management
- View all invitations
- Resend invitations
- Delete invitations

---

## 🔧 Troubleshooting

### Issue: "Invalid credentials"
**Solution:**
- Check email is correct
- Verify password
- Ensure user role is set to 'ADMIN' in database

### Issue: "Redirected to wrong dashboard"
**Solution:**
- Check user role in database
- Clear browser cache
- Logout and login again

### Issue: "Cannot access admin routes"
**Solution:**
- Verify JWT token contains role: 'ADMIN'
- Check backend middleware is working
- Ensure user is authenticated

### Issue: "Database connection error"
**Solution:**
- Check PostgreSQL is running
- Verify DATABASE_URL in backend/.env
- Run: `npx prisma generate`

---

## 📝 Quick Reference

### Test Admin Credentials (After Seeding)
```
Email: admin@simuai.com
Password: Admin@123
URL: http://localhost:3000/login
```

### Database Commands
```bash
# Open Prisma Studio
npx prisma studio

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Check User Role
```sql
SELECT email, role FROM "User" WHERE email = 'admin@simuai.com';
```

### Update User Role
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## 🚀 Production Setup

For production, create admin users securely:

### 1. Environment Variable Method

Add to `backend/.env`:
```env
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=SecurePassword123!
```

### 2. Admin Creation Script

Create `backend/scripts/create-admin.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdmin() {
  rl.question('Admin Email: ', async (email) => {
    rl.question('Admin Password: ', async (password) => {
      rl.question('First Name: ', async (firstName) => {
        rl.question('Last Name: ', async (lastName) => {
          
          const hashedPassword = await bcrypt.hash(password, 10);
          
          const admin = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              firstName,
              lastName,
              role: 'ADMIN',
              emailVerified: true,
            },
          });
          
          console.log('✅ Admin created successfully!');
          console.log('Email:', admin.email);
          console.log('Role:', admin.role);
          
          rl.close();
          await prisma.$disconnect();
        });
      });
    });
  });
}

createAdmin();
```

Run:
```bash
node backend/scripts/create-admin.js
```

---

## 📊 Admin Permissions

Admins have full access to:
- ✅ All user management
- ✅ All simulations (view/edit/delete)
- ✅ All submissions
- ✅ System logs
- ✅ Platform statistics
- ✅ Payment records
- ✅ All API endpoints

---

## 🎓 Best Practices

1. **Strong Passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Use password manager

2. **Secure Email**
   - Use company email domain
   - Enable 2FA (when implemented)

3. **Regular Audits**
   - Review admin actions
   - Monitor system logs
   - Check user activities

4. **Backup Admin**
   - Create at least 2 admin accounts
   - Use different emails
   - Document credentials securely

---

## 📞 Need Help?

If you're still having issues:

1. Check backend logs: `cd backend && npm run dev`
2. Check frontend console: Browser DevTools (F12)
3. Verify database connection: `npx prisma studio`
4. Test API directly: Use Postman or curl

---

**Ready to login as admin!** 🎉

Default test credentials (after seeding):
- Email: `admin@simuai.com`
- Password: `Admin@123`
- URL: `http://localhost:3000/login`
