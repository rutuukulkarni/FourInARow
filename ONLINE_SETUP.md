# 🚀 Quick Setup Guide for Online Multiplayer

## Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

## Step 2: Start Backend Server

```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3001`

## Step 3: Install Frontend Dependencies

In your main project directory:

```bash
npm install socket.io-client
```

## Step 4: Update Frontend Code

I'll create a new hook `useOnlineGame` that integrates with the Socket.io server.

## Step 5: Deploy Backend

### Option A: Railway (Easiest)
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo, choose `server` folder
4. Add environment variable: `PORT=3001`
5. Deploy!

### Option B: Render
1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub repo
4. Root Directory: `server`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Deploy!

### Option C: Heroku
```bash
cd server
heroku create your-app-name
git subtree push --prefix server heroku main
```

## Step 6: Update Frontend

Update your frontend to connect to the deployed server URL.

## Features Included:
- ✅ Room creation/joining
- ✅ Real-time move synchronization
- ✅ Turn validation
- ✅ Win/draw detection
- ✅ Game reset
- ✅ Disconnection handling