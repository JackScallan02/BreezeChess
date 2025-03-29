/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    // Deletes all existing entries
    await knex('goals').del();

    //Inserts goals data
    await knex('goals').insert([
      { description: 'Play chess with other players' },
      { description: 'Get better at chess' },
      { description: 'Develop tactical knowledge' },
    ]);
  };
  