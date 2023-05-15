import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'user_profiles',
    (table: Knex.TableBuilder) => {
      table.uuid('id').primary();
      table
        .uuid('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('title').notNullable();
      table.string('location').notNullable();
      table.text('description').notNullable();
      table.timestamps(true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_profiles');
}
