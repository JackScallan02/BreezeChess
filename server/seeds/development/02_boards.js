/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  const boardThemes = [
    { whiteSquare: 'bg-slate-100', blackSquare: 'bg-[#95b2d1]' }, // Default theme
    { whiteSquare: 'bg-blue-100', blackSquare: 'bg-blue-950' },
    { whiteSquare: 'bg-neutral-100', blackSquare: 'bg-zinc-700' },
    { whiteSquare: 'bg-yellow-100', blackSquare: 'bg-yellow-700' },
    { whiteSquare: 'bg-green-100', blackSquare: 'bg-green-800' },
    { whiteSquare: 'bg-gray-200', blackSquare: 'bg-gray-900' },
    { whiteSquare: 'bg-pink-100', blackSquare: 'bg-pink-900' },
    { whiteSquare: 'bg-slate-100', blackSquare: 'bg-slate-800' },
    { whiteSquare: 'bg-stone-100', blackSquare: 'bg-stone-700' },
    { whiteSquare: 'bg-orange-100', blackSquare: 'bg-orange-800' },
    { whiteSquare: 'bg-emerald-100', blackSquare: 'bg-emerald-900' },
  ];

  await knex('boards').del();
  await knex('boards').insert(boardThemes);
};
