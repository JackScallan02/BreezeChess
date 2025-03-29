/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    // Deletes all existing entries
    await knex('users').del();
  
    //Inserts fake test data
    await knex('users').insert([
        { uid: 'test-uid', email: "testemail1@gmail.com", provider: 'google', username: 'aiw192', is_new_user: false },
        { uid: 'akjDK2fma19sk4', email: 'fj92as@gmail.com', provider: 'google', is_new_user: true },
        { uid: 'akjDK2fma19sdf4', email: 'asdfi29@gmail.com', provider: 'google', is_new_user: true },
        { uid: 'asdkfu29oif2na', email: 'asdnf9n23@gmail.com', provider: 'google', username: 'lfd901', is_new_user: false },
        { uid: 'fasdf9092sa3', email: 'asjidf982@gmail.com', provider: 'google', username: 'dsaoi832', is_new_user: false },
        { uid: '189ufcman93ka', email: 'asdufj02123u@gmail.com', provider: 'google', username: 'fkuf82', is_new_user: false },
        { uid: 'jf88192fdsak', email: 'godunfi923@gmail.com', provider: 'google', username: 'aiosdfui8', is_new_user: false },
      ]);
  };
  