import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('tb_book', table => {
        table.increments('cd_book').primary();
        table.string('nm_book').notNullable();
        table.string('nm_writer').notNullable();
        table.string('nm_publisher').notNullable();
        table.text('ds_book_description').notNullable();
        
        table.integer('cd_status_book')
        
        table.foreign('cd_status_book').references('cd_status_book').inTable('tb_status_book');
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('tb_book');
}