import path from 'path';

if(process.env.MODE == 'production') {
    module.exports = {
        client: 'pg',
        connection: process.env.PG_CONNECTION_STRING,
        migrations: {
            directory: path.resolve(__dirname, 'src', 'database', 'migrations')
        },
    };
} else {
    
module.exports = {
    client: 'pg',
    connection: {
        host: 'localhost',
        port: '5432',
        user: 'postgres',
        password: 'joaobanco',
        database: 'db_hibook'
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
};
}