import express from 'express';
import http from 'http';
import io from 'socket.io';
import routes from './http/routes';

const app = express();
const server = http.createServer(app);
const socketIo = io(server);

<<<<<<< HEAD
const listenPort = process.env.PORT || 4242;
=======
const listenPort = process.env.PORT || 3000;
>>>>>>> 5db90d4c8a4755ae3ebf9435fa9a20ba379729b0

/* CARREGA AS VARIAVEIS DE AMBIENTE */
require('dotenv-safe').config();
require('./aws/bucket');

app.use(express.json());
app.use(routes);

<<<<<<< HEAD
app.listen(listenPort, () => {
    console.log(`---------------------RODANDO NA PORTA ${listenPort}---------------------`);
=======
console.log('rodando');

app.listen(listenPort, () => {
    console.log('---------------------RODANDO---------------------');
>>>>>>> 5db90d4c8a4755ae3ebf9435fa9a20ba379729b0
});