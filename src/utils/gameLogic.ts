import { BOARD_ROWS, BOARD_COLS, Player } from './constants';

export type Board = Player[][];
export type Position = { row: number; col: number };

export const createEmptyBoard = (): Board => {
  return Array.from({ length: BOARD_ROWS }, () => 
    Array.from({ length: BOARD_COLS }, () => Player.NONE)
  );
};

export const isValidMove = (board: Board, col: number): boolean => {
  return board[0][col] === Player.NONE;
};

export const makeMove = (board: Board, col: number, player: Player): Board => {
  const newBoard = board.map(row => [...row]);
  
  for (let row = BOARD_ROWS - 1; row >= 0; row--) {
    if (newBoard[row][col] === Player.NONE) {
      newBoard[row][col] = player;
      return newBoard;
    }
  }
  
  return newBoard;
};

export const getAvailableColumns = (board: Board): number[] => {
  return Array.from({ length: BOARD_COLS }, (_, i) => i)
    .filter(col => isValidMove(board, col));
};

export const checkWin = (board: Board, player: Player): Position[] | null => {
  const directions = [
    { dr: 0, dc: 1 },  // Horizontal
    { dr: 1, dc: 0 },  // Vertical
    { dr: 1, dc: 1 },  // Diagonal down-right
    { dr: 1, dc: -1 }  // Diagonal down-left
  ];

  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      if (board[row][col] === player) {
        for (const { dr, dc } of directions) {
          const positions: Position[] = [];
          
          for (let i = 0; i < 4; i++) {
            const newRow = row + dr * i;
            const newCol = col + dc * i;
            
            if (
              newRow < 0 || newRow >= BOARD_ROWS ||
              newCol < 0 || newCol >= BOARD_COLS ||
              board[newRow][newCol] !== player
            ) {
              break;
            }
            
            positions.push({ row: newRow, col: newCol });
            
            if (positions.length === 4) {
              return positions;
            }
          }
        }
      }
    }
  }
  
  return null;
};

export const checkDraw = (board: Board): boolean => {
  return board[0].every(cell => cell !== Player.NONE);
};

export const getBoardState = (board: Board) => {
  const winner = checkWin(board, Player.ONE) ? Player.ONE : 
                 checkWin(board, Player.TWO) ? Player.TWO : 
                 null;
  const isDraw = !winner && checkDraw(board);
  const winningPositions = winner ? checkWin(board, winner) : null;
  
  return { winner, isDraw, winningPositions };
};

export { Player };
