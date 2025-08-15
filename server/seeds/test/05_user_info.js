/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes all existing entries
  await knex('user_info').del();

  //Inserts fake test data
  await knex('user_info').insert([
    {
      country_id: 14, user_id: 1, selected_pieces: {
        b: {
          k: 1,
          q: 2,
          r: 3,
          n: 4,
          b: 5,
          p: 6
        },
        w: {
          k: 7,
          q: 8,
          r: 9,
          n: 10,
          b: 11,
          p: 12,
        }
      }
    },
        {
      country_id: 100, user_id: 2, selected_pieces: {
        b: {
          k: 13,
          q: 2,
          r: 3,
          n: 4,
          b: 5,
          p: 6
        },
        w: {
          k: 7,
          q: 8,
          r: 9,
          n: 10,
          b: 11,
          p: 12,
        }
      }
    },
  ]);
};