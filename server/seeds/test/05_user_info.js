/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    // Deletes all existing entries
    await knex('user_info').del();

    //Inserts fake test data
    await knex('user_info').insert([
      { country_id: 14,  user_id: 1 },
      { country_id: 100,  user_id: 2 },
    ]);
  };