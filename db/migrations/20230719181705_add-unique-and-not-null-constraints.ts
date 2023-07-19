import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('user', (table) => {
        table.string('login').notNullable().unique().alter();
        table.string('name').notNullable().alter();
        table.string('email').notNullable().unique().alter();
        table.string('password').notNullable().alter();
    });
    await knex.schema.alterTable('meal', (table) => {
        table.string('name').notNullable().alter();
        table.string('dateTime').notNullable().alter();
        table.boolean('isDiet').notNullable().defaultTo(false).alter();
        table.string('userId').notNullable().alter();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('user', (table) => {
        table.dropUnique(['login', 'email']);
        table.string('login').nullable().alter();
        table.string('name').nullable().alter();
        table.string('email').nullable().alter();
        table.string('password').nullable().alter();
    });
    await knex.schema.alterTable('meal', (table) => {
        table.string('name').nullable().alter();
        table.string('dateTime').nullable().alter();
        table.string('isDiet').nullable().alter();
        table.boolean('isDiet').alter();
        table.string('userId').nullable().alter();
    });
}

