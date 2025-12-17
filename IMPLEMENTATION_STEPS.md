# 📋 Step-by-Step Implementation Guide

## Phase 1: Backend Setup (5 minutes)

1. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Test the server locally:**
   ```bash
   npm run dev
   ```
   Server should start on `http://localhost:3001`

3. **Deploy backend:**
   - Use Railway, Render, or Heroku (see ONLINE_SETUP.md)
   - Note your server URL (e.g., `https://your-app.railway.app`)

## Phase 2: Frontend Setup (10 minutes)

1. **Install Socket.io client:**
   ```bash
   npm install socket.io-client
   ```

2. **Create environment variable:**
   Create `.env` file in root:
   ```
   VITE_SERVER_URL=https://your-server-url.com
   ```

3. **Update App.tsx:**
   - Add ONLINE game mode option
   - Integrate OnlineLobby component
   - Switch between local and online game logic

## Phase 3: Integration (15 minutes)

1. **Update GameControls.tsx:**
   - Add "Online" button
   - Show lobby when online mode selected

2. **Update useGameLogic or create wrapper:**
   - Use `useOnlineGame` hook for online mode
   - Keep `useGameLogic` for local/bot modes

3. **Test locally:**
   - Open two browser windows
   - Create room in one, join in other
   - Test gameplay

## Phase 4: Deployment (10 minutes)

1. **Deploy frontend to Vercel:**
   - Add environment variable: `VITE_SERVER_URL`
   - Deploy

2. **Test end-to-end:**
   - Share room ID with friend
   - Play online!

---

## Quick Commands Summary:

```bash
# Backend
cd server && npm install && npm run dev

# Frontend
npm install socket.io-client

# Deploy
# Backend: Railway/Render
# Frontend: Vercel (already set up)
```

---

## Features You'll Get:

✅ Real-time multiplayer
✅ Room-based matchmaking  
✅ Turn validation
✅ Win/draw detection
✅ Game reset
✅ Disconnection handling
✅ Copy room ID to share

---

## Next: I'll help you integrate this into your App.tsx!

