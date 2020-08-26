import express from 'express';
import multer from 'multer';
import User from '../models/user.model';
import PutProfile from '../models/profileOperations.model';
import CreateUser from '../models/userOperations.model';
import { NewBook, PutBook } from '../models/bookOperations.mode';
import { verifyToken, getUserByToken } from '../utils/JWTAuthentication';
import { uploadImageProfile, uploadImageBook, deleteImageBook } from './services/aws.service';
import { Login, Register } from './services/auth.service';
import { updateProfile, readProfile, putPassword } from './services/profile.service';
import { createBook, readBooks, updateBook, deleteBook, readBook } from './services/book.service';
import { NewImageBook } from '../models/imageBookOperations.model';

const routes = express.Router();
const formData = multer();

/* Autenticação */

routes.post('/users', async (request, response) => {
    let user: CreateUser = request.body;

    Register(user)
        .then(result => response.status(201).json(result))
        .catch(reject => response.status(400).json(reject));
});

routes.post('/login', async (request, response) => {
    let credentials: { login: string, password: string } = request.body;

    Login(credentials)
        .then(result => response.status(200).json(result))
        .catch(reject => response.status(400).json(reject));
});

/* Profile */

routes.get('/profile', verifyToken, async (request, response) => {
    const user: User = await getUserByToken(request, response);

    readProfile(user)
        .then(result => response.status(200).json(result))
        .catch(err => response.status(400).json(err))
});

routes.post('/profile', verifyToken, formData.single('image'), async (request, response) => {
    const user: User = await getUserByToken(request, response);
    const image = request.file;

    uploadImageProfile(user, image)
        .then(result => response.status(200).json(result))
        .catch(err => response.status(400).json(err));
});

routes.put('/profile', verifyToken, async (request, response) => {
    const user = await getUserByToken(request, response);
    const putProfile: PutProfile = request.body;

    updateProfile(user, putProfile)
        .then(result => response.status(200).json(result))
        .catch(err => response.status(400).json(err));
});

routes.patch('/profile', verifyToken, async (request, response) => {
    const user: User = await getUserByToken(request, response);

    const password:
        {
            password: string,
            newPassword: string
        } = request.body;

    putPassword(password, user)
        .then(result => response.status(200).json(result))
        .catch(err => response.status(400).json(err));
});

/* BOOKS */

routes.get('/books', verifyToken, async (request, response) => {
    const user: User = await getUserByToken(request, response);
    const ownerBook: string | undefined = request.query['ownerBook']?.toString();

    readBooks(user, ownerBook)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(error.staus).json(error));
});

routes.get('/books/:idBook', verifyToken, async (request, response) => {
    const idBook = request.params['idBook']

    readBook(idBook)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(400).json(error));
});

routes.post('/books', verifyToken, async (request, response) => {
    const user: User = await getUserByToken(request, response);
    const newBook: NewBook = request.body;

    createBook(user, newBook)
        .then(result => response.status(201).json(result))
        .catch(err => response.status(400).json(err));
});

routes.put('/books/:idBook', verifyToken, async (request, response) => {
    const user: User = await getUserByToken(request, response);
    const idBook = request.params['idBook'];
    const putBook: PutBook = request.body;

    updateBook(user, idBook, putBook)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(error.status).json(error));
});

routes.delete('/books/:idBook', verifyToken, async (request, response) => {
    const user: User = await getUserByToken(request, response);
    const idBook = request.params['idBook'];

    deleteBook(user, idBook)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(error.status).json(error));
});

/* IMAGES BOOK */

routes.post('/books/:idBook/images', verifyToken, formData.single('image'), async (request, response) => {
    const user: User = await getUserByToken(request, response);
    const idBook = request.params['idBook'];
    const image = request.file;

    if (request.query['description']) {
        const newImageBook: NewImageBook = {
            description: request.query['description'].toString().replace('+', ' ')
        };

        uploadImageBook(user, idBook, newImageBook, image)
            .then(result => response.status(201).json(result))
            .catch(error => response.status(error.status).json(error));
    } else
        response.status(400).json({ message: 'Descrição da imagem obrigatória' });
});

routes.delete('/books/:idBook/images/:idImage', verifyToken, async (request, response) => {
    const user: User = await getUserByToken(request, response);
    const idBook = request.params['idBook'];
    const idImage = request.params['idImage'];

    deleteImageBook(user, idBook, idImage)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(error.status).json(error));
});

export default routes;