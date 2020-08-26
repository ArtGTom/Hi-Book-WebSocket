exports.up = function(knex) {
    return knex.schema.createTable('tb_geolocation', table => {
        table.increments('cd_geolocation').primary();
        table.decimal('cd_latitude', 8, 5).notNullable();
        table.decimal('cd_longitude', 8, 5).notNullable();
    });
}

exports.down = function(knex) {
    return knex.schema.dropTable('tb_geolocation');
}