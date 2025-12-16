// src/components/Board/BoardColumn.tsx
import React from 'react';
import { BoardCell } from './BoardCell';
import { Player } from '../../utils/constants';

interface BoardColumnProps {
  column: Player[];
  colIndex: number;
  winningPositions: Array<{row: number, col: number}>;
  onClick: () => void;
}

export const BoardColumn: React.FC<BoardColumnProps> = ({
  column,
  colIndex,
  winningPositions,
  onClick
}) => {
  const isColumnFull = column[0] !== Player.NONE;

  return (
    <div className="flex flex-col items-center gap-2 p-2 flex-shrink-0">
      {/* Column header/button */}
      <button
        onClick={onClick}
        disabled={isColumnFull}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center
          transition-all duration-200 flex-shrink-0
          ${isColumnFull 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl'
          }
        `}
        aria-label={`Drop piece in column ${colIndex + 1}`}
        data-testid={`column-${colIndex}`}
      >
        <span className="text-lg font-bold">↓</span>
      </button>

      {/* Column cells */}
      <div className="flex flex-col gap-1 bg-gradient-to-b from-blue-900 to-blue-800 p-3 rounded-xl shadow-inner w-16">
        {column.map((player, rowIndex) => {
          const isWinning = winningPositions.some(
            pos => pos.row === rowIndex && pos.col === colIndex
          );

          return (
            <BoardCell
              key={`${rowIndex}-${colIndex}`}
              player={player}
              isWinning={isWinning}
              rowIndex={rowIndex}
              colIndex={colIndex}
            />
          );
        })}
      </div>
    </div>
  );
};