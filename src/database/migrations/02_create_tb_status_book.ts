import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable("tb_status_book", table => {
        table.increments("cd_status_book").primary();
        table.string("nm_status", 45).notNullable();
        table.string("ds_status");
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable("tb_status_book");
}