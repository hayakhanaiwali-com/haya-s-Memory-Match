import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Card, GameStats } from '../types';
import { EMOJI_POOL, PAIRS_COUNT, FLIP_DELAY_MS, GRID_SIZE } from '../constants';

interface GameEngineProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  stats: GameStats;
  updateStats: (updater: (prev: GameStats) => GameStats) => void;
}

const GameEngine: React.FC<GameEngineProps> = ({ gameState, setGameState, stats, updateStats }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize Game
  useEffect(() => {
    if (gameState === GameState.START) {
      // Reset board preparation
      setCards([]);
      setFlippedIds([]);
      setIsProcessing(false);
    } else if (gameState === GameState.PLAYING && cards.length === 0) {
      initializeBoard();
    }
  }, [gameState, cards.length]);

  const initializeBoard = useCallback(() => {
    // 1. Select random emojis
    const shuffledEmojis = [...EMOJI_POOL].sort(() => 0.5 - Math.random());
    const selectedEmojis = shuffledEmojis.slice(0, PAIRS_COUNT);
    
    // 2. Create pairs
    const gameEmojis = [...selectedEmojis, ...selectedEmojis];
    
    // 3. Shuffle pairs
    const shuffledGameEmojis = gameEmojis.sort(() => 0.5 - Math.random());
    
    // 4. Create card objects
    const newCards: Card[] = shuffledGameEmojis.map((emoji, index) => ({
      id: `card-${index}`,
      emoji,
      isFlipped: false,
      isMatched: false
    }));

    setCards(newCards);
    setFlippedIds([]);
    setIsProcessing(false);
  }, []);

  // Handle Card Click
  const handleCardClick = (clickedCard: Card) => {
    if (
      gameState !== GameState.PLAYING || 
      isProcessing || 
      clickedCard.isMatched || 
      clickedCard.isFlipped
    ) {
      return;
    }

    // Flip the clicked card
    const newCards = cards.map(c => 
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    
    const newFlippedIds = [...flippedIds, clickedCard.id];
    setFlippedIds(newFlippedIds);

    // Check for match if 2 cards are flipped
    if (newFlippedIds.length === 2) {
      setIsProcessing(true);
      updateStats(prev => ({ ...prev, moves: prev.moves + 1 }));
      checkForMatch(newFlippedIds, newCards);
    }
  };

  const checkForMatch = (currentFlippedIds: string[], currentCards: Card[]) => {
    const [id1, id2] = currentFlippedIds;
    const card1 = currentCards.find(c => c.id === id1);
    const card2 = currentCards.find(c => c.id === id2);

    if (card1 && card2 && card1.emoji === card2.emoji) {
      // Match found
      handleMatch(id1, id2);
    } else {
      // No match
      handleMismatch(id1, id2);
    }
  };

  const handleMatch = (id1: string, id2: string) => {
    setTimeout(() => {
      setCards(prev => {
        const newCards = prev.map(c => 
          c.id === id1 || c.id === id2 ? { ...c, isMatched: true, isFlipped: true } : c
        );
        
        // Check Win Condition
        if (newCards.every(c => c.isMatched)) {
          setGameState(GameState.GAME_OVER);
        }
        return newCards;
      });
      setFlippedIds([]);
      setIsProcessing(false);
    }, 500);
  };

  const handleMismatch = (id1: string, id2: string) => {
    setTimeout(() => {
      setCards(prev => prev.map(c => 
        c.id === id1 || c.id === id2 ? { ...c, isFlipped: false } : c
      ));
      setFlippedIds([]);
      setIsProcessing(false);
    }, FLIP_DELAY_MS);
  };

  // Only render grid when playing or game over (to show final board)
  if (gameState === GameState.START && cards.length === 0) return null;

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div 
        className="grid gap-3 w-full max-w-lg aspect-square"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`relative w-full h-full cursor-pointer perspective-1000 group ${card.isMatched ? 'opacity-0 pointer-events-none transition-opacity duration-700 delay-500' : ''}`}
          >
            <div 
              className={`w-full h-full relative transform-style-3d transition-transform duration-500 shadow-sm rounded-xl ${card.isFlipped ? 'rotate-y-180' : ''}`}
            >
              {/* Card Back (Face Down) */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg border-2 border-white/20 flex items-center justify-center">
                 <span className="text-2xl opacity-50">✨</span>
              </div>

              {/* Card Front (Face Up) */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white rounded-xl shadow-lg border-4 border-indigo-200 flex items-center justify-center">
                <span className="text-4xl md:text-5xl select-none transform transition-transform animate-pop-in">
                  {card.emoji}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameEngine;