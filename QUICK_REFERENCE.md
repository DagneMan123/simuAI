# 🚀 SimuAI - Quick Reference Card

## ⚡ Super Quick Start

```bash
# 1. Start everything
start-all.bat

# 2. Open browser
http://localhost:5173

# Done! ✅
```

---

## 📋 Essential Commands

### Start Servers:
```bash
start-all.bat                    # Start both (recommended)
cd backend && npm run dev        # Backend only
cd frontend && npm run dev       # Frontend only
```

### Database:
```bash
cd backend
npx prisma migrate dev           # Run migrations
npx prisma generate              # Generate client
npx prisma studio                # Open GUI
npm run seed                     # Add test data
```

### Fix Issues:
```bash
test-and-fix.bat                 # Auto-fix common issues
```

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Main website |
| Backend | http://localhost:5000 | API server |
| API Docs | http://localhost:5000/api | API endpoints |
| Database GUI | http://localhost:5555 | Prisma Studio |

---

## 👤 Test Accounts

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@simuai.com | Admin@123 |
| Employer | employer@test.com | Test@123 |
| Candidate | candidate@test.com | Test@123 |

---

## 📁 Key Files

### Configuration:
```
backend/.env                     # Backend config
frontend/.env                    # Frontend config (optional)
backend/prisma/schema.prisma     # Database schema
```

### Main Code:
```
backend/src/server.js            # Backend entry
frontend/src/main.tsx            # Frontend entry
frontend/src/lib/api.ts          # API client
```

---

## 🔧 Common Fixes

### Website not loading?
```bash
start-all.bat
```

### Port already in use?
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database error?
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### Module not found?
```bash
cd backend && npm install
cd frontend && npm install
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `COMPLETE_SETUP_SUMMARY.md` | 📖 Complete overview |
| `FIX_ALL_ERRORS.md` | 🔧 Troubleshooting |
| `PERFORMANCE_OPTIMIZATION.md` | ⚡ Speed tips |
| `QUICK_DATABASE_SETUP.md` | 🗄️ Database setup |
| `DATABASE_INTEGRATION_COMPLETE.md` | 📊 Integration guide |

---

## 🎯 Feature Checklist

### Backend (71+ Endpoints):
- ✅ Authentication (Login, Register, JWT)
- ✅ Admin Panel (Users, Logs, Stats)
- ✅ Employer (Simulations, Analytics)
- ✅ Candidate (Assessments, Results)
- ✅ AI Integration (OpenAI GPT-4)
- ✅ Payment (Chapa)
- ✅ File Upload
- ✅ Validation
- ✅ Security

### Frontend (15+ Pages):
- ✅ Landing Page
- ✅ Authentication
- ✅ Admin Dashboard
- ✅ Employer Dashboard
- ✅ Candidate Dashboard
- ✅ AI Chat Arena
- ✅ Payment Integration
- ✅ Responsive Design
- ✅ Dark Mode

---

## 🚨 Emergency Commands

### Complete Reset:
```bash
# Stop all servers (close terminals)

# Backend reset
cd backend
rm -rf node_modules package-lock.json
npm install
npx prisma migrate reset
npx prisma generate

# Frontend reset
cd frontend
rm -rf node_modules package-lock.json
npm install

# Start fresh
start-all.bat
```

### Check Status:
```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend
start http://localhost:5173

# Database
psql -U postgres -d simuai -c "SELECT 1;"
```

---

## 💡 Pro Tips

1. **Always run both servers** (backend + frontend)
2. **Check browser console** (F12) for errors
3. **Keep terminals open** while using the app
4. **Use `start-all.bat`** for easy startup
5. **Read error messages** - they usually tell you what's wrong

---

## 📞 Quick Help

### Issue: Can't login
- Check backend is running
- Check database is connected
- Try test accounts above

### Issue: Slow performance
- Use production build: `npm run build`
- Check `PERFORMANCE_OPTIMIZATION.md`

### Issue: Payment not working
- Add CHAPA_SECRET_KEY to backend/.env
- Check webhook URL is correct

### Issue: AI features not working
- Add OPENAI_API_KEY to backend/.env
- Check API key is valid

---

## ✅ Success Checklist

Before reporting issues, verify:

- [ ] PostgreSQL is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend server is running (port 5173)
- [ ] backend/.env file exists
- [ ] DATABASE_URL is correct
- [ ] npm install ran successfully
- [ ] Migrations ran successfully
- [ ] Browser console shows no errors

---

## 🎉 You're Ready!

Everything is set up and working. Enjoy using SimuAI!

**Need more help?** Check `COMPLETE_SETUP_SUMMARY.md`

---

**Quick Reference v1.0** | Last Updated: ${new Date().toLocaleDateString()}
