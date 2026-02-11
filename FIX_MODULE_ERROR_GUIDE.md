# 🔧 Fix MODULE_NOT_FOUND Error

## The Problem
You're seeing this error:
```
Error: Cannot find module 'helmet'
at Module.require (node:internal/modules/cjs/loader:1487:12)
```

This means npm packages are not installed in the backend folder.

---

## ✅ Quick Fix (Recommended)

### Option 1: Use Automated Script
```bash
# Run this from the root folder
COMPLETE_FIX.bat
```

This will:
- Clean old installations
- Install all dependencies
- Generate Prisma client
- Verify everything works

---

## 🔧 Manual Fix (If Script Doesn't Work)

### Step 1: Go to Backend Folder
```bash
cd backend
```

### Step 2: Remove Old Files (Optional but Recommended)
```bash
# Windows Command Prompt
rmdir /s /q node_modules
del package-lock.json

# Or PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
```

### Step 3: Install Dependencies
```bash
npm install
```

This will install all required packages:
- express
- helmet
- cors
- prisma
- @prisma/client
- And 15+ more packages

**Wait 2-3 minutes** for installation to complete.

### Step 4: Generate Prisma Client
```bash
npx prisma generate
```

### Step 5: Verify Installation
```bash
# Check if node_modules exists
dir node_modules

# You should see folders like:
# - express
# - helmet
# - cors
# - @prisma
# etc.
```

### Step 6: Test the Server
```bash
npm run dev
```

You should see:
```
Server running on port 5000
Database connected successfully
```

---

## 🎯 What Each Package Does

| Package | Purpose |
|---------|---------|
| express | Web server framework |
| helmet | Security headers |
| cors | Cross-origin requests |
| @prisma/client | Database client |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| multer | File uploads |
| socket.io | Real-time updates |
| express-validator | Input validation |
| compression | Response compression |
| morgan | Request logging |
| dotenv | Environment variables |

---

## 🚨 Common Issues

### Issue 1: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/

### Issue 2: "EACCES: permission denied"
**Solution**: Run as administrator or use:
```bash
npm install --no-optional
```

### Issue 3: "Network timeout"
**Solution**: Check internet connection or use:
```bash
npm install --registry=https://registry.npmjs.org/
```

### Issue 4: "Prisma generate failed"
**Solution**: Make sure DATABASE_URL is set in backend/.env:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/simuai"
```

### Issue 5: "Cannot find module after install"
**Solution**: Clear npm cache and reinstall:
```bash
npm cache clean --force
npm install
```

---

## ✅ Verification Checklist

After running the fix, verify:

- [ ] `node_modules` folder exists in backend
- [ ] `node_modules` has 100+ folders
- [ ] `node_modules/express` exists
- [ ] `node_modules/helmet` exists
- [ ] `node_modules/@prisma/client` exists
- [ ] `npm run dev` starts without errors
- [ ] Server shows "running on port 5000"

---

## 🚀 After Fix is Complete

### Start the Backend:
```bash
cd backend
npm run dev
```

### Start the Frontend (in another terminal):
```bash
cd frontend
npm run dev
```

### Or use the automated script:
```bash
# From root folder
start-all.bat
```

---

## 📞 Still Having Issues?

### Check These:
1. Node.js version: `node --version` (should be v18+)
2. npm version: `npm --version` (should be v9+)
3. Internet connection
4. Antivirus not blocking npm
5. Enough disk space (need ~500MB)

### Get More Help:
- Check `FIX_ALL_ERRORS.md`
- Check `COMPLETE_SETUP_SUMMARY.md`
- Run `COMPLETE_FIX.bat`

---

## 💡 Pro Tips

1. **Always run `npm install` after cloning** a project
2. **Delete `node_modules` if you have issues** and reinstall
3. **Use `npm ci` instead of `npm install`** for faster, cleaner installs
4. **Keep Node.js updated** to the latest LTS version
5. **Check package.json** to see what packages are needed

---

## ✨ Expected Result

After successful fix, you should see:

```
✅ node_modules folder created
✅ 100+ packages installed
✅ Prisma client generated
✅ Server starts without errors
✅ No MODULE_NOT_FOUND errors
```

---

**Status**: Ready to fix! Run `COMPLETE_FIX.bat` now! 🚀
