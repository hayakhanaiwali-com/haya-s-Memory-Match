export const GRID_SIZE = 4; // 4x4 grid = 16 cards = 8 pairs
export const PAIRS_COUNT = (GRID_SIZE * GRID_SIZE) / 2;
export const FLIP_DELAY_MS = 1000;

// A large pool of emojis to choose from
export const EMOJI_POOL = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', 
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄',
  '🐙', '🦋', '🐞', '🦀', '🐠', '🦕', '🦖', '🐢',
  '🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍑', '🍍'
];

export const CARD_BACK_COLOR = 'bg-gradient-to-br from-indigo-500 to-purple-600';
export const CARD_FRONT_COLOR = 'bg-white';