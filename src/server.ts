import express from 'express';
import startWebSocket from './websocket/socketIo';

const app = express();

/* CARREGA AS VARIAVEIS DE AMBIENTE */
require('dotenv-safe').config();

startWebSocket(app);