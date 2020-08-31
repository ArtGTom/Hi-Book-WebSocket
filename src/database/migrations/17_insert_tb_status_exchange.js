exports.up = function(knex) {
    const status = 
    [   
        {
            nm_status: 'pendente',
            ds_status: 'A troca ainda não foi confirmada pelo os dois usuários'
        },
        {
            nm_status: 'confirmada',
            ds_status: 'A troca foi confirmada'
        },
        {
            nm_status: 'recusada',
            ds_status: 'A troca foi recusada'
        },
        {
            nm_status: 'concluida',
            ds_status: 'A troca foi concluída'
        },
        {
            nm_status: 'cancelada',
            ds_status: 'A troca foi cancelada'
        }
    ]

    return knex.insert(status).into('tb_status_exchange')
}

exports.down = function(knex) {
    return knex.delete().from('tb_status_exchange');
}