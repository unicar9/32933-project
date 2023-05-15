import knex from 'knex';
import dotenv from 'dotenv';
import knexConfig from './knexfile';

dotenv.config();

const db = knex(knexConfig);

export default db;
