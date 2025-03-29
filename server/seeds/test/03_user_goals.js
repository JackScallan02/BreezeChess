/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    // Deletes all existing entries
    await knex('user_goals').del();

    //Inserts fake test data
    await knex('user_goals').insert([
      { user_id: 1, goal_id: 2, created_at: new Date() },
      { user_id: 2, goal_id: 1, created_at: new Date() },
      { user_id: 3, goal_id: 3, created_at: new Date() },
    ]);
  };
  