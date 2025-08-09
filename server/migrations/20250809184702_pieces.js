/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('pieces', function(table) {
    table.increments();
    table.string('name').notNullable();
    table.integer('piece_set_id').references('id').inTable('piece_sets');
    table.text('image_url').notNullable();
    table.string('description');
    table.string('rarity').notNullable(); // common, rare, ultra, legendary, divine
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('pieces');
};