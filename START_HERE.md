# 🎯 START HERE - SimuAI Quick Launch

## ⚡ 3-Step Quick Start

### Step 1: Setup Database (One Time)
```bash
cd backend
npx prisma migrate dev
npx prisma generate
npm run seed
```

### Step 2: Start Servers
```bash
# Go back to root folder
cd ..

# Run this script
start-all.bat
```

### Step 3: Open Browser
```
http://localhost:5173
```

**That's it! Your website should now be running! 🎉**

---

## 🔍 Is It Working?

### ✅ Success Indicators:
- Backend terminal shows: "Server running on port 5000"
- Frontend terminal shows: "Local: http://localhost:5173"
- Browser opens automatically
- Landing page loads with no errors
- No red errors in browser console (F12)

### ❌ If Something's Wrong:
1. Check `FIX_ALL_ERRORS.md`
2. Run `test-and-fix.bat`
3. Check browser console (F12)
4. Check backend terminal for errors

---

## 📚 Important Files

### Must Read:
1. **QUICK_REFERENCE.md** - Quick commands and tips
2. **FIX_ALL_ERRORS.md** - If something breaks
3. **COMPLETE_SETUP_SUMMARY.md** - Full overview

### Optional Reading:
4. **PERFORMANCE_OPTIMIZATION.md** - Make it faster
5. **DATABASE_INTEGRATION_COMPLETE.md** - Database details
6. **DATA_FLOW_ARCHITECTURE.md** - How it works

---

## 🎮 Test Accounts

After running `npm run seed`, use these:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@simuai.com | Admin@123 |
| Employer | employer@test.com | Test@123 |
| Candidate | candidate@test.com | Test@123 |

---

## 🚨 Common First-Time Issues

### Issue: "Cannot find module"
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Issue: "Database connection failed"
```bash
# Make sure PostgreSQL is running
# Check backend/.env has correct DATABASE_URL
```

### Issue: "Port already in use"
```bash
# Kill the process or change port in .env
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📋 Pre-Flight Checklist

Before starting, make sure you have:

- [ ] Node.js v18+ installed
- [ ] PostgreSQL installed and running
- [ ] npm installed
- [ ] Git installed (optional)
- [ ] Code editor (VS Code recommended)

---

## 🎯 What to Do Next

### After First Launch:
1. ✅ Test login with test accounts
2. ✅ Explore admin dashboard
3. ✅ Create a simulation as employer
4. ✅ Take an assessment as candidate
5. ✅ Check all pages work

### Then:
1. Read `COMPLETE_SETUP_SUMMARY.md`
2. Customize for your needs
3. Add your own data
4. Configure payment (Chapa)
5. Configure AI (OpenAI)

---

## 💡 Pro Tips

1. **Keep both terminals open** while using the app
2. **Use `start-all.bat`** for easy startup
3. **Check browser console** (F12) if something looks wrong
4. **Read error messages** - they usually tell you what's wrong
5. **Use test accounts** to explore features

---

## 🆘 Need Help?

### Quick Fixes:
- Run `test-and-fix.bat`
- Check `FIX_ALL_ERRORS.md`
- Check `QUICK_REFERENCE.md`

### Still Stuck?
- Check browser console (F12)
- Check backend terminal for errors
- Read the error message carefully
- Check `COMPLETE_SETUP_SUMMARY.md`

---

## ✨ You're All Set!

Everything is ready. Just run the 3 steps above and you're good to go!

**Happy coding! 🚀**

---

**Quick Start Guide v1.0** | ${new Date().toLocaleDateString()}
