import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table: Knex.TableBuilder) => {
    table.uuid('id').primary();
    table.string('username').notNullable().unique();
    table.string('password').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
