import { Board, Player, makeMove, checkWin, isValidMove, checkDraw } from './gameLogic';
import { BOARD_COLS, BOARD_ROWS } from './constants';

export const evaluateBoard = (board: Board, player: Player): number => {
  let score = 0;
  const opponent = player === Player.ONE ? Player.TWO : Player.ONE;

  // Evaluate based on potential connections
  const evaluateWindow = (window: Player[]): number => {
    let playerCount = 0;
    let opponentCount = 0;
    let emptyCount = 0;

    for (const cell of window) {
      if (cell === player) playerCount++;
      else if (cell === opponent) opponentCount++;
      else emptyCount++;
    }

    if (playerCount === 4) return 100;
    if (playerCount === 3 && emptyCount === 1) return 10;
    if (playerCount === 2 && emptyCount === 2) return 5;
    if (opponentCount === 3 && emptyCount === 1) return -80;
    if (opponentCount === 2 && emptyCount === 2) return -5;

    return 0;
  };

  // Check all possible windows
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col <= BOARD_COLS - 4; col++) {
      const window = [
        board[row][col],
        board[row][col + 1],
        board[row][col + 2],
        board[row][col + 3]
      ];
      score += evaluateWindow(window);
    }
  }

  // Vertical windows
  for (let row = 0; row <= BOARD_ROWS - 4; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      const window = [
        board[row][col],
        board[row + 1][col],
        board[row + 2][col],
        board[row + 3][col]
      ];
      score += evaluateWindow(window);
    }
  }

  // Diagonal windows (positive slope)
  for (let row = 0; row <= BOARD_ROWS - 4; row++) {
    for (let col = 0; col <= BOARD_COLS - 4; col++) {
      const window = [
        board[row][col],
        board[row + 1][col + 1],
        board[row + 2][col + 2],
        board[row + 3][col + 3]
      ];
      score += evaluateWindow(window);
    }
  }

  // Diagonal windows (negative slope)
  for (let row = 0; row <= BOARD_ROWS - 4; row++) {
    for (let col = 3; col < BOARD_COLS; col++) {
      const window = [
        board[row][col],
        board[row + 1][col - 1],
        board[row + 2][col - 2],
        board[row + 3][col - 3]
      ];
      score += evaluateWindow(window);
    }
  }

  return score;
};

const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  maxDepth: number,
  player: Player
): [number, number | null] => {
  const opponent = player === Player.ONE ? Player.TWO : Player.ONE;
  const currentPlayer = isMaximizing ? player : opponent;

  // Terminal states
  const win = checkWin(board, player);
  const lose = checkWin(board, opponent);
  const draw = checkDraw(board);

  if (win) return [1000 + depth, null];
  if (lose) return [-1000 - depth, null];
  if (draw || depth === maxDepth) return [evaluateBoard(board, player), null];

  const availableColumns = Array.from({ length: BOARD_COLS }, (_, i) => i)
    .filter(col => isValidMove(board, col));

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestCol = availableColumns[0] ?? null;

    for (const col of availableColumns) {
      const newBoard = makeMove(board, col, player);
      const [score] = minimax(newBoard, depth + 1, false, alpha, beta, maxDepth, player);

      if (score > bestScore) {
        bestScore = score;
        bestCol = col;
      }

      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }

    return [bestScore, bestCol];
  } else {
    let bestScore = Infinity;
    let bestCol = availableColumns[0] ?? null;

    for (const col of availableColumns) {
      const newBoard = makeMove(board, col, opponent);
      const [score] = minimax(newBoard, depth + 1, true, alpha, beta, maxDepth, player);

      if (score < bestScore) {
        bestScore = score;
        bestCol = col;
      }

      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }

    return [bestScore, bestCol];
  }
};

export const getBotMove = (
  board: Board,
  difficulty: 'easy' | 'medium' | 'hard',
  player: Player
): number => {
  const availableColumns = Array.from({ length: BOARD_COLS }, (_, i) => i)
    .filter(col => isValidMove(board, col));

  if (availableColumns.length === 0) return -1;

  // Try to win immediately
  for (const col of availableColumns) {
    const testBoard = makeMove(board, col, player);
    if (checkWin(testBoard, player)) {
      return col;
    }
  }

  // Block opponent from winning
  const opponent = player === Player.ONE ? Player.TWO : Player.ONE;
  for (const col of availableColumns) {
    const testBoard = makeMove(board, col, opponent);
    if (checkWin(testBoard, opponent)) {
      return col;
    }
  }

  switch (difficulty) {
    case 'easy':
      // Random move with preference for center
      const centerColumns = [3, 2, 4, 1, 5, 0, 6];
      for (const col of centerColumns) {
        if (availableColumns.includes(col)) {
          return col;
        }
      }
      return availableColumns[Math.floor(Math.random() * availableColumns.length)];

    case 'medium':
      // Shallow minimax
      const [, mediumCol] = minimax(board, 0, true, -Infinity, Infinity, 3, player);
      return mediumCol ?? availableColumns[Math.floor(Math.random() * availableColumns.length)];

    case 'hard':
      // Deep minimax
      const [, hardCol] = minimax(board, 0, true, -Infinity, Infinity, 5, player);
      return hardCol ?? availableColumns[Math.floor(Math.random() * availableColumns.length)];

    default:
      return availableColumns[Math.floor(Math.random() * availableColumns.length)];
  }
};