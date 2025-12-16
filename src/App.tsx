import React, { useEffect } from 'react';
import { Board } from './components/Board/Board';
import { GameControls } from './components/GameControls';
import { GameInfo } from './components/GameInfo';
import { useGameLogic } from './hooks/useGameLogic';
import { GameMode, GameStatus } from './utils/constants';
import { Trophy, Sparkles } from 'lucide-react';

function App() {
  const {
    board,
    currentPlayer,
    gameMode,
    setGameMode,
    botDifficulty,
    setBotDifficulty,
    gameStatus,
    winningPositions,
    handleMove,
    resetGame
  } = useGameLogic();

  const handleColumnClick = (colIndex: number) => {
    if (gameStatus === GameStatus.PLAYING) {
      handleMove(colIndex);
    }
  };

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard') => {
    setBotDifficulty(difficulty as any);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '7' && gameStatus === GameStatus.PLAYING) {
        const colIndex = parseInt(e.key) - 1;
        handleColumnClick(colIndex);
      }
      
      if (e.key === 'r' || e.key === 'R') {
        resetGame();
      }
      
      if (e.key === 'Escape') {
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStatus, handleColumnClick, resetGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-sm">Player 1 (Red)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span className="text-sm">
                    {gameMode === GameMode.VS_BOT ? 'AI Bot' : 'Player 2'} (Blue)
                  </span>
                </div>
              </div>
              
              
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Game Board - Takes more space */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6">
                <Board
                  board={board}
                  winningPositions={winningPositions}
                  onColumnClick={handleColumnClick}
                  currentPlayer={currentPlayer}
                />
              </div>
            </div>

            {/* Right Sidebar - Compact */}
            <div className="lg:col-span-2 space-y-6">
              <GameInfo
                gameStatus={gameStatus}
                currentPlayer={currentPlayer}
                winningPlayer={
                  gameStatus === GameStatus.WIN 
                    ? winningPositions.length > 0 ? board[winningPositions[0].row][winningPositions[0].col] : null 
                    : null
                }
                onPlayAgain={resetGame}
                gameMode={gameMode}
              />

              <GameControls
                gameMode={gameMode}
                botDifficulty={botDifficulty}
                onGameModeChange={handleGameModeChange}
                onDifficultyChange={handleDifficultyChange}
                onResetGame={resetGame}
                onResetStats={() => {}}
                isGameActive={gameStatus === GameStatus.PLAYING}
              />
            </div>
          </div>

          {/* Keyboard Shortcuts - At the bottom */}
          <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold">Keyboard Shortcuts</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-300 mb-2">Column Selection</div>
                <div className="font-mono text-xl font-bold text-yellow-400">1 - 7</div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-300 mb-2">New Game</div>
                <div className="font-mono text-xl font-bold text-yellow-400">R / ESC</div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-300 mb-2">Reset Game</div>
                <div className="font-mono text-xl font-bold text-yellow-400">R Key</div>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-300 mb-2">Quick Play</div>
                <div className="text-lg font-bold text-yellow-400">Click Column</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}

export default App;
