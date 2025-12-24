-- Create rooms table
CREATE TABLE IF NOT EXISTS game_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT UNIQUE NOT NULL,
  player1_id TEXT,
  player2_id TEXT,
  board JSONB DEFAULT '[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]'::jsonb,
  current_player INTEGER DEFAULT 1,
  game_status TEXT DEFAULT 'waiting',
  winner INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_room_code ON game_rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_game_status ON game_rooms(game_status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_game_rooms_updated_at BEFORE UPDATE
    ON game_rooms FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional, for security)
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read rooms
CREATE POLICY "Anyone can read rooms" ON game_rooms
  FOR SELECT USING (true);

-- Policy: Anyone can insert rooms
CREATE POLICY "Anyone can insert rooms" ON game_rooms
  FOR INSERT WITH CHECK (true);

-- Policy: Anyone can update rooms
CREATE POLICY "Anyone can update rooms" ON game_rooms
  FOR UPDATE USING (true);

-- Policy: Anyone can delete rooms
CREATE POLICY "Anyone can delete rooms" ON game_rooms
  FOR DELETE USING (true);

-- Enable Real-Time Replication for game_rooms table
-- This is REQUIRED for real-time subscriptions to work
ALTER PUBLICATION supabase_realtime ADD TABLE game_rooms;
