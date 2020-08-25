exports.up = function(knex) {
    return knex.schema.createTable('tb_user', table => {
        table.increments('cd_user').primary();
        table.string('nm_user').notNullable();
        table.string('nm_username').notNullable();
        table.string('nm_email_user').notNullable();
        table.text('cd_password_hash').notNullable();
        table.string('ds_biography').notNullable();
        table.string('cd_phone_number');
        table.text('cd_user_icon_URL'); 
        
        table.integer('cd_geolocation');
        table.integer('cd_status_user').notNullable();

        table.foreign('cd_geolocation').references('cd_geolocation').inTable('tb_geolocation');
        table.foreign('cd_status_user').references('cd_status_user').inTable('tb_status_user');
    });
}

exports.down = function(knex) {
    return knex.schema.dropTable('tb_user');
}