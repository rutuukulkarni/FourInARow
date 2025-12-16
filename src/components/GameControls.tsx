import React from 'react';
import { GameMode, BotDifficulty } from '../utils/constants';
import { Card } from './UI/Card';
import { Button } from './UI/Button';
import { Users, Bot, Settings, RefreshCw } from 'lucide-react';

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
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Game Settings
        </h3>
      </div>

      {/* Game Mode Selection */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">Game Mode</h4>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={gameMode === GameMode.VS_PLAYER ? 'primary' : 'outline'}
            onClick={() => onGameModeChange(GameMode.VS_PLAYER)}
            fullWidth
          >
            <Users className="w-4 h-4 mr-2" />
            VS Player
          </Button>
          <Button
            variant={gameMode === GameMode.VS_BOT ? 'secondary' : 'outline'}
            onClick={() => onGameModeChange(GameMode.VS_BOT)}
            fullWidth
          >
            <Bot className="w-4 h-4 mr-2" />
            VS Bot
          </Button>
        </div>
      </div>

      {/* Bot Difficulty Selection */}
      {gameMode === GameMode.VS_BOT && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">Bot Difficulty</h4>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
              <Button
                key={difficulty}
                variant={botDifficulty === difficulty ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onDifficultyChange(difficulty as BotDifficulty)}
                fullWidth
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">Actions</h4>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onResetGame}
            disabled={!isGameActive}
            fullWidth
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Game
          </Button>
        </div>
      </div>

    </Card>
  );
};