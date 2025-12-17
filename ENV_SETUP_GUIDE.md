# 🔐 Environment Variables Setup Guide

## ✅ Current Status:

- ✅ `.env` file is in `.gitignore` - **Won't be pushed to GitHub** (CORRECT!)
- ✅ Your `.env` file is in the **correct location** (project root)
- ✅ Local development works with `.env` file

---

## 🚀 For Vercel Deployment:

### Step 1: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Select your project: `four-in-a-row`

2. **Navigate to Settings:**
   - Click **Settings** (gear icon)
   - Click **Environment Variables** (left sidebar)

3. **Add Your Variables:**

   **First Variable:**
   ```
   Name:  VITE_SUPABASE_URL
   Value: https://ihjrgaiqxmkxbomzmjeaj.supabase.co
   Environment: ☑ Production ☑ Preview ☑ Development
   ```

   **Second Variable:**
   ```
   Name:  VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloanJnYWlxbXhrYm9tem1lamFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NjI5MDYsImV4cCI6MjA4MTUzODkwNn0.bBmIJuIDSS9SC5hJpAdlObN3pfXmd26rF058x5EeLa0
   Environment: ☑ Production ☑ Preview ☑ Development
   ```

4. **Save and Redeploy:**
   - Click **Save** for each variable
   - Go to **Deployments** tab
   - Click **⋯** (three dots) → **Redeploy**

---

## 📁 File Structure (Correct):

```
four-in-a-row/
├── .env              ← Your actual keys (NOT in git) ✅
├── .env.example      ← Template (safe to commit)
├── .gitignore        ← Contains .env ✅
├── package.json
├── vite.config.js
└── src/
```

---

## ✅ Best Practices:

1. **Never commit `.env`** - Already in `.gitignore` ✅
2. **Commit `.env.example`** - Template with placeholder values
3. **Add to Vercel** - Environment variables in dashboard
4. **Use different keys** - Production vs Development (optional)

---

## 🔍 Verify It Works:

After deploying, check:
1. Open your deployed app
2. Try Online mode
3. If it works → Environment variables are set correctly! ✅

---

## 💡 Quick Reference:

**Local Development:**
- Uses `.env` file (in project root) ✅

**Vercel Deployment:**
- Uses Environment Variables (in Vercel dashboard)
- Set in: Settings → Environment Variables

**Both use the same variable names:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

Your setup is **100% correct**! Just add the variables to Vercel dashboard! 🎉

