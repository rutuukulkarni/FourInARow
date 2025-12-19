# 🔧 Troubleshooting: Game Not Showing After Vercel Deployment

## ✅ Build is Successful - But Game Doesn't Show?

Your build is working perfectly (completes in ~4 seconds). The issue is likely **runtime** (what happens when someone visits your site).

---

## 🔍 Step-by-Step Diagnosis

### 1. **Open Browser Console** (Most Important!)

1. Visit your Vercel URL
2. Press `F12` (or right-click → Inspect)
3. Click **Console** tab
4. Look for **RED errors**

**What to look for:**
- ❌ `Failed to fetch` → Supabase connection issue
- ❌ `Cannot read property...` → JavaScript error
- ❌ `VITE_SUPABASE_URL is not defined` → Environment variables missing
- ❌ `Module not found` → Build/import issue

**Take a screenshot** of any red errors and share them.

---

### 2. **Check Environment Variables in Vercel**

**This is the #1 cause of issues!**

1. Go to Vercel Dashboard
2. Your Project → **Settings** → **Environment Variables**
3. You MUST have these TWO variables:
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Make sure they're enabled for:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

5. **After adding/changing variables:**
   - Go to **Deployments**
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**

---

### 3. **Test Local vs Deployed**

**Local (should work):**
```bash
npm run dev
```
Visit `http://localhost:5173`

**Questions:**
- ✅ Does local work? → Environment variables issue on Vercel
- ❌ Does local also fail? → Code issue, check console errors

---

### 4. **Check Network Tab**

1. Open DevTools (`F12`)
2. **Network** tab
3. Refresh page
4. Look for:
   - ❌ Failed requests (red)
   - ❌ 404 errors (missing files)
   - ❌ CORS errors

---

### 5. **Check if HTML is Loading**

1. Right-click on page → **View Page Source**
2. You should see:
   ```html
   <div id="root"></div>
   ```
3. If you see this → HTML is loading, issue is JavaScript
4. If you see blank/error → Build issue

---

## 🐛 Common Issues & Quick Fixes

### Issue: **Blank White Page**
**Possible causes:**
1. JavaScript error (check console)
2. Missing environment variables
3. Build failed silently

**Fix:**
- Check browser console for errors
- Verify environment variables in Vercel
- Try redeploying without cache

---

### Issue: **"Supabase URL or Anon Key not found"**
**Fix:**
- Add environment variables in Vercel Settings
- Redeploy after adding

---

### Issue: **Game loads but online mode doesn't work**
**Fix:**
- Check Supabase dashboard
- Verify `game_rooms` table exists
- Check RLS (Row Level Security) policies

---

### Issue: **"Module not found" or import errors**
**Fix:**
- Check if all files are committed to Git
- Verify `package.json` has all dependencies
- Try: `npm install` locally, then push

---

## ✅ Quick Test Checklist

After deployment, check:

- [ ] Site loads (not blank)
- [ ] Browser console has NO red errors
- [ ] Environment variables set in Vercel
- [ ] Game board is visible
- [ ] Can click columns (for local modes)
- [ ] Online mode works (if testing)

---

## 📸 What to Share if Still Not Working

1. **Browser console screenshot** (F12 → Console tab)
2. **Network tab screenshot** (F12 → Network tab)
3. **Vercel environment variables** (Settings → Environment Variables - screenshot)
4. **Does local dev work?** (`npm run dev` result)

---

## 🚀 Force Fresh Deploy

If nothing works:

1. Vercel Dashboard → **Deployments**
2. Click **⋯** (three dots) on latest
3. Click **Redeploy**
4. **UNCHECK** "Use existing Build Cache"
5. Click **Redeploy**

This forces a completely fresh build.

---

## 💡 Pro Tips

1. **Always check console first** - 90% of issues show there
2. **Environment variables** - Most common issue
3. **Clear browser cache** - Sometimes old JS is cached
4. **Try incognito mode** - Rules out browser extensions
5. **Check mobile** - Sometimes desktop works but mobile doesn't

---

## 🆘 Still Stuck?

Share:
1. Browser console errors (screenshot)
2. Whether local dev works
3. Environment variables status (screenshot from Vercel)
4. Network tab errors (if any)

The error messages will tell us exactly what's wrong! 🔍

