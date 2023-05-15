import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('process.env.DB_PORT: ', process.env.DB_PORT);
console.log('process.env.DB_NAME: ', process.env.DB_NAME);
export default {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: '../migrations',
  },
  pool: {
    min: 2,
    max: 10,
  },
  debug: false,
};
