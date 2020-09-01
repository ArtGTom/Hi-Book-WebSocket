import express, { request, response } from 'express';
import multer from 'multer';
import User from '../models/user.model';
import PutProfile from '../models/profileOperations.model';
import { CreateUser, SearchUsers } from '../models/userOperations.model';
import { NewBook, PutBook } from '../models/bookOperations.mode';
import { verifyTokenByRequest, getUserByRequest } from '../utils/JWTAuthentication';
import { uploadImageProfile, uploadImageBook, deleteImageBook } from './services/aws.service';
import { Login, Register } from './services/auth.service';
import { updateProfile, readProfile, putPassword } from './services/profile.service';
import { createBook, readBooks, updateBook, deleteBook, readBook } from './services/book.service';
import { NewImageBook } from '../models/imageBookOperations.model';
import { updateGeolocation, readGeolocation } from './services/geolocation.service';
import { NewGeolocation } from '../models/geolocationOperations.model';
import { readUsers } from './services/users.service';
import { NewExchange } from '../models/exchangeOperations.model';
import { createExchange, readExchanges, addSecondBookInExchange, updateStatusExchange } from './services/exchange.service';

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
routes.get('/profile', verifyTokenByRequest, async (request, response) => {
    const user: User = await getUserByRequest(request, response);

    readProfile(user)
        .then(result => response.status(200).json(result))
        .catch(err => response.status(400).json(err))
});

routes.post('/profile', verifyTokenByRequest, formData.single('image'), async (request, response) => {
    const user: User = await getUserByRequest(request, response);
    const image = request.file;

    uploadImageProfile(user, image)
        .then(result => response.status(200).json(result))
        .catch(err => response.status(400).json(err));
});

routes.put('/profile', verifyTokenByRequest, async (request, response) => {
    const user = await getUserByRequest(request, response);
    const putProfile: PutProfile = request.body;

    updateProfile(user, putProfile)
        .then(result => response.status(200).json(result))
        .catch(err => response.status(400).json(err));
});

routes.patch('/profile', verifyTokenByRequest, async (request, response) => {
    const user: User = await getUserByRequest(request, response);

    const password:
        {
            password: string,
            newPassword: string
        } = request.body;

    putPassword(password, user)
        .then(result => response.status(200).json(result))
        .catch(err => response.status(400).json(err));
});

/* Books */
routes.get('/books', verifyTokenByRequest, async (request, response) => {
    const user: User = await getUserByRequest(request, response);
    const ownerBook: string | undefined = request.query['ownerBook']?.toString();

    readBooks(user, ownerBook)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(error.staus || 400).json(error));
});

routes.post('/books', verifyTokenByRequest, async (request, response) => {
    const user: User = await getUserByRequest(request, response);
    const newBook: NewBook = request.body;

    createBook(user, newBook)
        .then(result => response.status(201).json(result))
        .catch(err => response.status(400).json(err));
});

routes.get('/books/:idBook', verifyTokenByRequest, async (request, response) => {
    const idBook = request.params['idBook']

    readBook(idBook)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(400).json(error));
});

routes.put('/books/:idBook', verifyTokenByRequest, async (request, response) => {
    const user: User = await getUserByRequest(request, response);
    const idBook = request.params['idBook'];
    const putBook: PutBook = request.body;

    updateBook(user, idBook, putBook)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(error.status || 400).json(error));
});

routes.delete('/books/:idBook', verifyTokenByRequest, async (request, response) => {
    const user: User = await getUserByRequest(request, response);
    const idBook = request.params['idBook'];

    deleteBook(user, idBook)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(error.status || 400).json(error));
});

/* Images book */
routes.post('/books/:idBook/images', verifyTokenByRequest, formData.single('image'), async (request, response) => {
    const user: User = await getUserByRequest(request, response);
    const idBook = request.params['idBook'];
    const image = request.file;

    if (request.query['description']) {
        const newImageBook: NewImageBook = {
            description: request.query['description'].toString().replace('+', ' ')
        };

        uploadImageBook(user, idBook, newImageBook, image)
            .then(result => response.status(201).json(result))
            .catch(error => response.status(error.status || 400).json(error));
    } else
        response.status(400).json({ message: 'Descrição da imagem obrigatória' });
});

routes.delete('/books/:idBook/images/:idImage', verifyTokenByRequest, async (request, response) => {
    const user: User = await getUserByRequest(request, response);
    const idBook = request.params['idBook'];
    const idImage = request.params['idImage'];

    deleteImageBook(user, idBook, idImage)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(error.status || 400).json(error));
});

/* Geolocation */
routes.get('/geolocation', verifyTokenByRequest, async (request, response) => {
    const user: User = await getUserByRequest(request, response);

    readGeolocation(user)
        .then(result => response.status(200).json(result));
});

routes.put('/geolocation', verifyTokenByRequest, async (request, response) => {
    const user: User = await getUserByRequest(request, response);
    const newGeolocation: NewGeolocation = request.body;

    updateGeolocation(user, newGeolocation)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(error.status || 400).json(error));
});

/* Users */
routes.get('/users', verifyTokenByRequest, async (request, response) => {
    const user: User = await getUserByRequest(request, response);
    const paramsSearchUsers: SearchUsers = request.query;

    readUsers(user, paramsSearchUsers)
        .then(result => response.status(200).json(result));
});

/* Exchange */
routes.post('/exchanges', async (request, response) => {
    const user: User = await getUserByRequest(request, response);
    const newExchange: NewExchange = request.body;

    createExchange(user, newExchange)
        .then(result => response.status(201).json(result))
        .catch(error => response.status(error.status || 400).json(error));
});

routes.get('/exchanges', async (request, response) => {
    const user: User = await getUserByRequest(request, response);
    const paramStatus: {status?: 'pendente' | 'confirmada' | 'recusada' | 'concluida' | 'cancelada'} = request.query;
    
    readExchanges(user, paramStatus.status)
        .then(result => response.status(200).json(result));
});

routes.post('/exchanges/:idExchange', async (request, response) => {
    const user: User = await getUserByRequest(request, response);
    const idExchange: number = parseInt(request.params['idExchange']);
    const requestedBookId: number = request.body.requestedBookId;
    
    addSecondBookInExchange(user, idExchange, requestedBookId)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(error.status || 400).json(error));
});

routes.put('/exchanges/:idExchange', async (request, response) => {
    const user: User = await getUserByRequest(request, response);
    const idExchange: number = parseInt(request.params['idExchange']);
    const status: 'confirmar' | 'recusar' | 'concluir' | 'cancelar' = request.body.status;

    updateStatusExchange(user, idExchange, status)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(error.status || 400).json(error));
});

export default routes;