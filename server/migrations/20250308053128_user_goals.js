/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_goals', function (table) {
        table.increments('id');
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('goal_id').unsigned().references('id').inTable('goals').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.unique(['user_id', 'goal_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_goals');
};
