/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

// Possible rarities will be common, rare, ultra, legendary, divine

export async function seed(knex) {
  const boardThemes = [
  {
    whiteSquare: 'bg-slate-100',
    blackSquare: 'bg-[#95b2d1]',
    description: 'The default board',
    rarity: 'common',
    board_name: 'Default'
  },
  {
    whiteSquare: 'bg-blue-100',
    blackSquare: 'bg-blue-950',
    description: 'A board with a dark blue theme',
    rarity: 'common',
    board_name: 'Blue-950'
  },
  {
    whiteSquare: 'bg-neutral-100',
    blackSquare: 'bg-zinc-700',
    description: 'Your first rare board!',
    rarity: 'rare',
    board_name: 'Zinc-700'
  },
  {
    whiteSquare: 'bg-yellow-100',
    blackSquare: 'bg-yellow-700',
    description: 'A bright and cheerful yellow board',
    rarity: 'common',
    board_name: 'Yellow-700'
  },
  {
    whiteSquare: 'bg-green-100',
    blackSquare: 'bg-green-800',
    description: 'A lush green board inspired by nature',
    rarity: 'common',
    board_name: 'Green-800'
  },
  {
    whiteSquare: 'bg-gray-200',
    blackSquare: 'bg-gray-900',
    description: 'A clean grayscale board with bold contrast',
    rarity: 'common',
    board_name: 'Gray-900'
  },
  {
    whiteSquare: 'bg-pink-100',
    blackSquare: 'bg-pink-900',
    description: 'A playful and vibrant pink board',
    rarity: 'common',
    board_name: 'Pink-900'
  },
  {
    whiteSquare: 'bg-slate-100',
    blackSquare: 'bg-slate-800',
    description: 'A sleek slate board with a darker edge',
    rarity: 'rare',
    board_name: 'Slate-800'
  },
  {
    whiteSquare: 'bg-stone-100',
    blackSquare: 'bg-stone-700',
    description: 'A rugged board with earthy tones',
    rarity: 'common',
    board_name: 'Stone-700'
  },
  {
    whiteSquare: 'bg-orange-100',
    blackSquare: 'bg-orange-800',
    description: 'A warm and energetic orange board',
    rarity: 'common',
    board_name: 'Orange-800'
  },
  {
    whiteSquare: 'bg-emerald-100',
    blackSquare: 'bg-emerald-900',
    description: 'A radiant emerald board fit for champions',
    rarity: 'Ultra',
    board_name: 'Emerald-900'
  }
]


  await knex('boards').del();
  await knex('boards').insert(boardThemes);
};
