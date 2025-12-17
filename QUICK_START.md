# 🚀 Quick Start - Free Online Multiplayer (5 Minutes)

## Step 1: Create Supabase Account (2 minutes)

1. Go to **[supabase.com](https://supabase.com)**
2. Click **"Start your project"**
3. Sign up with **GitHub** (free)
4. Click **"New Project"**
5. Fill in:
   - **Name**: `four-in-a-row` (or any name)
   - **Database Password**: (save this, you won't need it for this)
   - **Region**: Choose closest to you
6. Click **"Create new project"**
7. Wait 2 minutes for setup

## Step 2: Set Up Database (1 minute)

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click **"Run"** (or press Ctrl+Enter)
5. ✅ Done! Your database is ready

## Step 3: Get Your Keys (30 seconds)

1. In Supabase dashboard, click **"Settings"** (gear icon)
2. Click **"API"** (under Project Settings)
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

## Step 4: Install & Configure (1 minute)

1. **Install Supabase:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Create `.env` file** in project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Restart dev server** (if running):
   ```bash
   npm run dev
   ```

## Step 5: Test It! (30 seconds)

1. Open your app
2. Click **Settings** → **Online** mode
3. Click **"Create Room"**
4. Share the room code with a friend
5. Friend joins with the code
6. Play online! 🎮

---

## ✅ That's It!

Your game now has **free online multiplayer**!

### What You Get:
- ✅ Real-time gameplay
- ✅ Room-based matchmaking
- ✅ No backend server needed
- ✅ Completely free
- ✅ Auto-scaling
- ✅ Works on Vercel

### Free Tier Includes:
- 500MB database (plenty!)
- 2GB bandwidth/month
- 50,000 monthly active users
- Real-time subscriptions

**More than enough for your game!** 🎉

---

## Troubleshooting:

**"Room not found"** → Check room code spelling
**"Room is full"** → Create a new room
**Connection issues** → Check `.env` file has correct keys

---

## Next: Integrate into App.tsx!

I can help you add the online mode to your main app component.

