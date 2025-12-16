// src/components/Board/Board.tsx
import React from 'react';
import { BoardColumn } from './BoardColumn';
import { Board as BoardType } from '../../utils/gameLogic';
import { Player } from '../../utils/constants';

interface BoardProps {
  board: BoardType;
  winningPositions: Array<{row: number, col: number}>;
  onColumnClick: (colIndex: number) => void;
  currentPlayer: Player;
}

export const Board: React.FC<BoardProps> = ({
  board,
  winningPositions,
  onColumnClick,
  currentPlayer
}) => {
  // Transpose board for column-based rendering
  const columns = board[0].map((_: any, colIndex: string | number) => 
    board.map((row: { [x: string]: any; }) => row[colIndex])
  );

  return (
    <div className="relative">
      {/* Current player indicator */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 rounded-full shadow-md">
          <div className={`w-4 h-4 rounded-full ${currentPlayer === Player.ONE ? 'bg-red-500' : 'bg-blue-500'}`} />
          <span className="font-bold text-lg text-gray-800">
            {currentPlayer === Player.ONE ? "Player 1's Turn" : "Player 2's Turn"}
          </span>
        </div>
      </div>

      {/* Game board */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-6 shadow-2xl">
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
      <div className="mt-6 text-center text-gray-600 text-sm">
        <p>Click on a column number above to drop your piece</p>
      </div>
    </div>
  );
};