# ⚡ Performance Optimization Guide

## Why Website Might Not Display or Run Slow

### Common Issues and Solutions

---

## 🔴 Issue 1: Website Not Displaying

### Possible Causes:
1. **Backend not running**
2. **Frontend not running**
3. **Database not connected**
4. **Port conflicts**
5. **Missing environment variables**

### Solutions:

#### Quick Fix - Run Both Servers:
```bash
# Use the automated script
start-all.bat

# OR manually:
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

#### Check if Servers are Running:
```bash
# Check backend (should return JSON)
curl http://localhost:5000/api/health

# Check frontend (should open in browser)
start http://localhost:5173
```

#### Fix Port Conflicts:
```bash
# If port 5000 is busy, change in backend/.env:
PORT=5001

# If port 5173 is busy, change in frontend/vite.config.ts:
server: { port: 3000 }
```

---

## 🐌 Issue 2: Slow Performance

### Backend Optimizations:

#### 1. Database Query Optimization
```javascript
// ❌ BAD - N+1 Query Problem
const users = await prisma.user.findMany();
for (const user of users) {
  const profile = await prisma.profile.findUnique({ 
    where: { userId: user.id } 
  });
}

// ✅ GOOD - Use include
const users = await prisma.user.findMany({
  include: { profile: true }
});
```

#### 2. Add Database Indexes
```prisma
// In schema.prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  
  @@index([email])  // Add index for faster lookups
  @@index([createdAt])
}
```

#### 3. Use Pagination
```javascript
// ❌ BAD - Load all data
const allUsers = await prisma.user.findMany();

// ✅ GOOD - Paginate
const users = await prisma.user.findMany({
  take: 20,
  skip: (page - 1) * 20
});
```

#### 4. Cache Expensive Queries
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 min cache

async function getStats() {
  const cached = cache.get('stats');
  if (cached) return cached;
  
  const stats = await calculateStats(); // Expensive operation
  cache.set('stats', stats);
  return stats;
}
```

### Frontend Optimizations:

#### 1. Use React Query Caching
```typescript
// Already implemented in your code!
const { data } = useQuery({
  queryKey: ['analytics'],
  queryFn: fetchAnalytics,
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  cacheTime: 10 * 60 * 1000
});
```

#### 2. Lazy Load Components
```typescript
// ❌ BAD - Load everything upfront
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';

// ✅ GOOD - Lazy load
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
```

#### 3. Optimize Images
```bash
# Install image optimization
npm install vite-plugin-imagemin -D

# Add to vite.config.ts
import viteImagemin from 'vite-plugin-imagemin';

export default {
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9] },
      svgo: { plugins: [{ name: 'removeViewBox' }] }
    })
  ]
};
```

#### 4. Code Splitting
```typescript
// Vite does this automatically, but you can optimize routes:
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('./pages/Dashboard')),
  },
  {
    path: '/analytics',
    component: lazy(() => import('./pages/Analytics')),
  }
];
```

---

## 🚀 Quick Performance Wins

### 1. Enable Compression (Backend)
```javascript
// In server.js
const compression = require('compression');
app.use(compression());
```

### 2. Use Production Build (Frontend)
```bash
# Development (slower)
npm run dev

# Production (faster)
npm run build
npm run preview
```

### 3. Reduce Bundle Size
```bash
# Analyze bundle
cd frontend
npm run build
npx vite-bundle-visualizer

# Remove unused dependencies
npm prune
```

### 4. Optimize Tailwind CSS
```javascript
// tailwind.config.js - Already optimized!
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Purge unused styles
  theme: { extend: {} },
};
```

---

## 📊 Performance Monitoring

### Check Backend Performance:
```javascript
// Add to server.js
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.url} took ${duration}ms`);
    }
  });
  next();
});
```

### Check Frontend Performance:
```typescript
// In main.tsx
if (import.meta.env.DEV) {
  import('react-dom/profiling').then(({ Profiler }) => {
    // Use React Profiler in development
  });
}
```

### Browser DevTools:
1. Open Chrome DevTools (F12)
2. Go to "Performance" tab
3. Click "Record"
4. Navigate your app
5. Stop recording
6. Analyze slow operations

---

## 🔧 Environment-Specific Optimizations

### Development (.env.development):
```env
VITE_API_URL=http://localhost:5000/api
NODE_ENV=development
```

### Production (.env.production):
```env
VITE_API_URL=https://api.yourdomain.com/api
NODE_ENV=production
```

---

## 🎯 Performance Checklist

### Backend:
- [ ] Database indexes added
- [ ] Queries use `include` instead of multiple queries
- [ ] Pagination implemented
- [ ] Compression enabled
- [ ] Caching for expensive operations
- [ ] Connection pooling configured

### Frontend:
- [ ] React Query caching enabled
- [ ] Lazy loading for routes
- [ ] Images optimized
- [ ] Production build used
- [ ] Unused dependencies removed
- [ ] Code splitting implemented

### Database:
- [ ] PostgreSQL running
- [ ] Indexes on frequently queried fields
- [ ] Connection pool size configured
- [ ] Query performance monitored

---

## 🆘 Troubleshooting Slow Performance

### 1. Check Database Queries
```bash
# Enable Prisma query logging
# In backend/.env
DATABASE_URL="postgresql://...?connection_limit=10"
DEBUG="prisma:query"
```

### 2. Check Network Requests
```
Open Browser DevTools > Network Tab
Look for:
- Red requests (failed)
- Slow requests (>1s)
- Large payloads (>1MB)
```

### 3. Check Memory Usage
```bash
# Backend
node --max-old-space-size=4096 src/server.js

# Check memory
node -e "console.log(process.memoryUsage())"
```

### 4. Check CPU Usage
```bash
# Windows Task Manager
Ctrl + Shift + Esc

# Look for:
- Node.js using >50% CPU
- Chrome using >2GB RAM
```

---

## 💡 Quick Fixes for Common Issues

### Issue: "Cannot connect to database"
```bash
# Check PostgreSQL is running
# Windows: Services > PostgreSQL
# Or install and start:
# Download from: https://www.postgresql.org/download/
```

### Issue: "Port already in use"
```bash
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

### Issue: "Module not found"
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "White screen on frontend"
```bash
# Check browser console (F12)
# Common fixes:
1. Clear browser cache (Ctrl + Shift + Delete)
2. Check backend is running
3. Check API URL in .env
4. Restart frontend server
```

---

## 🎉 Expected Performance Metrics

### Good Performance:
- **Page Load**: < 2 seconds
- **API Response**: < 500ms
- **Database Query**: < 100ms
- **Bundle Size**: < 500KB (gzipped)
- **Time to Interactive**: < 3 seconds

### If Slower:
1. Check database indexes
2. Enable caching
3. Use production build
4. Optimize images
5. Reduce API payload size

---

## 📞 Still Having Issues?

1. Check `DATABASE_INTEGRATION_COMPLETE.md`
2. Check `QUICK_DATABASE_SETUP.md`
3. Run `test-and-fix.bat`
4. Check browser console for errors
5. Check backend logs for errors

---

**Status**: Performance guide complete! ⚡
