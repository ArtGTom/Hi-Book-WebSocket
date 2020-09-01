import express from 'express';
import routes from './http/routes';
import startWebSocket from './websocket/socketIo';

const app = express();
startWebSocket(app);

const listenPort = process.env.PORT || 4242;

/* CARREGA AS VARIAVEIS DE AMBIENTE */
require('dotenv-safe').config();
require('./aws/bucket');

app.use(express.json());
app.use(routes);

app.listen(listenPort, () => {
    console.log(`---------------------RODANDO NA PORTA ${listenPort}---------------------`);
});