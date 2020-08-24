import express from 'express';
import http from 'http';
import io from 'socket.io';
import routes from './http/routes';
import { DeleteObjectRequest } from 'aws-sdk/clients/s3';
import AWS from 'aws-sdk';
import getStatusById from './utils/getStatusById';

const app = express();
const server = http.createServer(app);
const socketIo = io(server);

/* CARREGA AS VARIAVEIS DE AMBIENTE */
require('dotenv-safe').config();
require('./aws/bucket');

app.use(express.json());
app.use(routes);

console.log('rodando');

app.listen(4242);