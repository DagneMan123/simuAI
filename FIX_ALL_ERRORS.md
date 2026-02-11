# 🔧 Fix All Errors - Complete Guide

## Quick Start (If Website Not Displaying)

### Step 1: Run the Automated Fix
```bash
# Run this first!
test-and-fix.bat
```

### Step 2: Start Both Servers
```bash
# This will start backend and frontend automatically
start-all.bat
```

### Step 3: Open Browser
```
http://localhost:5173
```

---

## 🚨 Common Errors and Fixes

### Error 1: "Cannot find module"

**Symptoms:**
```
Error: Cannot find module 'express'
Error: Cannot find module '@prisma/client'
```

**Fix:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

### Error 2: "Port already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
Error: Port 5173 is already in use
```

**Fix Option 1 - Kill the process:**
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F

# Same for port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Fix Option 2 - Change port:**
```env
# backend/.env
PORT=5001

# frontend/vite.config.ts
server: { port: 3000 }
```

---

### Error 3: "Database connection failed"

**Symptoms:**
```
Error: Can't reach database server
PrismaClientInitializationError
```

**Fix:**
```bash
# 1. Check PostgreSQL is running
# Windows: Open Services, find PostgreSQL, start it

# 2. Check DATABASE_URL in backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/simuai?schema=public"

# 3. Create database if it doesn't exist
psql -U postgres
CREATE DATABASE simuai;
\q

# 4. Run migrations
cd backend
npx prisma migrate dev
npx prisma generate
```

---

### Error 4: "JWT must be provided"

**Symptoms:**
```
401 Unauthorized
JWT must be provided
```

**Fix:**
```javascript
// This is expected for protected routes
// You need to login first:

1. Go to http://localhost:5173/login
2. Login with credentials
3. Token will be stored automatically
4. Try accessing the page again
```

---

### Error 5: "CORS Error"

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:**
```javascript
// backend/src/server.js - Already fixed!
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

### Error 6: "OpenAI API Error"

**Symptoms:**
```
Error: Invalid API key
Error: Rate limit exceeded
```

**Fix:**
```env
# backend/.env
OPENAI_API_KEY=sk-your-actual-key-here

# Get key from: https://platform.openai.com/api-keys
```

---

### Error 7: "Chapa Payment Error"

**Symptoms:**
```
Error: Invalid Chapa secret key
Payment initialization failed
```

**Fix:**
```env
# backend/.env
CHAPA_SECRET_KEY=CHASECK-your-actual-key-here

# Get key from: https://dashboard.chapa.co/
```

---

### Error 8: "TypeScript Errors"

**Symptoms:**
```
TS2304: Cannot find name 'X'
TS2345: Argument of type 'X' is not assignable
```

**Fix:**
```bash
# Frontend
cd frontend

# Check errors
npx tsc --noEmit

# If errors persist, check:
1. All imports are correct
2. Types are properly defined
3. Dependencies are installed

# Restart TypeScript server in VS Code:
Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

---

### Error 9: "White Screen / Blank Page"

**Symptoms:**
- Browser shows white screen
- No errors in terminal
- Page doesn't load

**Fix:**
```bash
# 1. Check browser console (F12)
# Look for JavaScript errors

# 2. Clear browser cache
Ctrl + Shift + Delete
Select "Cached images and files"
Click "Clear data"

# 3. Check if backend is running
curl http://localhost:5000/api/health

# 4. Check if frontend is running
# Should see "VITE v5.x.x ready" in terminal

# 5. Restart both servers
# Close terminals and run: start-all.bat
```

---

### Error 10: "Prisma Client Not Generated"

**Symptoms:**
```
Error: @prisma/client did not initialize yet
Cannot find module '@prisma/client'
```

**Fix:**
```bash
cd backend
npx prisma generate
npm run dev
```

---

## 🔍 Diagnostic Commands

### Check if Everything is Running:
```bash
# Check backend
curl http://localhost:5000/api/health

# Check frontend
start http://localhost:5173

