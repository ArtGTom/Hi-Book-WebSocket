import express, { response } from 'express';
import multer from 'multer';
import {Login, Register} from './services/auth.service';
import { CreateUser } from '../models/user.model';
import { verifyToken } from '../utils/JWTAuthentication';
import { updateProfile, readProfile, putPassword } from './services/profile.service';
import { uploadImageProfile } from './services/aws.service';

const routes = express.Router();
const images = multer();

routes.post('/users', async (request, response) => {
    let user: CreateUser = request.body;

    Register(user)
        .then(result => response.status(201).json(result))
        .catch(reject => response.status(400).json(reject));
});

routes.post('/login', async (request, response) => {
    let credentials: {login: string, password: string} = request.body;
    
    Login(credentials)
        .then(result => response.status(200).json(result))
        .catch(reject => response.status(400).json(reject));
});

routes.get('/profile', verifyToken, async (request, response) => {
    readProfile(request)
        .then(result => response.status(200).json(result))
        .catch(err => response.status(400). json(err))
});

routes.post('/profile', verifyToken, images.single('image'), async (request,response) => {
    uploadImageProfile(request)
        .then(result => response.status(200).json(result))
        .catch(err => response.status(400).json(err));
});

routes.put('/profile', verifyToken, async (request, response) => {
    updateProfile(request)
        .then(result => response.status(200).json(result))
        .catch(err => response.status(400).json(err));
});

routes.patch('/profile', verifyToken, async (request, response) => {
    putPassword(request)
        .then(result => response.status(200).json(result))
        .catch(err => response.status(400).json(err));
});

export default routes;