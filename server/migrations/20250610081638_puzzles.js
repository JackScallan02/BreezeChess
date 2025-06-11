/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('puzzles', function(table) {
    table.increments();
    table.text('PuzzleId');
    table.text('FEN');
    table.text('Moves');
    table.integer('Rating');
    table.integer('RatingDeviation');
    table.integer('Popularity');
    table.integer('NbPlays');
    table.text('Themes');
    table.text('GameUrl');
    table.text('OpeningTags');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('puzzles');
};