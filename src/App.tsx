import React, { useEffect, useState } from 'react';
import { Board } from './components/Board/Board';
import { GameControls } from './components/GameControls';
import { useGameLogic } from './hooks/useGameLogic';
import { GameMode, GameStatus } from './utils/constants';
import { Settings, Keyboard } from 'lucide-react';
import { Modal } from './components/UI/Modal';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

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
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Floating Action Buttons - No Header */}
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        <button
          onClick={() => setShowShortcuts(true)}
          className="p-3 bg-white/90 backdrop-blur-md hover:bg-white shadow-lg hover:shadow-xl rounded-full transition-all transform hover:scale-110 text-gray-700 hover:text-gray-900"
          title="Keyboard Shortcuts"
          aria-label="Show keyboard shortcuts"
        >
          <Keyboard className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="p-3 bg-white/90 backdrop-blur-md hover:bg-white shadow-lg hover:shadow-xl rounded-full transition-all transform hover:scale-110 text-gray-700 hover:text-gray-900"
          title="Game Settings"
          aria-label="Show game settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <main className="container mx-auto px-4 py-6 h-full overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="max-w-4xl mx-auto">
          {/* Small Player Status - Centered at Top */}
          <div className="mb-6">
            <div className="flex justify-center items-center gap-4 mb-3">
              {/* Player Turn/Winner Status */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                gameStatus === GameStatus.WIN
                  ? winningPositions.length > 0 && board[winningPositions[0].row][winningPositions[0].col] === 1
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : gameStatus === GameStatus.DRAW
                  ? 'bg-gray-500 text-white'
                  : currentPlayer === 1
                  ? 'bg-red-100 text-red-700 border-2 border-red-300'
                  : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
              }`}>
                {gameStatus === GameStatus.WIN && (
                  <span className="text-lg">🎉</span>
                )}
                {gameStatus === GameStatus.DRAW && (
                  <span className="text-lg">🤝</span>
                )}
                <span>
                  {gameStatus === GameStatus.WIN
                    ? winningPositions.length > 0 && board[winningPositions[0].row][winningPositions[0].col] === 1
                      ? 'Player 1 Wins!'
                      : gameMode === GameMode.VS_BOT ? 'AI Bot Wins!' : 'Player 2 Wins!'
                    : gameStatus === GameStatus.DRAW
                    ? "It's a Draw!"
                    : currentPlayer === 1
                    ? "Player 1's Turn"
                    : gameMode === GameMode.VS_BOT ? "AI Bot's Turn" : "Player 2's Turn"}
                </span>
              </div>
            </div>

            {/* Small Player Indicators - Centered */}
            <div className="flex justify-center items-center gap-6">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                currentPlayer === 1 && gameStatus === GameStatus.PLAYING
                  ? 'bg-red-50 border-2 border-red-300 shadow-sm'
                  : 'bg-gray-50'
              }`}>
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="font-medium text-gray-700">Player 1</span>
                <span className="text-gray-500">(Red)</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                currentPlayer === 2 && gameStatus === GameStatus.PLAYING
                  ? 'bg-blue-50 border-2 border-blue-300 shadow-sm'
                  : 'bg-gray-50'
              }`}>
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="font-medium text-gray-700">
                  {gameMode === GameMode.VS_BOT ? 'AI Bot' : 'Player 2'}
                </span>
                <span className="text-gray-500">(Blue)</span>
              </div>
            </div>

            {/* Play Again Button - Show when game over */}
            {gameStatus === GameStatus.WIN || gameStatus === GameStatus.DRAW ? (
              <div className="flex justify-center mt-4">
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                >
                  Play Again
                </button>
              </div>
            ) : null}
          </div>

          {/* Game Board - Main Focus in Center */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 w-full max-w-2xl">
              <Board
                board={board}
                winningPositions={winningPositions}
                onColumnClick={handleColumnClick}
                currentPlayer={currentPlayer}
                gameStatus={gameStatus}
                gameMode={gameMode}
              />
            </div>
          </div>

          {/* Settings Modal */}
          <Modal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            title="Game Settings"
          >
            <GameControls
              gameMode={gameMode}
              botDifficulty={botDifficulty}
              onGameModeChange={handleGameModeChange}
              onDifficultyChange={handleDifficultyChange}
              onResetGame={resetGame}
              onResetStats={() => { }}
              isGameActive={gameStatus === GameStatus.PLAYING}
            />
          </Modal>

          {/* Keyboard Shortcuts Modal */}
          <Modal
            isOpen={showShortcuts}
            onClose={() => setShowShortcuts(false)}
            title="Keyboard Shortcuts"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                  <div className="text-sm font-semibold text-blue-700 mb-2">Column Selection</div>
                  <div className="font-mono text-2xl font-bold text-blue-600">1 - 7</div>
                  <div className="text-xs text-blue-600 mt-2">Press number keys to drop disc</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
                  <div className="text-sm font-semibold text-purple-700 mb-2">New Game</div>
                  <div className="font-mono text-2xl font-bold text-purple-600">R / ESC</div>
                  <div className="text-xs text-purple-600 mt-2">Reset the current game</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                  <div className="text-sm font-semibold text-green-700 mb-2">Quick Play</div>
                  <div className="text-xl font-bold text-green-600">Click Column</div>
                  <div className="text-xs text-green-600 mt-2">Click column number or arrow</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200">
                  <div className="text-sm font-semibold text-orange-700 mb-2">Close Modal</div>
                  <div className="font-mono text-xl font-bold text-orange-600">ESC</div>
                  <div className="text-xs text-orange-600 mt-2">Close this dialog</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">💡 Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use number keys 1-7 for quick column selection</li>
                  <li>• Press R or ESC anytime to start a new game</li>
                  <li>• Click on column numbers or drop arrows to play</li>
                  <li>• Connect 4 discs in a row to win!</li>
                </ul>
              </div>
            </div>
          </Modal>
        </div>
      </main>


    </div>
  );
}

export default App;
