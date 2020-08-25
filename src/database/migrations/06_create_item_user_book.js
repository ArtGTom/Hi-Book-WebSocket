exports.up = function(knex) {
    return knex.schema.createTable('item_user_book', table => {

        table.integer('cd_user').notNullable();
        table.integer('cd_book').notNullable();

        table.foreign('cd_user').references('cd_user').inTable('tb_user');
        table.foreign('cd_book').references('cd_book').inTable('tb_book');
    });
}

exports.down = function(knex) {
    return knex.schema.dropTable('item_user_book');
}