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
    <div className="flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 p-1 sm:p-1.5 md:p-2 flex-shrink-0">
      {/* Column header/button - Responsive */}
      <button
        onClick={onClick}
        disabled={isColumnFull}
        className={`
          rounded-full flex items-center justify-center
          transition-all duration-200 flex-shrink-0 touch-manipulation
          w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12
          min-w-[40px] min-h-[40px]
          ${isColumnFull 
            ? 'bg-gray-300 cursor-not-allowed opacity-50' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white active:from-blue-600 active:to-blue-700 active:brightness-110 active:scale-95 shadow-lg active:shadow-xl'
          }
        `}
        style={{ willChange: 'auto' }}
        aria-label={`Drop piece in column ${colIndex + 1}`}
        data-testid={`column-${colIndex}`}
      >
        <span className="text-base sm:text-lg md:text-xl font-bold">↓</span>
      </button>

      {/* Column cells - Responsive */}
      <div className="flex flex-col gap-0.5 sm:gap-1 bg-gradient-to-b from-blue-900 to-blue-800 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl shadow-inner w-12 sm:w-14 md:w-16">
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