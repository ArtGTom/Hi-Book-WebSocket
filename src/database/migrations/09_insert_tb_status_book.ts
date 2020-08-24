import Knex from 'knex';

export async function up(knex: Knex) {
    const status = 
    [
        {
            nm_status: 'Disponível',
            ds_status: 'O livro está disponível para trocas',
        },
        {
            nm_status: 'Reservado',
            ds_status: 'O livro está reservado para outro usuário',
        },
        {
            nm_status: 'Lendo',
            ds_status: 'O livro está sendo lido pelo seu proprietário',
        }
    ]

    return knex.insert(status).into('tb_status_book')
}

export async function down(knex: Knex) {
    return knex.delete().from('tb_status_book');
}