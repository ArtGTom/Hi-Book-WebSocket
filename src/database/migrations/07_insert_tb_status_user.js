exports.up = function(knex) {
    const status = 
    [
        {
            nm_status: 'Online',
            ds_status: 'O usuário está online.'
        },
        {
            nm_status: 'Online',
            ds_status: 'O usuário está ausente.'
        }
    ]
    return knex.insert(status).into('tb_status_user');
}

exports.down = function(knex) {
    return knex.delete().from('tb_book');
}