exports.up = function(knex) {
    return knex.schema.createTable('item_room_user', table => {
        
        table.integer('cd_room').notNullable();
        table.integer('cd_user').notNullable();

        table.foreign('cd_room').references('cd_room').inTable('tb_room');
        table.foreign('cd_user').references('cd_user').inTable('tb_user');
    });
}

exports.down = function(knex) {
    return knex.schema.dropTable('item_room_user');
}