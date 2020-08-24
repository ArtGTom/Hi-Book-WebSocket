import AWS from 'aws-sdk';
import { PutObjectRequest, DeleteObjectRequest } from 'aws-sdk/clients/s3';
import { Request } from 'express';
import { getUserByToken } from '../../utils/JWTAuthentication';
import { User } from '../../models/user.model';
import db from '../../database/connection';

/* Instancia o service da AWS */
const s3 = new AWS.S3();

export async function uploadImageProfile( user: User, image: Express.Multer.File) {
    const promise = new Promise(async (resolve, reject) => {

        if(image) {
            let type = '';
            // Verifica se o formato está certo
            if(image.mimetype == 'image/png')
                type = '.png'
            else if(image.mimetype == 'image/jpeg' || image.mimetype == 'image/jpg')
                type = '.jpg'
            else
                reject({message: 'Formato de arquivo não suportados. Tente com uma imagem png ou jpg'});
            
            // Gera o nome do arquivo e o link que o arquivo será disponibilizado
            const fileName: string = genNameFile(user, type);
            const link = 'https://' + process.env.BUCKET_NAME as string +'.s3-'+process.env.BUCKET_REGION+'.amazonaws.com/images/profile/' + fileName;

            // Configura a request de upload
            const putObjectRequest: PutObjectRequest = 
                {
                    Bucket: process.env.BUCKET_NAME as string +'/images/profile', 
                    Key: fileName, 
                    Body: image.buffer,
                    ContentLength: image.size,
                    ACL: 'public-read',
                    ContentType: (type == 'image/jpeg')?'image/jpeg':'image/png'
                };
    
            // Faz o upload o arquivo
            s3.upload(putObjectRequest, async (err: Error) => {
                if(err){
                    console.error(err);
                    reject({message: 'Ocorreu um erro inesperado ao enviar sua foto para nosso servidor. Tente novamente mais tarde.', error: err});
                }else {
                    // Persiste o link no banco e retorna o link para o usuário
                    await db('tb_user').update({cd_user_icon_URL: link}).where('tb_user.cd_user','=', user.cd_user)
                        .then(() => resolve({message: 'Imagem cadastrada com sucesso!', image: link}))
                        .catch(e => {
                                    reject({message: 'Ocorreu um erro inesperado ao enviar sua foto para nosso servidor. Tente novamente mais tarde.', error: e});
                                    console.error(e)});
                }
            });
        } else
            reject({message:'Campo form-data \'image\' obrigatório!'});
    });

    return promise;
}

function genNameFile(user: User, type: string): string {
    const data = new Date()
    const fileName: string = 
        `profile-id-${user.cd_user}-${data.getDate()}-${data.getMonth()}-${data.getFullYear()}${type}`;

    return fileName;
}