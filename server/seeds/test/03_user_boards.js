import bcryptjs from 'bcryptjs';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    // Deletes all existing entries
    await knex('user_boards').del();

    //Inserts fake test data
    await knex('user_boards').insert([
        { user_id: 1, board_id: 2 },
        { user_id: 1, board_id: 4 },
        { user_id: 2, board_id: 3 },
      ]);
  };
  