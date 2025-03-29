import knex from 'knex';
import config from './knexfile.js';

const environment = process.env.NODE_ENV || 'development';

console.log("Database environment: ", environment);

const db = knex(config[environment]);

export default db;
