/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('user_ratings', function (table) {
        table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.integer('category_id').notNullable().references('id').inTable('rating_categories').onDelete('CASCADE');
        table.integer('rating').notNullable();
        table.timestamps(true, true);
        table.unique(['user_id', 'category_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('user_ratings');
};
