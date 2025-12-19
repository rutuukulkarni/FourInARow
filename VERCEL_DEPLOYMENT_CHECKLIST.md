# ✅ Vercel Deployment Checklist - Fix "Can't See Game"

## 🔍 Step 1: Check Environment Variables in Vercel

Your `.env` file has:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

**You MUST add these to Vercel:**

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these TWO variables:
   - `VITE_SUPABASE_URL` = (your Supabase project URL)
   - `VITE_SUPABASE_ANON_KEY` = (your Supabase anon key)

4. **IMPORTANT**: Make sure they're set for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. After adding, **Redeploy** your project

---

## 🔍 Step 2: Check Browser Console

After deployment, open your site and:

1. Press `F12` (or right-click → Inspect)
2. Go to **Console** tab
3. Look for errors (red text)

**Common errors:**
- `VITE_SUPABASE_URL is not defined` → Environment variables not set
- `Failed to fetch` → Supabase connection issue
- `Cannot read property...` → JavaScript error

---

## 🔍 Step 3: Verify Supabase Setup

1. Go to your Supabase dashboard
2. Check **Settings** → **API**
3. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`

4. Make sure your database table exists:
   - Go to **Table Editor**
   - You should see `game_rooms` table
   - If not, run the SQL from `supabase/schema.sql`

---

## 🔍 Step 4: Test Local vs Deployed

**Local (should work):**
```bash
npm run dev
```
Visit `http://localhost:5173` - does it work?

**Deployed:**
Visit your Vercel URL - does it work?

If local works but deployed doesn't → **Environment variables issue**

---

## 🔍 Step 5: Check Network Tab

1. Open browser DevTools (`F12`)
2. Go to **Network** tab
3. Refresh the page
4. Look for:
   - Failed requests (red)
   - 404 errors (missing files)
   - CORS errors (Supabase connection)

---

## 🔍 Step 6: Force Rebuild

If nothing works:

1. Go to Vercel dashboard
2. Click **Deployments**
3. Click **⋯** (three dots) on latest deployment
4. Click **Redeploy**
5. Make sure **Use existing Build Cache** is **UNCHECKED**
6. Click **Redeploy**

---

## 🐛 Common Issues & Fixes

### Issue: Blank page / nothing shows
**Fix**: Check browser console for JavaScript errors

### Issue: "Supabase URL or Anon Key not found"
**Fix**: Add environment variables in Vercel settings

### Issue: Game loads but online mode doesn't work
**Fix**: Check Supabase table exists and RLS policies are set

### Issue: Build succeeds but site is blank
**Fix**: Check if `index.html` is in root, check base path in `vite.config.ts`

---

## ✅ Quick Test

After setting environment variables:

1. Redeploy on Vercel
2. Visit your site
3. Open browser console (`F12`)
4. You should see NO red errors
5. Game should load and be playable

---

## 📝 Still Not Working?

Share:
1. Browser console errors (screenshot)
2. Network tab errors (screenshot)
3. Vercel deployment logs (if any errors)
4. Whether local dev works (`npm run dev`)

