/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    // Deletes all existing entries
    await knex('rating_categories').del();

    //Inserts rating_categories data
    await knex('rating_categories').insert([
        { name: 'rapid' },
        { name: 'bullet' },
        { name: 'blitz' },
        { name: 'freestyle' },
        { name: 'daily' },
        { name: 'puzzles' },
      ]);
};  