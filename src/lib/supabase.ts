import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Better error handling for missing env vars
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not found!');
  console.warn('Online multiplayer mode will not work.');
  console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables.');
}

// Create client with fallback (game will still work for local modes)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: false
    }
  }
);

// Database types
export interface GameRoom {
  id: string;
  room_code: string;
  player1_id: string | null;
  player2_id: string | null;
  board: number[][];
  current_player: number;
  game_status: 'waiting' | 'playing' | 'finished';
  winner: number | null;
  created_at: string;
  updated_at: string;
}

