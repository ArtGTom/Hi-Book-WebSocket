import knex from 'knex';
const { development, production } = require('../../knexfile');

const db = knex({
    client: 'pg',
    connection: production.connection
});

export default db;