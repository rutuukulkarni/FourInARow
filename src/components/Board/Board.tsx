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
    <div className="relative">
      {/* Game board */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-6 shadow-2xl relative">
        {/* Winner Message Overlay - On Board */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
            <div className={`px-8 py-6 rounded-2xl shadow-2xl transform animate-bounce ${
              gameStatus === GameStatus.WIN
                ? winnerPlayer === 1
                  ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500'
                  : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500'
                : 'bg-gradient-to-r from-gray-500 to-gray-600'
            } text-white`}>
              <div className="text-center">
                <div className="text-5xl mb-3">
                  {gameStatus === GameStatus.WIN ? '🏆' : '🤝'}
                </div>
                <div className="text-3xl font-bold">
                  {getWinnerMessage()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Column indicators */}
        <div className="flex justify-around mb-2">
          {columns.map((_, index) => (
            <div 
              key={`indicator-${index}`}
              className="w-12 text-center text-white font-bold text-lg"
            >
              {index + 1}
            </div>
          ))}
        </div>

        {/* Board columns */}
        <div className="flex flex-row justify-center items-start gap-2">
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

        {/* Bottom border */}
        <div className="mt-6 h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full" />
      </div>

      {/* Instructions */}
      {!isGameOver && (
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Click on a column number above to drop your piece</p>
        </div>
      )}
    </div>
  );
};