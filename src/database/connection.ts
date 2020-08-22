import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 4444,
        user: 'postgres',
        password: 'hibook3',
        database: 'db_hibook'
    },
});

export default db;