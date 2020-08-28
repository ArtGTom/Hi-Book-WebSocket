import knex from 'knex';

var db: knex<any | unknown> | null = null;
console.log(process.env.MODE);
if(process.env.MODE == 'production') {
    console.log('passo 1');
    
    db = knex({
        client: 'pg',
        connection: process.env.PG_CONNECTION_STRING
    });
} else {
    console.log('passo 2');
    
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