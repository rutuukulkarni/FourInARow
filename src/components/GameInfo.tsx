import React from 'react';
import { GameStatus, GameMode } from '../utils/constants';
import { Card } from './UI/Card';
import { Button } from './UI/Button';
import { Trophy, RefreshCw, Info } from 'lucide-react';

interface GameInfoProps {
  gameStatus: GameStatus;
  currentPlayer: number;
  winningPlayer: number | null;
  onPlayAgain: () => void;
  gameMode: GameMode;
}

export const GameInfo: React.FC<GameInfoProps> = ({
  gameStatus,
  currentPlayer,
  winningPlayer,
  onPlayAgain,
  gameMode
}) => {
  const isGameOver = gameStatus === GameStatus.WIN || gameStatus === GameStatus.DRAW;

  const getStatusMessage = () => {
    switch (gameStatus) {
      case GameStatus.WIN:
        const winnerName = winningPlayer === 1 
          ? 'Player 1 (Red)' 
          : gameMode === GameMode.VS_BOT 
            ? 'AI Bot (Blue)' 
            : 'Player 2 (Blue)';
        return `${winnerName} Wins! 🎉`;
      case GameStatus.DRAW:
        return "It's a Draw! 🤝";
      case GameStatus.PLAYING:
        const currentName = currentPlayer === 1 
          ? 'Player 1 (Red)' 
          : gameMode === GameMode.VS_BOT 
            ? 'AI Bot (Blue)' 
            : 'Player 2 (Blue)';
        return `${currentName}'s Turn`;
      default:
        return 'Game Paused';
    }
  };

  const getStatusColor = () => {
    switch (gameStatus) {
      case GameStatus.WIN:
        return winningPlayer === 1 ? 'from-red-500 to-orange-500' : 'from-blue-500 to-cyan-500';
      case GameStatus.DRAW:
        return 'from-gray-500 to-gray-600';
      case GameStatus.PLAYING:
        return currentPlayer === 1 ? 'from-red-500 to-pink-500' : 'from-blue-500 to-indigo-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className="space-y-6">
      {/* Game Status */}
      <div className="text-center">
        <div className={`inline-block bg-gradient-to-r ${getStatusColor()} text-white px-8 py-4 rounded-2xl shadow-lg`}>
          <h2 className="text-2xl font-bold flex items-center justify-center gap-3">
            {gameStatus === GameStatus.WIN && <Trophy className="w-6 h-6" />}
            {gameStatus === GameStatus.DRAW && <Info className="w-6 h-6" />}
            {getStatusMessage()}
          </h2>
          
          {isGameOver && (
            <p className="mt-2 text-sm opacity-90">
              {gameStatus === GameStatus.WIN 
                ? 'Four in a row! Congratulations!' 
                : 'Board is full. Well played!'}
            </p>
          )}
        </div>
      </div>

      {/* Player Indicators */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl transition-all duration-300 ${
          currentPlayer === 1 && gameStatus === GameStatus.PLAYING
            ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 shadow-md'
            : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600" />
            <div>
              <h4 className="font-bold text-gray-800">Player 1</h4>
              <p className="text-sm text-gray-600">Red Discs</p>
            </div>
          </div>
          {currentPlayer === 1 && gameStatus === GameStatus.PLAYING && (
            <div className="mt-2 text-sm text-red-600 font-medium animate-pulse">
              Your turn!
            </div>
          )}
        </div>

        <div className={`p-4 rounded-xl transition-all duration-300 ${
          currentPlayer === 2 && gameStatus === GameStatus.PLAYING
            ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 shadow-md'
            : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
            <div>
              <h4 className="font-bold text-gray-800">
                {gameMode === GameMode.VS_BOT ? 'AI Bot' : 'Player 2'}
              </h4>
              <p className="text-sm text-gray-600">Blue Discs</p>
            </div>
          </div>
          {currentPlayer === 2 && gameStatus === GameStatus.PLAYING && (
            <div className="mt-2 text-sm text-blue-600 font-medium animate-pulse">
              {gameMode === GameMode.VS_BOT ? 'Thinking...' : 'Your turn!'}
            </div>
          )}
        </div>
      </div>


      {/* Action Button */}
      {isGameOver && (
        <Button
          variant="primary"
          onClick={onPlayAgain}
          fullWidth
          size="lg"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Play Again
        </Button>
      )}
    </Card>
  );
};