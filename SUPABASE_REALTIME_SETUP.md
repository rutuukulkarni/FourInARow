# Supabase Real-Time Setup Guide

## Critical: Enable Real-Time Replication

For the online multiplayer to work, you **MUST** enable real-time replication for the `game_rooms` table in Supabase.

### Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to: https://app.supabase.com
   - Select your project

2. **Enable Real-Time for the table**
   - Go to **Database** → **Replication**
   - Find `game_rooms` in the list
   - Toggle the switch to **ON** (enable real-time replication)
   - If you don't see the table, make sure you've run the SQL schema from `supabase/schema.sql`

3. **Alternative: Enable via SQL**
   ```sql
   -- Enable real-time for game_rooms table
   ALTER PUBLICATION supabase_realtime ADD TABLE game_rooms;
   ```

4. **Verify Real-Time is Working**
   - Go to **Database** → **Replication**
   - You should see `game_rooms` with a green checkmark
   - Status should show "Active"

## Why This is Required

Supabase real-time subscriptions use PostgreSQL's logical replication feature. Without enabling replication for your table, the real-time subscriptions will not receive updates when the database changes.

## Troubleshooting

If real-time is not working:

1. ✅ Check that replication is enabled for `game_rooms`
2. ✅ Verify your Supabase project is on a plan that supports real-time (Free tier supports it)
3. ✅ Check browser console for subscription errors
4. ✅ Verify environment variables are set correctly in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Testing Real-Time

After enabling replication, test by:
1. Opening the game in two browser windows
2. Creating a room in one window
3. Joining with the code in the other window
4. Making a move - both windows should update immediately

