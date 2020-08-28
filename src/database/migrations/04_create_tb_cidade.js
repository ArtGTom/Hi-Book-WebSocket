exports.up = function(knex) {
    return knex.schema.createTable('tb_cidade', table => {
        table.increments('cd_cidade').primary();
        table.string('nm_cidade').notNullable();
                
        table.integer('cd_uf');
        
        table.foreign('cd_uf').references('cd_uf').inTable('tb_uf');
    });
}

exports.down = function(knex) {
    return knex.schema.dropTable('tb_cidade');
}