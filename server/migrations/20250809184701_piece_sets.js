/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('piece_sets', function(table) {
    table.increments();
    table.string('name').notNullable();
    table.string('description');
    table.string('rarity').notNullable(); // common, rare, ultra, legendary, divine
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('piece_sets');
};