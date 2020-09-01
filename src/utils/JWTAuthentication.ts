import jwt from 'jsonwebtoken';
import db from '../database/connection';
import User from '../models/user.model';
import { NextFunction } from 'express';
import { Socket } from 'socket.io';

export function verifyTokenBySocket(socket: Socket, next: NextFunction) {

    const token = socket.handshake.headers['x-access-token'];
    if (!token)
        next(new Error('Nenhum token de autenticação fornecido'));
    else {
        jwt.verify(token as string, process.env.SECRET as string, async (err) => {
            if (err)
                next(new Error('Token inválido'));
            else
                next();
        });
    }
}

export function getUserBySocket(socket: Socket): Promise<User> {

    const token = socket.handshake.headers['x-access-token'];
    let decoded: any = jwt.decode(token as string);

    return new Promise(async (resolve) => {
        const user =
            await db('tb_user')
                .select('tb_user.cd_user', 'tb_user.nm_user', 'tb_user.nm_username', 'tb_user.nm_email_user',
                    'tb_user.cd_user_icon_URL', 'tb_user.ds_biography', 'tb_user.cd_phone_number', 'tb_user.cd_status_user', 'tb_user.cd_geolocation', 'tb_user.cd_city')
                .where('tb_user.cd_user', '=', decoded.idUser);

        if (user[0])
            resolve(user[0] as User);
        else
            socket.error('Houve um problema de autenticação. Renove seu token.');
    });
}