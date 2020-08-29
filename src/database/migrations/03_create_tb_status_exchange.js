exports.up = function(knex) {
    return knex.schema.createTable('tb_status_exchange', table => {
        table.increments('cd_status_exchange').primary();
        table.string('nm_status', 45).notNullable();
        table.string('ds_status');
    });
}

exports.down = function(knex) {
    return knex.schema.dropTable('tb_status_exchange');
}