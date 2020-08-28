exports.up = function(knex) {
    return knex.schema.createTable('tb_uf', table => {
        table.increments('cd_uf').primary();
        table.string('sg_uf', 3).notNullable();
        table.string('nm_uf', 45).notNullable();
    });
}

exports.down = function(knex) {
    return knex.schema.dropTable('tb_uf');
}