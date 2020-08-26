exports.up = function(knex) {
    return knex.schema.createTable('tb_book', table => {
        table.increments('cd_book').primary();
        table.string('nm_book').notNullable();
        table.string('nm_writer').notNullable();
        table.string('nm_publisher').notNullable();
        table.text('ds_book_description').notNullable();
        
        table.integer('cd_user').notNullable();
        table.integer('cd_status_book').notNullable();
        
        table.foreign('cd_user').references('cd_user').inTable('tb_user');
        table.foreign('cd_status_book').references('cd_status_book').inTable('tb_status_book');
    });
}

exports.down = function(knex) {
    return knex.schema.dropTable('tb_book');
}