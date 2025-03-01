/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  //Inserts seed data
  await knex('users').insert([
    { uuid: 1, username: 'Alice', email: 'alice@example.com', password: 'hashedpassword1', is_new_user: true },
    { uuid: 2, username: 'Bob', email: 'bob@example.com', password: 'hashedpassword2', is_new_user: false },
  ]);
};
