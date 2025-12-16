import React from 'react';
import { GameMode, Player } from '../utils/constants';
import { Card } from './UI/Card';
import { Trophy, TrendingUp, BarChart3 } from 'lucide-react';

interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
}

interface ScoreBoardProps {
  stats: GameStats;
  gameMode: GameMode;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ stats, gameMode }) => {
  const winRate = stats.totalGames > 0 
    ? Math.round((stats.wins / stats.totalGames) * 100) 
    : 0;

  const lossRate = stats.totalGames > 0 
    ? Math.round((stats.losses / stats.totalGames) * 100) 
    : 0;

  const drawRate = stats.totalGames > 0 
    ? Math.round((stats.draws / stats.totalGames) * 100) 
    : 0;

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Statistics
        </h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {gameMode === GameMode.VS_BOT ? 'VS Bot' : 'VS Player'}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{stats.wins}</div>
          <div className="text-sm text-red-700 font-medium">Wins</div>
          <div className="text-xs text-red-500 mt-1">Player 1</div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-600">{stats.draws}</div>
          <div className="text-sm text-gray-700 font-medium">Draws</div>
          <div className="text-xs text-gray-500 mt-1">Ties</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.losses}</div>
          <div className="text-sm text-blue-700 font-medium">Losses</div>
          <div className="text-xs text-blue-500 mt-1">
            {gameMode === GameMode.VS_BOT ? 'Bot' : 'Player 2'}
          </div>
        </div>
      </div>

      {/* Win Rate */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Win Rate
          </h4>
          <span className="text-lg font-bold text-gray-800">{winRate}%</span>
        </div>
        
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
            style={{ width: `${winRate}%` }}
          />
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Distribution
        </h4>
        
        <div className="h-8 flex rounded-lg overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
            style={{ width: `${winRate}%` }}
            title={`Wins: ${winRate}%`}
          />
          <div 
            className="bg-gradient-to-r from-gray-400 to-gray-500 transition-all duration-500"
            style={{ width: `${drawRate}%` }}
            title={`Draws: ${drawRate}%`}
          />
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${lossRate}%` }}
            title={`Losses: ${lossRate}%`}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>Wins</span>
          <span>Draws</span>
          <span>Losses</span>
        </div>
      </div>

      {/* Total Games */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Games</span>
          <span className="text-2xl font-bold text-gray-800">{stats.totalGames}</span>
        </div>
      </div>
    </Card>
  );
};