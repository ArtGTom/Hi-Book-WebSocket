import db from "../../database/connection";
import User from "../../models/user.model";
import Book from "../../models/book.model";
import { NewBook, ViewBook, PutBook } from "../../models/bookOperations.mode";
import { convertFromBook } from "../../utils/convertModelForJSON";

export async function createBook(user: User, newBook: NewBook) {

    const insertBook: Book = {
        nm_book: newBook.name,
        nm_writer: newBook.writer,
        nm_publisher: newBook.publisher,
        ds_book_description: newBook.description
    }
    const trx = await db.transaction();

    return new Promise(async (resolve, reject) => {
        try {

            let insertedBookIds: Array<number> = [];

            // Prepara as inserções
            await trx('tb_book')
                .insert(insertBook)
                .returning('cd_book').then(value => insertedBookIds = value);

            const book_id = insertedBookIds[0];
            
            await trx('item_user_book')
                .insert({ cd_user: user.cd_user, cd_book: book_id });

            // commita as inserções
            await trx.commit();
            
            // Retorna os campos do livro inserido
            const book: Array<Book> =
                await db('tb_book')
                    .select('*')
                    .where('tb_book.cd_book', '=', book_id);
            
            const response = convertFromBook(book[0]);
            resolve(response);
        } catch(error) {
            reject({ message: 'Erro inesperado ao cadastrar o livro. tente novamente mais tarde', error });
            console.error(error);
            trx.rollback();
        }        
    });
}

export async function readBooks(user: User) {

    return new Promise(async (resolve) => {
        const books: Array<Book> = await db('tb_book as b')
            .select('b.cd_book', 'b.nm_book', 'b.nm_writer', 'b.nm_publisher', 'b.ds_book_description')
            .join('item_user_book as i', 'i.cd_book', 'b.cd_book')
            .where('i.cd_user', '=', user.cd_user)

        const booksResponse: Array<ViewBook> = [];

        books.map(book =>
            booksResponse.push(convertFromBook(book))
        );

        resolve(booksResponse)
    });
}

export async function readBook(idBook: string) {
    return new Promise(async (resolve, reject) => {
        const books: Array<Book> = await db('tb_book as b')
            .select('*')
            .where('b.cd_book', '=', idBook)

        if(!books[0])
            reject({message: 'Livro não encontrado', status: 404})

        const bookResponse:ViewBook = convertFromBook(books[0]);
        resolve(bookResponse);
    });
}

export async function updateBook(user: User, idBook: string, putBook: PutBook) {
    return new Promise(async (resolve, reject) => {
        const bookSearch = 
            await db('tb_book as b')
                .select('*')
                .join('item_user_book as i', 'i.cd_book', 'b.cd_book')
                .where('b.cd_book', '=', idBook);

        if(!bookSearch[0])
            reject({message: 'Livro não encontrado.', status: 404});
        else if(bookSearch[0].cd_user != user.cd_user)
            reject({message: 'Usuário não tem privilégios sobre este livro.', status: 409});
        else {
            const book: Book = {
                cd_book: bookSearch[0].cd_book,
                nm_book: bookSearch[0].nm_book,
                nm_writer: bookSearch[0].nm_writer,
                nm_publisher: bookSearch[0].nm_publisher,
                ds_book_description: bookSearch[0].ds_book_description,
            }

            if(putBook.name != '' && putBook.name != undefined)
                book.nm_book = putBook.name as string;
            if(putBook.writer != '' && putBook.writer != undefined)
                book.nm_writer = putBook.writer as string;
            if(putBook.publisher != '' && putBook.publisher != undefined)
                book.nm_publisher = putBook.publisher as string;
            if(putBook.description != '' && putBook.description != undefined)
                book.ds_book_description = putBook.description as string;

            const updatedBook: Array<Book> = 
                await db('tb_book as b')
                    .update(book)
                    .where('b.cd_book', '=', book.cd_book as number).returning('*');

            const bookResponse = convertFromBook(updatedBook[0]);
            resolve(bookResponse);
        } 
    });
}

export async function deleteBook(user: User, idBook: string) {
    return new Promise(async (resolve, reject) => {
        const bookSearch = 
            await db('tb_book as b')
                .select('*')
                .join('item_user_book as i', 'i.cd_book', 'b.cd_book')
                .where('b.cd_book', '=', idBook);

        if(!bookSearch[0])
            reject({message: 'Livro não encontrado.', status: 404});
        else if(bookSearch[0].cd_user != user.cd_user)
            reject({message: 'Usuário não tem privilégios sobre este livro.', status: 409});
        else {
            const trx = await db.transaction();

            await trx.delete()
                    .from('item_user_book as i')
                    .where('i.cd_user', '=', user.cd_user)
                    .andWhere('i.cd_book', '=', idBook);
            
            await trx.delete()
                    .from('tb_book as b')
                    .where('b.cd_book', '=', idBook);

            trx.commit()
                .then(() => {
                    resolve({message: 'Livro deletado com sucesso'})
                })
                .catch(error => {
                    reject({message: 'Erro inesperado ao deletar o livro. Tente novamente mais tarde', status: 400});
                    console.error(error);
                    trx.rollback();
                });   
        }
    });
}