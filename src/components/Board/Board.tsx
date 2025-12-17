// src/components/Board/Board.tsx
import React from 'react';
import { BoardColumn } from './BoardColumn';
import { Board as BoardType } from '../../utils/gameLogic';
import { Player, GameStatus, GameMode } from '../../utils/constants';

interface BoardProps {
  board: BoardType;
  winningPositions: Array<{row: number, col: number}>;
  onColumnClick: (colIndex: number) => void;
  currentPlayer: Player;
  gameStatus: GameStatus;
  gameMode: GameMode;
}

export const Board: React.FC<BoardProps> = ({
  board,
  winningPositions,
  onColumnClick,
  currentPlayer,
  gameStatus,
  gameMode
}) => {
  // Transpose board for column-based rendering
  const columns = board[0].map((_: any, colIndex: string | number) => 
    board.map((row: { [x: string]: any; }) => row[colIndex])
  );

  const isGameOver = gameStatus === GameStatus.WIN || gameStatus === GameStatus.DRAW;
  const winnerPlayer = gameStatus === GameStatus.WIN && winningPositions.length > 0 
    ? board[winningPositions[0].row][winningPositions[0].col] 
    : null;

  const getWinnerMessage = () => {
    if (gameStatus === GameStatus.WIN) {
      if (winnerPlayer === 1) {
        return 'Player 1 Wins! 🎉';
      } else {
        return gameMode === GameMode.VS_BOT ? 'AI Bot Wins! 🤖' : 'Player 2 Wins! 🎉';
      }
    } else if (gameStatus === GameStatus.DRAW) {
      return "It's a Draw! 🤝";
    }
    return '';
  };

  return (
    <div className="relative w-full">
      {/* Game board - Responsive */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-2xl relative w-full overflow-hidden">
        {/* Winner Message Overlay - On Board - Responsive */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center z-50 p-4">
            <div className={`px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl shadow-2xl transform animate-bounce max-w-[90%] ${
              gameStatus === GameStatus.WIN
                ? winnerPlayer === 1
                  ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500'
                  : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500'
                : 'bg-gradient-to-r from-gray-500 to-gray-600'
            } text-white`}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">
                  {gameStatus === GameStatus.WIN ? '🏆' : '🤝'}
                </div>
                <div className="text-lg sm:text-2xl md:text-3xl font-bold break-words">
                  {getWinnerMessage()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Column indicators - Responsive */}
        <div className="flex justify-around mb-1 sm:mb-2 gap-1">
          {columns.map((_, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => onColumnClick(index)}
              className="w-8 sm:w-10 md:w-12 text-center text-white font-bold text-sm sm:text-base md:text-lg hover:scale-110 active:scale-95 transition-transform touch-manipulation min-h-[44px] flex items-center justify-center"
              aria-label={`Drop piece in column ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Board columns - Responsive */}
        <div className="flex flex-row justify-center items-start gap-1 sm:gap-1.5 md:gap-2">
          {columns.map((column, colIndex) => (
            <BoardColumn
              key={colIndex}
              column={column}
              colIndex={colIndex}
              winningPositions={winningPositions}
              onClick={() => onColumnClick(colIndex)}
            />
          ))}
        </div>

        {/* Bottom border - Responsive */}
        <div className="mt-3 sm:mt-4 md:mt-6 h-1.5 sm:h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full" />
      </div>

      {/* Instructions - Responsive */}
      {!isGameOver && (
        <div className="mt-3 sm:mt-4 md:mt-6 text-center text-gray-600 text-xs sm:text-sm px-2">
          <p className="hidden sm:block">Click on a column number above to drop your piece</p>
          <p className="sm:hidden">Tap column number to drop piece</p>
        </div>
      )}
    </div>
  );
};