# Check database
psql -U postgres -d simuai -c "SELECT 1;"
```

### Check Logs:
```bash
# Backend logs (in backend terminal)
# Look for errors in red

# Frontend logs (in frontend terminal)
# Look for compilation errors

# Browser console (F12)
# Look for JavaScript errors
```

### Check Environment Variables:
```bash
# Backend
cd backend
type .env

# Should have:
# - DATABASE_URL
# - JWT_SECRET
# - OPENAI_API_KEY (optional)
# - CHAPA_SECRET_KEY (optional)
```

---

## 🎯 Step-by-Step Troubleshooting

### If Website Won't Load:

1. **Check Backend:**
   ```bash
   cd backend
   npm run dev
   # Should see: "Server running on port 5000"
   ```

2. **Check Frontend:**
   ```bash
   cd frontend
   npm run dev
   # Should see: "Local: http://localhost:5173"
   ```

3. **Check Database:**
   ```bash
   # Make sure PostgreSQL is running
   # Check Services in Windows
   ```

4. **Check Browser:**
   ```
   Open: http://localhost:5173
   Press F12 to see console errors
   ```

5. **Check Network:**
   ```
   F12 > Network tab
   Look for failed requests (red)
   ```

---

## 🚀 Performance Issues

### If Website is Slow:

1. **Use Production Build:**
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

2. **Check Database Queries:**
   ```env
   # backend/.env
   DEBUG=prisma:query
   ```

3. **Enable Caching:**
   ```javascript
   // Already implemented in React Query!
   ```

4. **Optimize Images:**
   ```bash
   # Compress images before uploading
   # Use WebP format
   ```

---

## 📋 Pre-Launch Checklist

Before running the website:

- [ ] PostgreSQL is installed and running
- [ ] Node.js v18+ is installed
- [ ] npm is installed
- [ ] backend/.env file exists with all variables
- [ ] frontend/.env file exists (optional)
- [ ] Dependencies installed (npm install in both folders)
- [ ] Database migrated (npx prisma migrate dev)
- [ ] Ports 5000 and 5173 are available

---

## 🆘 Emergency Reset

If nothing works, do a complete reset:

```bash
# 1. Stop all servers
# Close all terminal windows

# 2. Delete node_modules
cd backend
rm -rf node_modules package-lock.json
cd ../frontend
rm -rf node_modules package-lock.json

# 3. Reinstall everything
cd ../backend
npm install
cd ../frontend
npm install

# 4. Reset database
cd ../backend
npx prisma migrate reset
npx prisma generate

# 5. Start fresh
cd ..
start-all.bat
```

---

## 📞 Still Having Issues?

### Check These Files:
1. `PERFORMANCE_OPTIMIZATION.md` - Performance tips
2. `DATABASE_INTEGRATION_COMPLETE.md` - Database setup
3. `QUICK_DATABASE_SETUP.md` - Quick setup guide

### Common Mistakes:
- ❌ Not running backend server
- ❌ Not running frontend server
- ❌ Database not running
- ❌ Wrong DATABASE_URL
- ❌ Missing .env file
- ❌ Wrong port numbers
- ❌ Firewall blocking ports

### Debug Mode:
```bash
# Backend with debug
cd backend
set DEBUG=* && npm run dev

# Frontend with verbose
cd frontend
npm run dev -- --debug
```

---

## ✅ Success Indicators

You know it's working when:

✅ Backend terminal shows: "Server running on port 5000"
✅ Frontend terminal shows: "Local: http://localhost:5173"
✅ Browser opens automatically to http://localhost:5173
✅ Landing page loads with no errors
✅ F12 console shows no red errors
✅ Network tab shows successful API calls (200 status)

---

## 🎉 Final Notes

- **First time setup takes 5-10 minutes**
- **Subsequent starts take 10-30 seconds**
- **Use `start-all.bat` for easy startup**
- **Keep both terminal windows open while using the app**
- **Check browser console (F12) for any errors**

---

**Status**: Complete error fix guide ready! 🔧
