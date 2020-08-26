import express from 'express';
import http from 'http';
import io from 'socket.io';
import routes from './http/routes';

const app = express();
const server = http.createServer(app);
const socketIo = io(server);

const listenPort = process.env.PORT || 4242;

/* CARREGA AS VARIAVEIS DE AMBIENTE */
require('dotenv-safe').config();
require('./aws/bucket');

app.use(express.json());
app.use(routes);

app.listen(listenPort, () => {
    console.log(`---------------------RODANDO NA PORTA ${listenPort}---------------------`);
});