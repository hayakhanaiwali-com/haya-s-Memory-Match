import React, { useState, useEffect, useCallback } from 'react';
import GameEngine from './components/GameEngine';
import GameUI from './components/GameUI';
import { GameState, GameStats } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [stats, setStats] = useState<GameStats>({
    moves: 0,
    timer: 0,
    bestMoves: parseInt(localStorage.getItem('memory_best_moves') || '9999', 10)
  });

  // Timer Logic
  useEffect(() => {
    let interval: number | undefined;
    
    if (gameState === GameState.PLAYING) {
      interval = window.setInterval(() => {
        setStats(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState]);

  // Handle Game Over High Score
  useEffect(() => {
    if (gameState === GameState.GAME_OVER) {
      if (stats.moves < stats.bestMoves) {
        localStorage.setItem('memory_best_moves', stats.moves.toString());
        setStats(prev => ({ ...prev, bestMoves: stats.moves }));
      }
    }
  }, [gameState, stats.moves, stats.bestMoves]);

  const resetGame = useCallback(() => {
    setStats(prev => ({
      ...prev,
      moves: 0,
      timer: 0
    }));
    setGameState(GameState.START);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden no-select flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-blue-50 to-indigo-100">
         <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Main Game Area */}
      <div className="relative z-0 w-full h-full flex items-center justify-center">
        <GameEngine 
          gameState={gameState} 
          setGameState={setGameState}
          stats={stats}
          updateStats={setStats}
        />
      </div>
      
      {/* UI Overlay */}
      <GameUI 
        gameState={gameState}
        setGameState={setGameState}
        stats={stats}
        resetGame={resetGame}
      />
    </div>
  );
}

export default App;