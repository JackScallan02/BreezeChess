/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('id');
        table.string('uid').unique();
        table.string('email').unique().notNullable();
        table.string('password');
        table.string('provider').notNullable();
        table.string('username').unique();
        table.boolean('is_new_user').notNullable();
        table.string('experience_level')
        table.timestamps(true, true);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema
        .dropTableIfExists('user_goals');
    return await knex.schema.dropTableIfExists('users');
}

