exports.up = function(knex) {
    return knex.schema.createTable('tb_uf', table => {
        table.increments('cd_uf').primary();
        table.char('sg_uf', 2);
        table.string('nm_uf', 45).notNullable();
    });
}

exports.down = function(knex) {
    return knex.schema.dropTable('tb_uf');
}