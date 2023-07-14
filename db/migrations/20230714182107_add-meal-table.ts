import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meal', (table) => {
        table.uuid('mealId').primary();
        table.string('name');
        table.string('description');
        table.dateTime('dateTime');
        table.boolean('isDiet');
        table.uuid('userId');
        table.foreign('userId').references('userId').inTable('user');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meal', (table) => {
        table.dropForeign('userId');
    });
    await knex.schema.dropTable('meal');
}

