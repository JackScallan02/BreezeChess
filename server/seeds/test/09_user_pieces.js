import bcryptjs from 'bcryptjs';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    // Deletes all existing entries
    await knex('user_pieces').del();

    //Inserts fake test data
    await knex('user_pieces').insert([
        { user_id: 1, piece_id: 2 },
        { user_id: 1, piece_id: 5 },
        { user_id: 2, piece_id: 7 },
      ]);
  };
  