import knex from 'knex';

<<<<<<< HEAD

var db: knex<any | unknown> | null = null;
if(process.env.MODE == 'production') {
    db = knex({
        client: 'pg',
        connection: process.env.PG_CONNECTION_STRING
    });
} else {
    db = knex({
        client: 'pg',
        connection: {
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: 'joaobanco',
            database: 'db_hibook'
        }
    })
}

export default db as knex<any | unknown>;
=======
const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

export default db;
>>>>>>> 5db90d4c8a4755ae3ebf9435fa9a20ba379729b0
