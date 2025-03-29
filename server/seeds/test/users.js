/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    // Deletes all existing entries
    await knex('users').del();
  
    //Inserts fake test data
    await knex('users').insert([
        { uid: 'test-uid', email: "testemail1@gmail.com", provider: 'google', is_new_user: false },
        { uid: 'akjDK2fma19sk4', email: 'testemail2@gmail.com', provider: 'google', is_new_user: true }
      ]);
  };
  