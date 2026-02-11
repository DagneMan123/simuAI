# 🚀 How to Start Your Website

## The Problem

You're trying to access `http://localhost:3000/` but the website is not showing. This is because **the development server is not running**.

Think of it like this:
- Your code = A restaurant's kitchen
- Dev server = Opening the restaurant
- Browser = Customer trying to enter

If the restaurant is closed (server not running), customers can't enter (browser can't show website)!

## Visual Flow

### What's Happening Now (Not Working)
```
┌─────────────────────────────────────┐
│  You open browser                   │
│  Type: http://localhost:3000/       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Browser tries to connect...        │
│  ❌ No server running!              │
│  ❌ Connection refused               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Result: Blank page or error        │
│  "This site can't be reached"       │
└─────────────────────────────────────┘
```

### What Should Happen (Working)
```
┌─────────────────────────────────────┐
│  STEP 1: Start server               │
│  Terminal: npm run dev              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Server starts on port 3000         │
│  ✅ VITE ready                      │
│  ✅ Local: http://localhost:3000/  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  STEP 2: Open browser               │
│  Go to: http://localhost:3000/      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Browser connects to server         │
│  ✅ Server responds                 │
│  ✅ Sends HTML, CSS, JS             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Result: Website displays!          │
│  ✅ Homepage shows                  │
│  ✅ All features work               │
└─────────────────────────────────────┘
```

## Step-by-Step Instructions

### Step 1: Open Terminal
```
Windows Key → Type "cmd" → Press Enter
```

### Step 2: Navigate to Frontend Folder
```bash
cd C:\Users\Hena\Desktop\simuAI\frontend
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Wait for Success Message
You should see:
```
VITE v5.4.21  ready in 1234 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Step 5: Open Browser
1. Open Chrome, Edge, or Firefox
2. Type in address bar: `http://localhost:3000/`
3. Press Enter

### Step 6: See Your Website!
You should now see the SimuAI homepage!

## Quick Start (Automated)

Just double-click this file:
```
start-frontend.bat
```

It will:
1. Navigate to frontend folder
2. Install dependencies (if needed)
3. Start the dev server
4. Show you the URL to open

## Two Servers Needed

Your application has TWO parts:

### Frontend Server (Port 3000)
```
Location: frontend folder
Command: npm run dev
URL: http://localhost:3000/
Purpose: Serves the website (React app)
```

### Backend Server (Port 5000)
```
Location: backend folder
Command: npm start
URL: http://localhost:5000/
Purpose: Handles API requests (database, auth, etc.)
```

**You need BOTH running for full functionality!**

## Terminal Windows

### Terminal 1: Frontend
```bash
cd C:\Users\Hena\Desktop\simuAI\frontend
npm run dev
# Keep this terminal open!
```

### Terminal 2: Backend
```bash
cd C:\Users\Hena\Desktop\simuAI\backend
npm start
# Keep this terminal open!
```

## Common Issues

### Issue 1: "npm is not recognized"
**Problem:** Node.js not installed
**Solution:** Install Node.js from https://nodejs.org/

### Issue 2: "Cannot find module"
**Problem:** Dependencies not installed
**Solution:**
```bash
cd frontend
npm install
npm run dev
```

### Issue 3: "Port 3000 is already in use"
**Problem:** Another process using port 3000
**Solution:**
```bash
# Find the process
netstat -ano | findstr :3000

# Kill it (replace <PID> with actual number)
taskkill /PID <PID> /F

# Start server again
npm run dev
```

### Issue 4: Blank page in browser
**Problem:** Browser cache or wrong URL
**Solution:**
1. Check URL is `http://localhost:3000/`
2. Press `Ctrl + Shift + R` (hard refresh)
3. Clear cache: `Ctrl + Shift + Delete`
4. Try Incognito: `Ctrl + Shift + N`

### Issue 5: "This site can't be reached"
**Problem:** Server not running
**Solution:** Go back to terminal and run `npm run dev`

## Verification Checklist

Before opening browser, verify:

- [ ] Terminal is open
- [ ] You're in the `frontend` folder
- [ ] You ran `npm run dev`
- [ ] Terminal shows "Local: http://localhost:3000/"
- [ ] No red errors in terminal

Then open browser:

- [ ] URL is `http://localhost:3000/` (not 5173, not 5000)
- [ ] Browser cache is cleared
- [ ] You see the SimuAI homepage

## What You Should See

### In Terminal:
```
VITE v5.4.21  ready in 1234 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### In Browser:
- SimuAI logo and navigation
- "Sign In" and "Get Started" buttons
- Hero section with gradient background
- Features section (6 cards)
- Pricing section (3 plans)
- Testimonials section
- Footer

## Stopping the Server

When you're done:
1. Go to terminal
2. Press `Ctrl + C`
3. Type `Y` and press Enter

## Summary

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. Open terminal                                       │
│  2. cd frontend                                         │
│  3. npm run dev                                         │
│  4. Wait for "Local: http://localhost:3000/"           │
│  5. Open browser → http://localhost:3000/              │
│  6. See your website!                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**The code is perfect. You just need to start the server!**
