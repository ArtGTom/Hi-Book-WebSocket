import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import db from '../database/connection';
import  User  from '../models/user.model';


export async function GenerateToken(idUser: number): Promise<string> {

    return new Promise((resolve) => {
        let token = jwt.sign({ idUser }, process.env.SECRET as string);
        resolve(token);
    });
}

export function verifyToken(request: Request, response: Response, next: NextFunction) {

    const token = request.headers['x-access-token'];
    if (!token)
        response.status(409).json({ message: 'Nenhum token de autenticação fornecido' });
    else {
        jwt.verify(token as string, process.env.SECRET as string, async (err) => {
            if (err)
                response.status(409).json({ message: 'Token inválido' });
            else
                next();
        });
    }
}

export function getUserByToken(request: Request, response: Response): Promise<User> {

    const token = request.headers['x-access-token'];
    let decoded: any = jwt.decode(token as string);

    return new Promise(async (resolve) => {
        const user =
            await db('tb_user')
                .select('tb_user.cd_user', 'tb_user.nm_user', 'tb_user.nm_username', 'tb_user.nm_email_user',
                    'tb_user.cd_user_icon_URL', 'tb_user.ds_biography', 'tb_user.cd_phone_number', 'tb_user.cd_status_user', 'tb_user.cd_geolocation', 'tb_user.cd_city')
                .where('tb_user.cd_user', '=', decoded.idUser);
                
            if(user[0])
                resolve(user[0] as User);
            else
                response.status(409).json({ message: 'Houve um problema de autenticação. Renove seu token.' })
    });
}