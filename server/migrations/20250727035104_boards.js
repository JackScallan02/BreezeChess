/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('boards', function(table) {
    table.increments();
    table.string('whiteSquare');
    table.string('blackSquare');
    table.string('board_name');
    table.string('description');
    table.string('rarity'); // common, rare, ultra, legendary, divine
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('boards');
};