import Knex from 'knex';

export async function up(knex: Knex) {
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

export async function down(knex: Knex) {
    return knex.delete().from('tb_book');
}