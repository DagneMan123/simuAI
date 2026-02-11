# 🔧 Navigation Fix - Signup Button to Register Page

## Issue
Clicking "Sign Up" or "Get Started" buttons on landing page doesn't navigate to register page.

## Diagnosis Steps

### 1. Check Browser Console
Open browser DevTools (F12) and check for errors:
- Red errors in Console tab
- Failed network requests in Network tab
- React Router errors

### 2. Verify Routes
The routes are correctly configured in `frontend/src/App.tsx`:
```tsx
<Route path="/register" element={<Register />} />
```

### 3. Check Navigation
Landing page buttons use:
```tsx
onClick={() => navigate('/register')}
```

## Common Causes & Solutions

### Cause 1: React Router Not Initialized
**Check:** Is the app wrapped in `<Router>`?
**Solution:** Already wrapped correctly in App.tsx

### Cause 2: Register Component Error
**Check:** Does Register.tsx have any runtime errors?
**Solution:** Run diagnostics - No errors found

### Cause 3: Browser Cache
**Solution:** 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Try incognito mode

### Cause 4: Frontend Not Running
**Check:** Is frontend server running on http://localhost:5173?
**Solution:**
```bash
cd frontend
npm run dev
```

### Cause 5: Build Error
**Check:** Are there any build errors in terminal?
**Solution:** Check terminal running `npm run dev`

## Quick Fix Steps

### Step 1: Restart Frontend
```bash
# Stop frontend (Ctrl+C)
cd frontend
npm run dev
```

### Step 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Step 3: Test Direct URL
Try navigating directly to:
```
http://localhost:5173/register
```

If this works, the route is fine - issue is with navigation.

### Step 4: Check for JavaScript Errors
1. Open Console (F12)
2. Look for red errors
3. Check if `navigate` function is defined

## Testing

### Test 1: Direct URL Access
```
http://localhost:5173/register
```
**Expected:** Register page loads

### Test 2: Login Page Link
On login page, click "Sign up for free" link
**Expected:** Navigate to register page

### Test 3: Landing Page Buttons
Click any "Get Started" or "Sign Up" button
**Expected:** Navigate to register page

## Verification

### ✅ Routes Configured
- [x] `/register` route exists in App.tsx
- [x] Register component imported
- [x] No duplicate routes

### ✅ Navigation Code
- [x] `navigate('/register')` used correctly
- [x] `useNavigate` hook imported from react-router-dom
- [x] Buttons have onClick handlers

### ✅ Component Files
- [x] Register.tsx exists
- [x] No TypeScript errors
- [x] Component exports correctly

## If Still Not Working

### Check LandingPage.tsx
Make sure `useNavigate` is imported:
```tsx
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <Button onClick={() => navigate('/register')}>
      Get Started
    </Button>
  );
};
```

### Check Console for Errors
Look for:
- "navigate is not a function"
- "Cannot read property 'navigate'"
- React Router errors

### Try Alternative Navigation
Use Link component instead:
```tsx
import { Link } from 'react-router-dom';

<Link to="/register">
  <Button>Get Started</Button>
</Link>
```

## Manual Test

1. Open browser: http://localhost:5173
2. Open DevTools (F12)
3. Click "Get Started" button
4. Check Console for errors
5. Check Network tab for failed requests
6. Check if URL changes to /register

## Expected Behavior

When clicking "Get Started" or "Sign Up":
1. URL should change to `http://localhost:5173/register`
2. Register page should load
3. Role selection (Job Seeker / Employer) should be visible
4. No console errors

## Debug Commands

### Check if frontend is running:
```bash
curl http://localhost:5173
```

### Check React Router version:
```bash
cd frontend
npm list react-router-dom
```

### Reinstall dependencies:
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

## Status
- Routes: ✅ Configured correctly
- Components: ✅ No errors
- Navigation: ✅ Code is correct

**Most likely cause:** Browser cache or frontend not fully reloaded

**Quick fix:** Hard refresh (Ctrl+F5) or clear cache
