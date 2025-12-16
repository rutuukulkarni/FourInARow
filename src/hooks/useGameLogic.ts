import { useState, useEffect, useCallback } from 'react';
import { 
  createEmptyBoard, 
  makeMove, 
  getBoardState, 
  Board,
  Player 
} from '../utils/gameLogic';
import { getBotMove } from '../utils/botAI';
import { GameMode, BotDifficulty, GameStatus } from '../utils/constants';

interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
}

export const useGameLogic = () => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.ONE);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.VS_PLAYER);
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>(BotDifficulty.MEDIUM);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING);
  const [winningPositions, setWinningPositions] = useState<Array<{row: number, col: number}>>([]);
  const [stats, setStats] = useState<GameStats>({
    wins: 0,
    losses: 0,
    draws: 0,
    totalGames: 0
  });

  const handleMove = useCallback((col: number) => {
    if (gameStatus !== GameStatus.PLAYING) return;

    const newBoard = makeMove(board, col, currentPlayer);
    setBoard(newBoard);

    const { winner, isDraw, winningPositions } = getBoardState(newBoard);

    if (winner) {
      setGameStatus(GameStatus.WIN);
      setWinningPositions(winningPositions || []);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        wins: winner === Player.ONE ? prev.wins + 1 : prev.wins,
        losses: winner === Player.TWO ? prev.losses + 1 : prev.losses,
        totalGames: prev.totalGames + 1
      }));
    } else if (isDraw) {
      setGameStatus(GameStatus.DRAW);
      setStats(prev => ({
        ...prev,
        draws: prev.draws + 1,
        totalGames: prev.totalGames + 1
      }));
    } else {
      const nextPlayer = currentPlayer === Player.ONE ? Player.TWO : Player.ONE;
      setCurrentPlayer(nextPlayer);
    }
  }, [board, currentPlayer, gameStatus]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(Player.ONE);
    setGameStatus(GameStatus.PLAYING);
    setWinningPositions([]);
  }, []);

  const resetStats = useCallback(() => {
    setStats({
      wins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0
    });
  }, []);

  // Bot move handling
  useEffect(() => {
    if (
      gameMode === GameMode.VS_BOT &&
      currentPlayer === Player.TWO &&
      gameStatus === GameStatus.PLAYING
    ) {
      const timer = setTimeout(() => {
        const botCol = getBotMove(board, botDifficulty, Player.TWO);
        if (botCol !== -1) {
          handleMove(botCol);
        }
      }, 500); // Small delay for better UX

      return () => clearTimeout(timer);
    }
  }, [board, currentPlayer, gameMode, botDifficulty, gameStatus, handleMove]);

  return {
    board,
    currentPlayer,
    gameMode,
    setGameMode,
    botDifficulty,
    setBotDifficulty,
    gameStatus,
    setGameStatus,
    winningPositions,
    stats,
    handleMove,
    resetGame,
    resetStats
  };
};
