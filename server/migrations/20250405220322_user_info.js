/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('user_info', function (table) {
        table.increments('id');
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('country_id').unsigned().references('id').inTable('countries');
        table.jsonb('ratings')
        table.string('premove').defaultTo('shift')
        table.boolean('alwaysPromoteQueen').defaultTo(false)
        table.boolean('showLegalMoves').defaultTo(true)
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('user_info');
};
