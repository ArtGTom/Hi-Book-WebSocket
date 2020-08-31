exports.up = function(knex) {
    return knex.schema.createTable('tb_room', table => {
        table.increments('cd_room').primary();
        table.string('nm_room', 45).notNullable();
        table.string('ds_room').notNullable();
    });
}

exports.down = function(knex) {
    return knex.schema.dropTable('tb_room');
}