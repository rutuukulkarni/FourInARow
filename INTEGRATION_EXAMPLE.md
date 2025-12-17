# 🔌 How to Integrate Online Mode into App.tsx

## Simple Integration Pattern:

```tsx
// In App.tsx, add conditional logic:

const { gameMode } = useGameLogic();
const onlineGame = useSupabaseGame();

// Use online game when mode is ONLINE
const gameData = gameMode === GameMode.ONLINE ? onlineGame : useGameLogic();

// Show lobby when online mode and waiting
{gameMode === GameMode.ONLINE && (onlineGame.isWaiting || !onlineGame.roomCode) && (
  <OnlineLobby
    roomCode={onlineGame.roomCode}
    isWaiting={onlineGame.isWaiting}
    error={onlineGame.error}
    onCreateRoom={onlineGame.createRoom}
    onJoinRoom={onlineGame.joinRoom}
  />
)}
```

## Full Example:

See the complete integration in the next step - I'll update your App.tsx file!

