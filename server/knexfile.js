// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {

  development: {
    client: 'pg',
    connection: {
      host: 'postgres',
      port: '5432',
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB
    },
    pool: {
      min: 2,
      max: 5
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds/development'
    }
  },

  test: {
    client: 'pg',
    connection: {
      host: 'postgres',
      port: '5432',
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB
    },
    pool: { min: 2, max: 5 },
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds/test' }
  },

  production: {
    client: 'pg',
    connection: {
      host: '0.0.0.0',
      port: '5432',
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds/development'
    }
  }

};
