import path from 'path';

module.exports = {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
};