import db from "../../database/connection";
import User from "../../models/user.model";
import Book from "../../models/book.model";
import { NewBook, ViewBook, PutBook } from "../../models/bookOperations.mode";
import { convertFromBook } from "../../utils/convertModelToJSON";

export async function createBook(user: User, newBook: NewBook) {
    const insertBook: Book = {
        nm_book: newBook.name,
        nm_writer: newBook.writer,
        nm_publisher: newBook.publisher,
        ds_book_description: newBook.description,
        cd_status_book: newBook.status,
        cd_user: user.cd_user
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

            // commita a inserção
            await trx.commit();

            // Retorna os campos do livro inserido
            const book: Array<Book> =
                await db('tb_book')
                    .select('*')
                    .where('tb_book.cd_book', '=', book_id);

            const response = await convertFromBook(book[0]);
            resolve(response);
        } catch (error) {
            reject({ message: 'Erro inesperado ao cadastrar o livro. tente novamente mais tarde', error });
            console.error(error);
            trx.rollback();
        }
    });
}

export async function readBooks(user: User, ownerBook: string | undefined) {

    return new Promise(async (resolve) => {
        var books: Array<Book> = [];
        if (!ownerBook) {
            books = await db('tb_user as u')
                .select('b.cd_book', 'b.nm_book', 'b.nm_writer', 'b.nm_publisher', 'b.ds_book_description', 'b.cd_status_book')
                .join('tb_book as b', 'b.cd_user', 'u.cd_user')
                .where('u.cd_user', '=', user.cd_user)
                .orderBy('b.nm_book', 'asc');;
        } else {
            books = await db('tb_user as u')
                .select('b.cd_book', 'b.nm_book', 'b.nm_writer', 'b.nm_publisher', 'b.ds_book_description', 'b.cd_status_book')
                .join('tb_book as b', 'b.cd_user', 'u.cd_user')
                .where('u.nm_username', '=', '@'.concat(ownerBook))
                .orderBy('b.nm_book', 'asc');
        }

        if (books.length == 0)
            resolve(books);

        const booksResponse: Array<ViewBook> = [];

        books.map(async book => {
            booksResponse.push(await convertFromBook(book))

            if (booksResponse.length == books.length)
                resolve(booksResponse);
        }
        );
    });
}

export async function readBook(idBook: string) {
    return new Promise(async (resolve, reject) => {
        const books: Array<Book> = await db('tb_book as b')
            .select('*')
            .where('b.cd_book', '=', idBook)

        if (!books[0])
            reject({ message: 'Livro não encontrado', status: 404 })

        const bookResponse: ViewBook = await convertFromBook(books[0]);
        resolve(bookResponse);
    });
}

export async function updateBook(user: User, idBook: string, putBook: PutBook) {
    return new Promise(async (resolve, reject) => {
        const bookSearch =
            await db('tb_user as u')
                .select('*')
                .join('tb_book as b', 'b.cd_user', 'u.cd_user')
                .where('b.cd_book', '=', idBook);

        if (!bookSearch[0])
            reject({ message: 'Livro não encontrado.', status: 404 });
        else if (bookSearch[0].cd_user != user.cd_user)
            reject({ message: 'Usuário não tem privilégios sobre este livro.', status: 409 });
        else {
            const book: Book = {
                cd_book: bookSearch[0].cd_book,
                nm_book: bookSearch[0].nm_book,
                nm_writer: bookSearch[0].nm_writer,
                nm_publisher: bookSearch[0].nm_publisher,
                ds_book_description: bookSearch[0].ds_book_description,
                cd_status_book: bookSearch[0].cd_status_book,
                cd_user: user.cd_user
            }

            if (putBook.name != '' && putBook.name != undefined)
                book.nm_book = putBook.name as string;
            if (putBook.writer != '' && putBook.writer != undefined)
                book.nm_writer = putBook.writer as string;
            if (putBook.publisher != '' && putBook.publisher != undefined)
                book.nm_publisher = putBook.publisher as string;
            if (putBook.description != '' && putBook.description != undefined)
                book.ds_book_description = putBook.description as string;
            if (putBook.status != undefined && (putBook.status >= 1 && putBook.status <= 3))
                book.cd_status_book = putBook.status

            const updatedBook: Array<Book> =
                await db('tb_book as b')
                    .update(book)
                    .where('b.cd_book', '=', book.cd_book as number).returning('*');

            const bookResponse = await convertFromBook(updatedBook[0]);
            resolve(bookResponse);
        }
    });
}

export async function deleteBook(user: User, idBook: string) {
    return new Promise(async (resolve, reject) => {
        const bookSearch =
            await db('tb_user as u')
                .select('*')
                .join('tb_book as b', 'b.cd_user', 'u.cd_user')
                .where('b.cd_book', '=', idBook);

        if (!bookSearch[0])
            reject({ message: 'Livro não encontrado.', status: 404 });
        else if (bookSearch[0].cd_user != user.cd_user)
            reject({ message: 'Usuário não tem privilégios sobre este livro.', status: 409 });
        else {
            const trx = await db.transaction();

            await trx.delete()
                .from('tb_image_book as ib');

            await trx.delete()
                .from('tb_book as b')
                .where('b.cd_book', '=', idBook);

            trx.commit()
                .then(() => {
                    resolve({ message: 'Livro deletado com sucesso' })
                })
                .catch(error => {
                    reject({ message: 'Erro inesperado ao deletar o livro. Tente novamente mais tarde', status: 400 });
                    console.error(error);
                    trx.rollback();
                });
        }
    });
}