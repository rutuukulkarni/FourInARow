import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key not found. Online mode will not work.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
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

