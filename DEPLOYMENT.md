# 🚀 Deploy to Vercel - Step by Step Guide

## Prerequisites
- ✅ Your code is already on GitHub: https://github.com/rutuukulkarni/FourInARow
- ✅ Project is ready for deployment

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign up or log in with your GitHub account

### Step 2: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find and select **`rutuukulkarni/FourInARow`**
4. Click **"Import"**

### Step 3: Configure Project Settings
Vercel will auto-detect Vite, but verify these settings:
- **Framework Preset**: Vite (auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Your app will be live at: `https://four-in-a-row-xxx.vercel.app`

### Step 5: Custom Domain (Optional)
1. Go to your project settings
2. Click **"Domains"**
3. Add your custom domain

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No** (first time)
- Project name? **four-in-a-row** (or your choice)
- Directory? **./** (current directory)
- Override settings? **No**

### Step 4: Production Deploy
```bash
vercel --prod
```

---

## Automatic Deployments

Once connected to GitHub, Vercel will:
- ✅ **Auto-deploy** on every push to `main` branch
- ✅ **Preview deployments** for pull requests
- ✅ **Build logs** available in dashboard

---

## Troubleshooting

### Build Fails?
1. Check build logs in Vercel dashboard
2. Verify `package.json` has correct build script
3. Ensure all dependencies are in `dependencies` or `devDependencies`

### Environment Variables?
If you need env variables:
1. Go to Project Settings → Environment Variables
2. Add your variables
3. Redeploy

---

## Your Project is Ready! 🎉

Your `vercel.json` is already configured. Just follow the steps above!

