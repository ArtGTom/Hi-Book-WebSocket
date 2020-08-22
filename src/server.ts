import express from 'express';

const app = express();

app.use(express.json());

app.get('/books', (request, response) => {
    const books = [
        { name: 'Mulheres que correm com os lobos', author: 'Clarissa Pinkola Estés'},
        { name: 'O poder do hábito', author: 'Charles Duhigg'},
    ];

    return response.json(books);
} );

app.listen(4242);