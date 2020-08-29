exports.up = function(knex) {
    const status = 
    [
        {
            sg_uf: 'AC',
            nm_uf: 'Acre',
        },
        {
            sg_uf: 'AL',
            nm_uf: 'Alagoas',
        },
        {
            sg_uf: 'AP',
            nm_uf: 'Amapá',
        },
        {
            sg_uf: 'AM',
            nm_uf: 'Amazonas',
        },
        {
            sg_uf: 'BA',
            nm_uf: 'Bahia',
        },
        {
            sg_uf: 'CE',
            nm_uf: 'Ceará',
        },
        {
            sg_uf: 'DF',
            nm_uf: 'Distrito Federal',
        },
        {
            sg_uf: 'ES',
            nm_uf: 'Espírito Santo',
        },
        {
            sg_uf: 'GO',
            nm_uf: 'Goiás',
        },
        {
            sg_uf: 'MA',
            nm_uf: 'Maranhão',
        },
        {
            sg_uf: 'MT',
            nm_uf: 'Mato Grosso',
        },
        {
            sg_uf: 'MS',
            nm_uf: 'Mato Grosso do Sul',
        },
        {
            sg_uf: 'MG',
            nm_uf: 'Minas Gerais',
        },
        {
            sg_uf: 'PA',
            nm_uf: 'Pará',
        },
        {
            sg_uf: 'PB',
            nm_uf: 'Paraíba',
        },
        {
            sg_uf: 'PR',
            nm_uf: 'Paraná',
        },
        {
            sg_uf: 'PE',
            nm_uf: 'Pernambuco',
        },
        {
            sg_uf: 'PI',
            nm_uf: 'Piauí',
        },
        {
            sg_uf: 'RJ',
            nm_uf: 'Rio de Janeiro',
        },
        {
            sg_uf: 'RN',
            nm_uf: 'Rio Grande do Norte',
        },
        {
            sg_uf: 'RS',
            nm_uf: 'Rio Grande do Sul',
        },
        {
            sg_uf: 'RO',
            nm_uf: 'Rondônia',
        },
        {
            sg_uf: 'RR',
            nm_uf: 'Roraima',
        },
        {
            sg_uf: 'SC',
            nm_uf: 'Santa Catarina',
        },
        {
            sg_uf: 'SP',
            nm_uf: 'São Paulo',
        },
        {
            sg_uf: 'SE',
            nm_uf: 'Sergipe',
        },
        {
            sg_uf: 'TO',
            nm_uf: 'Tocantins',
        },
    ]

    return knex.insert(status).into('tb_uf')
}

exports.down = function(knex) {
    return knex.delete().from('tb_uf');
}