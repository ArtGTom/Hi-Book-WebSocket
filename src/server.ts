import express from 'express';

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

app.listen(PORT,() => console.log(`hosteado na porta @${PORT}`));