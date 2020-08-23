import express from 'express';
import db from '../database/connection';

const app = express();
const PORT : string|number = process.env.PORT || 5000;


app.use(express.json());

app.get('/books', (request, response) => {
    const books = [
        { name: 'Mulheres que correm com os lobos', author: 'Clarissa Pinkola Estés'},
        { name: 'O poder do hábito', author: 'Charles Duhigg'},
    ];

    return response.json(books);
} );

app.use(express.json());

app.get('/tables', (request, response) => {
    const tables = db.schema.raw('show tables');

    return response.json(tables);
} );

app.listen(PORT,() => console.log(`hosteado na porta @${PORT}`));