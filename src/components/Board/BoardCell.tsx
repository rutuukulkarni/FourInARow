// src/components/Board/BoardCell.tsx
import React from 'react';
import { Player } from '../../utils/constants';
import { PLAYER_COLORS } from '../../utils/constants';

interface BoardCellProps {
  player: Player;
  isWinning: boolean;
  rowIndex: number;
  colIndex: number;
  onClick?: () => void;
}

export const BoardCell: React.FC<BoardCellProps> = ({ 
  player, 
  isWinning, 
  rowIndex, 
  colIndex,
  onClick 
}) => {
  const cellColor = PLAYER_COLORS[player];
  
  return (
    <button
      onClick={onClick}
      className="relative w-12 h-12 p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex-shrink-0"
      aria-label={`Cell at row ${rowIndex + 1}, column ${colIndex + 1}, ${player === Player.NONE ? 'empty' : 'occupied'}`}
      data-testid={`cell-${rowIndex}-${colIndex}`}
    >
      <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105">
        {/* Background disc */}
        <div 
          className="absolute inset-1 rounded-full"
          style={{ 
            backgroundColor: cellColor,
            opacity: player === Player.NONE ? 0.1 : 1,
            boxShadow: isWinning ? '0 0 20px rgba(255, 255, 255, 0.8)' : 'inset 0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        />
        
        {/* Glow effect for winning cells */}
        {isWinning && (
          <div className="absolute inset-0 rounded-full animate-ping bg-white opacity-20" />
        )}
        
        {/* Inner shine */}
        {player !== Player.NONE && (
          <div className="absolute top-1 left-1 right-1 h-1/2 rounded-full bg-gradient-to-b from-white/30 to-transparent" />
        )}
      </div>
    </button>
  );
};