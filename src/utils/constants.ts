export const BOARD_ROWS = 6;
export const BOARD_COLS = 7;

export enum Player {
  NONE = 0,
  ONE = 1,
  TWO = 2
}

export enum GameMode {
  VS_PLAYER = 'vs_player',
  VS_BOT = 'vs_bot'
}

export enum BotDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum GameStatus {
  PLAYING = 'playing',
  WIN = 'win',
  DRAW = 'draw',
  PAUSED = 'paused'
}

export const PLAYER_COLORS = {
  [Player.ONE]: '#ef4444', // Red
  [Player.TWO]: '#3b82f6', // Blue
  [Player.NONE]: '#1e293b' // Dark slate
};

export const PLAYER_NAMES = {
  [Player.ONE]: 'Player 1',
  [Player.TWO]: 'Player 2'
};