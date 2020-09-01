exports.up = function(knex) {
    return knex.schema.createTable('tb_message', table => {
        table.increments('cd_message').primary();
        table.text('ds_message').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        
        table.integer('cd_room').notNullable();
        table.integer('cd_user').notNullable();

        table.foreign('cd_room').references('cd_room').inTable('tb_room');
        table.foreign('cd_user').references('cd_user').inTable('tb_user');
    });
}

exports.down = function(knex) {
    return knex.schema.dropTable('tb_message');
}