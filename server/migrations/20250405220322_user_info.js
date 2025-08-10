/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('user_info', function (table) {
        table.increments('id');
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('country_id').unsigned().references('id').inTable('countries');
        table.jsonb('ratings');
        table.integer('points').defaultTo(0);
        table.integer('selected_board_id').defaultTo(1);
        table.string('premove').defaultTo('shift');
        table.boolean('alwaysPromoteQueen').defaultTo(false);
        table.boolean('showLegalMoves').defaultTo(true);
        table.boolean('showBoardBuilderEvalBar').defaultTo(true);
        table.boolean('showBoardBuilderEngineEval').defaultTo(true);
        table.boolean('showMoveTypeLabels').defaultTo(true);
        table.boolean('showPuzzleTimer').defaultTo(true);
        table.string('theme').defaultTo('systemDefault');

        /* These are the pieces that are currently selected by the user. Made separate columns for query simplicity */
        table.jsonb('selected_pieces'); // Stores the ID of each piece that the user currently has selected

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
