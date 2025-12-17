import React from 'react';
import { GameMode, BotDifficulty } from '../utils/constants';
import { Card } from './UI/Card';
import { Button } from './UI/Button';
import { Users, Bot, Settings, RefreshCw, Globe } from 'lucide-react';

interface GameControlsProps {
  gameMode: GameMode;
  botDifficulty: BotDifficulty;
  onGameModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: BotDifficulty) => void;
  onResetGame: () => void;
  onResetStats: () => void;
  isGameActive: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  botDifficulty,
  onGameModeChange,
  onDifficultyChange,
  onResetGame,
  onResetStats,
  isGameActive
}) => {
  return (
    <Card className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          Game Settings
        </h3>
      </div>

      {/* Game Mode Selection - Responsive */}
      <div className="space-y-2 sm:space-y-3">
        <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Game Mode</h4>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          <Button
            variant={gameMode === GameMode.VS_PLAYER ? 'primary' : 'outline'}
            onClick={() => onGameModeChange(GameMode.VS_PLAYER)}
            fullWidth
            size="sm"
            className="min-h-[44px] touch-manipulation text-xs sm:text-sm"
          >
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden xs:inline">Local</span>
            <span className="xs:hidden">1v1</span>
          </Button>
          <Button
            variant={gameMode === GameMode.VS_BOT ? 'secondary' : 'outline'}
            onClick={() => onGameModeChange(GameMode.VS_BOT)}
            fullWidth
            size="sm"
            className="min-h-[44px] touch-manipulation text-xs sm:text-sm"
          >
            <Bot className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Bot
          </Button>
          <Button
            variant={gameMode === GameMode.ONLINE ? 'primary' : 'outline'}
            onClick={() => onGameModeChange(GameMode.ONLINE)}
            fullWidth
            size="sm"
            className="min-h-[44px] touch-manipulation text-xs sm:text-sm"
          >
            <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden xs:inline">Online</span>
            <span className="xs:hidden">🌐</span>
          </Button>
        </div>
      </div>

      {/* Bot Difficulty Selection - Responsive */}
      {gameMode === GameMode.VS_BOT && (
        <div className="space-y-2 sm:space-y-3">
          <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Bot Difficulty</h4>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
              <Button
                key={difficulty}
                variant={botDifficulty === difficulty ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onDifficultyChange(difficulty as BotDifficulty)}
                fullWidth
                className="min-h-[44px] touch-manipulation text-xs sm:text-sm"
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons - Responsive */}
      <div className="space-y-2 sm:space-y-3">
        <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Actions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={onResetGame}
            disabled={!isGameActive}
            fullWidth
            className="min-h-[44px] touch-manipulation"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>
      </div>

    </Card>
  );
};