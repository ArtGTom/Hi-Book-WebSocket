import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable("tb_image_book", table => {
        table.increments("cd_image_book").primary();
        table.text("cd_image_URL").notNullable();
        table.text("ds_image").notNullable();
        
        table.integer("cd_book").notNullable();
        
        table.foreign("cd_book").references("cd_book").inTable("tb_book");
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable("tb_image_book");
}