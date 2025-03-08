/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
    await knex('goals').del();
    await knex('goals').insert([
      { description: 'Play chess with other players' },
      { description: 'Get better at chess' },
      { description: 'Develop tactical knowledge' },
    ]);
  };
  