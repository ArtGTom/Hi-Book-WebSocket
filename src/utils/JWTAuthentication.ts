import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import db from '../database/connection';


export async function GenerateToken(idUser: number): Promise<any> {

    const promise = new Promise((resolve, reject) => {
        let token = jwt.sign({idUser}, process.env.SECRET as string);

        resolve(token);
    });
    
    return promise;
}

export function verifyToken(request: Request, response: Response, next: NextFunction) {
    const token = request.headers['x-access-token'];
    if(!token)
        response.status(409).json({message: 'Nenhum token de autenticação fornecido'});
    else {
        jwt.verify(token as string, process.env.SECRET as string, async(err) => {
            if(err)
                response.status(409).json({message: 'Token inválido'});
            else 
                next();
        });
    }
}

export async function getUserByToken(request: Request) {
    const promise = new Promise(async (resolve, reject) => {
        
        const token = request.headers['x-access-token'];
        let decoded: any = jwt.decode(token as string);
        
        let user = await db('tb_user')
                    .select('tb_user.cd_user', 'tb_user.nm_user', 'tb_user.nm_username', 'tb_user.nm_email_user',
                        'tb_user.cd_user_icon_URL', 'tb_user.ds_biography', 'tb_user.cd_phone_number')
                    .where('tb_user.cd_user', '=', decoded.idUser);
        
        if(user)
            resolve(user[0]);
        else
            reject({message: 'Houve um problema de autenticação. Renove seu token.'});
    });
 
    return promise;
}