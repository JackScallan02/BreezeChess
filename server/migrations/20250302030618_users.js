/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.dropTableIfExists('users').then(() => {
        return knex.schema.createTable('users', function (table) {
            table.increments('id');
            table.string('uid').unique();
            table.string('email').unique().notNullable();
            table.string('password');
            table.string('provider').notNullable();
            table.string('username').unique();
            table.boolean('is_new_user').notNullable();
            table.string('experience_level')
            table.specificType('goals', 'INT[]');
            table.timestamps(true, true);
        });
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
