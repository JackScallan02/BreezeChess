/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('user_pieces', function(table) {
    table.increments();
    table.integer('user_id').references('id').inTable('users').notNullable();
    table.integer('piece_id').references('id').inTable('pieces').notNullable();
    table.timestamp('acquired_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('user_pieces');
};