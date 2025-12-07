import React from 'react';
import { GameState, GameStats } from '../types';
import { Play, RotateCcw, Timer, Trophy } from 'lucide-react';

interface GameUIProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  stats: GameStats;
  resetGame: () => void;
}

const GameUI: React.FC<GameUIProps> = ({ gameState, setGameState, stats, resetGame }) => {
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // HUD (Heads Up Display)
  if (gameState === GameState.PLAYING) {
    return (
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center max-w-2xl mx-auto w-full">
        {/* Moves */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border-b-4 border-indigo-200">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Moves</p>
          <p className="text-2xl font-black text-indigo-600 font-mono leading-none">{stats.moves}</p>
        </div>

        {/* Title (Mobile hidden, Desktop visible) */}
        <h1 className="hidden md:block text-2xl font-black text-white drop-shadow-md tracking-tight">
          MEMORY MATCH
        </h1>

        {/* Timer */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border-b-4 border-pink-200 min-w-[100px] text-right">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Time</p>
          <p className="text-2xl font-black text-pink-500 font-mono leading-none">{formatTime(stats.timer)}</p>
        </div>
      </div>
    );
  }

  // Start Screen
  if (gameState === GameState.START) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-indigo-600/90 to-purple-800/90 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border-4 border-white/20 animate-fade-in-up">
          <div className="mb-6 flex justify-center gap-2 text-6xl animate-bounce">
            <span>🎴</span>
            <span className="animation-delay-200">✨</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-2">Memory Match</h1>
          <p className="text-slate-500 mb-8 text-lg">Flip cards, find pairs, beat your time!</p>
          
          {stats.bestMoves < 9999 && (
            <div className="mb-8 bg-amber-50 rounded-xl p-4 border border-amber-100 inline-block w-full">
              <div className="flex items-center justify-center gap-2 text-amber-600 mb-1">
                <Trophy size={16} />
                <span className="text-xs font-bold uppercase">Personal Best</span>
              </div>
              <p className="text-2xl font-black text-slate-800">{stats.bestMoves} Moves</p>
            </div>
          )}

          <button 
            onClick={() => setGameState(GameState.PLAYING)}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <Play size={24} className="fill-current" />
            Start Game
          </button>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (gameState === GameState.GAME_OVER) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center animate-bounce-in relative overflow-hidden">
          {/* Confetti Background Effect (CSS only for simplicity) */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400 via-red-500 to-pink-500" />
          
          <div className="relative z-10">
            <div className="mb-4 text-6xl">🎉</div>
            <h2 className="text-4xl font-black text-slate-800 mb-2">You Won!</h2>
            <p className="text-slate-500 mb-8">Excellent memory skills!</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex flex-col items-center">
                   <span className="text-slate-400 text-xs font-bold uppercase mb-1">Moves</span>
                   <span className="text-3xl font-black text-indigo-600">{stats.moves}</span>
                </div>
              </div>
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                <div className="flex flex-col items-center">
                   <span className="text-slate-400 text-xs font-bold uppercase mb-1">Time</span>
                   <span className="text-3xl font-black text-pink-500">{formatTime(stats.timer)}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={resetGame}
              className="w-full py-4 bg-slate-800 text-white text-xl font-bold rounded-xl shadow-lg hover:bg-slate-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={24} />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GameUI;