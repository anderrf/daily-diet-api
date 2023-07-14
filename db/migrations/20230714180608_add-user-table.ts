import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('user', (table) => {
        table.uuid('userId').primary();
        table.string('login');
        table.string('name');
        table.string('email');
        table.string('password');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('user');
}

