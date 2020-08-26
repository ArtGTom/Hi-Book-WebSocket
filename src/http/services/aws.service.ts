import AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import User from '../../models/user.model';
import db from '../../database/connection';
import Book from '../../models/book.model';
import { NewImageBook } from '../../models/imageBookOperations.model';
import ImageBook from '../../models/imageBook.model';

/* Instancia o service da AWS */
const s3 = new AWS.S3();

export async function uploadImageProfile(user: User, image: Express.Multer.File) {

    return new Promise(async (resolve, reject) => {

        if (image) {
            let type = '';
            // Verifica se o formato está certo
            if (image.mimetype == 'image/png')
                type = '.png'
            else if (image.mimetype == 'image/jpeg' || image.mimetype == 'image/jpg')
                type = '.jpg'
            else
                reject({ message: 'Formato de arquivo não suportados. Tente com uma imagem png ou jpg' });

            // Gera o nome do arquivo e o link que o arquivo será disponibilizado
            const fileName: string = genNameFile(user, null, null, type);
            const link = 'https://' + process.env.BUCKET_NAME as string + '.s3-' + process.env.BUCKET_REGION + '.amazonaws.com/images/profile/' + fileName;

            // Configura a request de upload
            const putObjectRequest: PutObjectRequest =
            {
                Bucket: process.env.BUCKET_NAME as string + '/images/profile',
                Key: fileName,
                Body: image.buffer,
                ContentLength: image.size,
                ACL: 'public-read',
                ContentType: (type == 'image/jpeg') ? 'image/jpeg' : 'image/png'
            };

            // Faz o upload o arquivo
            s3.upload(putObjectRequest, async (err: Error) => {
                if (err) {
                    console.error(err);
                    reject({ message: 'Ocorreu um erro inesperado ao enviar sua foto para nosso servidor. Tente novamente mais tarde.', error: err });
                } else {
                    // Persiste o link no banco e retorna o link para o usuário
                    await db('tb_user').update({ cd_user_icon_URL: link }).where('tb_user.cd_user', '=', user.cd_user)
                        .then(() => resolve({ message: 'Imagem cadastrada com sucesso!', image: link }))
                        .catch(e => {
                            reject({ message: 'Ocorreu um erro inesperado ao enviar sua foto para nosso servidor. Tente novamente mais tarde.', error: e });
                            console.error(e)
                        });
                }
            });
        } else
            reject({ message: 'Campo form-data \'image\' obrigatório!' });
    });
}

export async function uploadImageBook(user: User, idBook: string, newImageBook: NewImageBook, image: Express.Multer.File) {
    return new Promise(async (resolve, reject) => {
        const books: Array<Book> =
            await db('tb_book as b')
                .select('*')
                .where('b.cd_book', '=', idBook);

        const book: Book = books[0];

        if (!book)
            reject({ message: 'Este livro não existe', status: 404 });
        else {
            const userBook =
                await db('tb_book as b')
                    .select('*')
                    .where('b.cd_book', '=', idBook)
                    .andWhere('b.cd_user', '=', user.cd_user);

            if (!userBook)
                reject({ message: 'Usuário não tem privilégios sob este livro', status: 409 });
            else {
                if (image) {
                    let type = '';
                    // Verifica se o formato está certo
                    if (image.mimetype == 'image/png')
                        type = '.png'
                    else if (image.mimetype == 'image/jpeg' || image.mimetype == 'image/jpg')
                        type = '.jpg'
                    else
                        reject({ message: 'Formato de arquivo não suportados. Tente com uma imagem png ou jpg' });

                    const qtdImageBook =
                        await db('tb_image_book as ib')
                            .count('ib.cd_image_book')
                            .where('ib.cd_book', '=', book.cd_book as number);

                    // Gera o nome do arquivo e o link que o arquivo será disponibilizado
                    const fileName: string = genNameFile(user, book, qtdImageBook[0].count.toString(), type);
                    const link = 'https://' + process.env.BUCKET_NAME as string + '.s3-' + process.env.BUCKET_REGION + '.amazonaws.com/images/books/' + fileName;

                    // Configura a request de upload
                    const putObjectRequest: PutObjectRequest =
                    {
                        Bucket: process.env.BUCKET_NAME as string + '/images/books',
                        Key: fileName,
                        Body: image.buffer,
                        ContentLength: image.size,
                        ACL: 'public-read',
                        ContentType: (type == 'image/jpeg') ? 'image/jpeg' : 'image/png'
                    };

                    // Faz o upload o arquivo
                    s3.upload(putObjectRequest, async (err: Error) => {
                        if (err) {
                            console.error(err);
                            reject({ message: 'Ocorreu um erro inesperado ao enviar sua foto para nosso servidor. Tente novamente mais tarde.', error: err });
                        } else {
                            // Persiste o link no banco e retorna o link para o usuário
                            await db('tb_image_book as ib')
                                .insert({
                                    cd_image_URL: link,
                                    ds_image: newImageBook.description,
                                    cd_book: book.cd_book
                                })
                                .then(() => resolve({ message: 'Imagem cadastrada com sucesso!', image: link }))
                                .catch(e => {
                                    reject({ message: 'Ocorreu um erro inesperado ao enviar sua foto para nosso servidor. Tente novamente mais tarde.', error: e });
                                    console.error(e)
                                });
                        }
                    });
                } else
                    reject({ message: 'Campo form-data \'image\' obrigatório!' });
            }
        }
    });
}

export async function deleteImageBook(user: User, idBook: string, idImage: string) {

    return new Promise(async (resolve, reject) => {
        const books: Array<Book> =
            await db('tb_book as b')
                .select('*')
                .where('b.cd_book', '=', idBook);

        const book: Book = books[0];

        if (!book)
            reject({ message: 'Este livro não existe', status: 404 });
        else {
            const userBook =
                await db('tb_book as b')
                    .select('*')
                    .where('b.cd_book', '=', idBook)
                    .andWhere('b.cd_user', '=', user.cd_user);

            if (!userBook)
                reject({ message: 'Usuário não tem privilégios sob este livro', status: 409 });
            else {
                const imagesBook: Array<ImageBook> =
                    await db('tb_image_book as ib')
                        .select('*')
                        .where('ib.cd_image_book', '=', idImage)
                        .andWhere('ib.cd_book', '=', idBook);
                
                const imageBook = imagesBook[0];

                if(!imageBook)
                    reject({message: 'Esta imagem não existe para este livro', status: 404});
                else {
                    s3.deleteObject(
                        {
                            Bucket: process.env.BUCKET_NAME + '\images\books',
                            Key: imageBook.cd_image_URL
                        }
                    );
                    db()
                        .delete()
                        .from('tb_image_book as ib')
                        .where('ib.cd_image_book', '=', imageBook.cd_image_book);

                    resolve({message: 'Imagem deletada com sucesso!'});
                }
            }
        }
    });
}

function genNameFile(user: User, book: Book | null, qtdBook: string | null, type: string): string {
            console.log(qtdBook);
            if (book == null) {
                const data = new Date()
                const fileName: string =
                    `profile-id-${user.cd_user}-${data.getDate()}-${data.getMonth()}-${data.getFullYear()}${type}`;

                return fileName;
            } else {
                const data = new Date()
                const fileName: string =
                    `book-id-${book.cd_book}-${data.getDate()}-${data.getMonth()}-${data.getFullYear()}-image-${qtdBook}-${type}`;

                return fileName;
            }
        }
