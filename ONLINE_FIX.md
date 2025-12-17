# 🔧 Online Game Board Visibility Fix

## Problem:
After a player joins with a room code, the game board wasn't showing up even though both players were connected.

## Root Cause:
The condition for showing the board was checking `!isWaiting`, but the `isWaiting` state wasn't being properly updated when player 2 joined, especially for player 1 who was already in the room.

## Solution:

### 1. **Improved Subscription Logic** (`useSupabaseGame.ts`)
- Updated the subscription to properly detect when the game is ready
- Game is ready when: `player2_id` exists AND `game_status === 'playing'`
- Automatically sets `isWaiting = false` when game is ready

### 2. **Better Board Visibility Condition** (`App.tsx`)
- Changed from: `(roomCode && !isWaiting)`
- Changed to: `(roomCode && onlineRoom && onlineRoom.player2_id && onlineRoom.game_status !== 'waiting')`
- This directly checks the room state instead of relying on `isWaiting` flag

### 3. **Exposed Room Object**
- Added `room` to the return value of `useSupabaseGame` hook
- Allows direct access to room state for more reliable checks

## How It Works Now:

1. **Player 1 creates room:**
   - `isWaiting = true`
   - Lobby shows with room code
   - Board is hidden

2. **Player 2 joins:**
   - Room is updated with `player2_id`
   - `game_status` changes to `'playing'`
   - Subscription fires for both players
   - `isWaiting = false` for both players
   - Board appears for both players ✅

3. **Game starts:**
   - Both players see the board
   - Both can make moves (when it's their turn)
   - Real-time updates work correctly

## Testing:
- ✅ Player 1 creates room → sees lobby
- ✅ Player 2 joins → both see board immediately
- ✅ Real-time updates work
- ✅ Moves sync correctly

The fix ensures that the board visibility is based on the actual room state rather than a potentially stale `isWaiting` flag.

