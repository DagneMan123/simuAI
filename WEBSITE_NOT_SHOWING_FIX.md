# 🔧 WEBSITE NOT SHOWING IN BROWSER - TROUBLESHOOTING

## Problem
The homepage/website is not displaying in the browser when you go to `http://localhost:3000/`

## Possible Causes & Solutions

### 1. Frontend Server Not Running

**Check if server is running:**
```bash
# Open terminal in frontend folder
cd frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**If you see errors:**
- Missing dependencies → Run `npm install`
- Port already in use → Kill process or use different port
- Build errors → Check console for specific errors

### 2. Wrong URL

**Make sure you're using the correct URL:**
- ✅ Correct: `http://localhost:3000/`
- ❌ Wrong: `http://localhost:5173/` (old Vite default)
- ❌ Wrong: `http://localhost:5000/` (backend port)
- ❌ Wrong: `https://localhost:3000/` (should be http, not https)

### 3. Browser Cache Issues

**Clear browser cache:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Select "Cookies and site data"
4. Click "Clear data"
5. Close and reopen browser

**Or use Incognito mode:**
- Press `Ctrl + Shift + N`
- Go to `http://localhost:3000/`

### 4. Port Already in Use

**Check if port 3000 is already in use:**
```bash
# Windows
netstat -ano | findstr :3000

# If something is using it, kill the process:
taskkill /PID <PID_NUMBER> /F
```

### 5. Missing Dependencies

**Install all dependencies:**
```bash
cd frontend
npm install
```

**If errors persist, try clean install:**
```bash
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

### 6. Build Errors

**Check for TypeScript/Build errors:**
```bash
cd frontend
npm run build
```

If you see errors, they need to be fixed before the dev server will work.

### 7. Firewall/Antivirus Blocking

**Check if firewall is blocking:**
- Temporarily disable firewall
- Try accessing `http://127.0.0.1:3000/` instead
- Add exception for Node.js in firewall

### 8. React/Vite Configuration Issues

**Check vite.config.ts:**
```typescript
export default defineConfig({
  server: {
    port: 3000,  // Should be 3000
    // ...
  },
})
```

## Step-by-Step Fix

### Step 1: Stop All Servers
```bash
# Press Ctrl + C in all terminal windows
# Or close all terminals
```

### Step 2: Clean Install Frontend
```bash
cd frontend
npm install
```

### Step 3: Start Frontend Server
```bash
cd frontend
npm run dev
```

**Wait for this message:**
```
➜  Local:   http://localhost:3000/
```

### Step 4: Open Browser
1. Open browser (Chrome, Edge, Firefox)
2. Go to: `http://localhost:3000/`
3. Press `Ctrl + Shift + R` (hard refresh)

### Step 5: Check Browser Console
1. Press `F12` to open DevTools
2. Go to "Console" tab
3. Look for any red errors
4. Share those errors if you see any

## Common Error Messages

### Error: "Cannot GET /"
**Cause:** Frontend server not running
**Fix:** Start frontend server with `npm run dev`

### Error: "This site can't be reached"
**Cause:** Wrong URL or server not running
**Fix:** 
- Check URL is `http://localhost:3000/`
- Make sure server is running

### Error: "ERR_CONNECTION_REFUSED"
**Cause:** Server not running or wrong port
**Fix:**
- Start server: `npm run dev`
- Check correct port in terminal output

### Error: Blank white page
**Cause:** JavaScript error or build issue
**Fix:**
- Press F12 and check Console for errors
- Check Network tab for failed requests

### Error: "Failed to fetch dynamically imported module"
**Cause:** Browser cache or build issue
**Fix:**
- Clear cache: `Ctrl + Shift + Delete`
- Hard refresh: `Ctrl + Shift + R`
- Restart dev server

## Quick Diagnostic Commands

### Check if frontend dependencies are installed:
```bash
cd frontend
dir node_modules
```
Should show many folders. If empty, run `npm install`

### Check if server is running:
```bash
netstat -ano | findstr :3000
```
Should show LISTENING. If not, server is not running.

### Check for build errors:
```bash
cd frontend
npm run build
```
Should complete without errors.

## What Should Happen

When everything is working:

1. **Terminal shows:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

2. **Browser shows:**
- SimuAI homepage with hero section
- Navigation bar at top
- "Sign In" and "Get Started" buttons
- Features, pricing, testimonials sections

3. **Console shows:**
- No red errors
- Maybe some info messages (normal)

## Still Not Working?

### Collect This Information:

1. **Terminal output when running `npm run dev`:**
   - Copy the entire output
   - Look for error messages

2. **Browser console errors:**
   - Press F12
   - Go to Console tab
   - Copy any red error messages

3. **Network tab:**
   - Press F12
   - Go to Network tab
   - Refresh page
   - Look for failed requests (red)

4. **What you see:**
   - Blank white page?
   - Error message?
   - Loading forever?
   - Nothing at all?

Share this information for further help.

## Emergency Reset

If nothing works, try complete reset:

```bash
# 1. Stop all servers (Ctrl + C)

# 2. Delete node_modules
cd frontend
rmdir /s /q node_modules
del package-lock.json

# 3. Clean install
npm install

# 4. Start server
npm run dev

# 5. Open browser in Incognito
# Press Ctrl + Shift + N
# Go to http://localhost:3000/
```

## Summary

Most common issues:
1. ❌ Server not running → Run `npm run dev`
2. ❌ Wrong URL → Use `http://localhost:3000/`
3. ❌ Browser cache → Clear cache or use Incognito
4. ❌ Missing dependencies → Run `npm install`
5. ❌ Port in use → Kill process or use different port

**The code is correct. The issue is likely server not running or browser cache.**
