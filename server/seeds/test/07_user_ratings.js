/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    // Deletes all existing entries
    await knex('user_ratings').del();

    //Inserts rating_categories data
    await knex('user_ratings').insert([
        {
            user_id: 1,
            category_id: 2,
            rating: 1300
        },
        {
            user_id: 1,
            category_id: 3,
            rating: 1500
        },
        {
            user_id: 2,
            category_id: 4,
            rating: 2000
        }
      ]);
};  