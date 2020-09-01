import User from "../../models/user.model";
import db from "../../database/connection";
import Book from "../../models/book.model";
import Exchange from "../../models/exchange.model";
import { NewExchange, ViewExchange } from "../../models/exchangeOperations.model";
import { convertFromExchange } from "../../utils/convertModelToJSON";

export async function createExchange(user: User, newExchange: NewExchange) {
    return new Promise(async (resolve, reject) => {

        const searchBook: Array<Book> =
            await db('tb_book as b')
                .select()
                .where('b.cd_book', '=', newExchange.requestedBookId);

        const searchUser: Array<User> =
            await db('tb_user as u')
                .select()
                .where('u.nm_username', '=', newExchange.trader);

        if (!searchUser[0]) {
            reject({ message: 'O usuário requisitado para troca não existe', status: 404 });
        } else {
            if (!searchBook[0])
                reject({ message: 'O livro disposto para troca não existe!', status: 404 });
            else {
                if (searchBook[0].cd_user == user.cd_user)
                    reject({ message: 'Você não pode escolher um livro seu pra troca', status: 409 });
                else {
                    const trader = searchUser[0];
                    const book = searchBook[0];

                    const exchange: Array<Exchange> =
                        await db('tb_exchange as e')
                            .insert({
                                cd_first_user: user.cd_user,
                                cd_first_book: book.cd_book,
                                cd_second_user: trader.cd_user,
                            }).returning('*');


                    const exchangeResponse = await convertFromExchange(exchange[0], user);

                    resolve(exchangeResponse);
                }
            }
        }
    });
}

export async function readExchanges(user: User, status?: 'pendente' | 'confirmada' | 'recusada' | 'concluida' | 'cancelada') {

    return new Promise(async (resolve) => {
        var exchanges: Array<Exchange> = [];
        if (!status) {
            exchanges =
                await db('tb_exchange as e')
                    .select()
                    .where('e.cd_first_user', '=', user.cd_user)
                    .orWhere('e.cd_second_user', '=', user.cd_user)
                    .orderBy('e.cd_exchange', 'desc');
        } else {
            exchanges =
                await db('tb_exchange as e')
                    .select()
                    .join('tb_status_exchange as se', 'se.cd_status_exchange', 'e.cd_status_exchange')
                    .where('se.nm_status', '=', status)
                    .andWhere('e.cd_first_user', '=', user.cd_user)
                    .orWhere('e.cd_second_user', '=', user.cd_user)
                    .orderBy('e.cd_exchange', 'desc');
        }
        const exchangesResponse: Array<ViewExchange> = [];

        if (exchanges.length == 0)
            resolve([]);

        exchanges.map(async exchange => {
            exchangesResponse.push(await convertFromExchange(exchange, user));

            if (exchangesResponse.length == exchanges.length)
                resolve(exchangesResponse);
        });
    });
}

export async function addSecondBookInExchange(user: User, exchangeId: number, bookId: number) {

    return new Promise(async (resolve, reject) => {
        const exchanges =
            await db('tb_exchange as e')
                .select()
                .where('e.cd_exchange', '=', exchangeId);

        if (!exchanges[0])
            reject({ message: 'Essa troca não existe', status: 404 });
        else {
            const books =
                await db('tb_book as b')
                    .select()
                    .where('b.cd_book', '=', bookId);

            if (!books[0])
                reject({ message: 'Este livro não existe!', status: 404 })
            else {
                if (books[0].cd_user != exchanges[0].cd_first_user)
                    reject({ message: 'Este livro não pertence ao usuário que você está fazendo troca', status: 409 });
                else {
                    if (exchanges[0].cd_second_user != user.cd_user)
                        reject({ message: 'Você não tem autorização sobre essa troca', status: 409 });
                    else {
                        const exchange: Exchange = exchanges[0];
                        const book: Book = books[0];

                        const newExchange: Array<Exchange> =
                            await db('tb_exchange as e')
                                .update({
                                    cd_second_book: book.cd_book
                                })
                                .where('e.cd_exchange', '=', exchange.cd_exchange)
                                .returning('*');

                        const exchangeResponse = await convertFromExchange(newExchange[0], user);
                        resolve(exchangeResponse);
                    }
                }
            }
        }
    });
}

export async function updateStatusExchange(user: User, exchangeId: number, status: 'confirmar' | 'recusar' | 'concluir' | 'cancelar') {
    return new Promise(async (resolve, reject) => {
        if (status != 'confirmar' && status != 'recusar' && status != 'concluir' && status != 'cancelar')
            reject({ message: 'Status inválido. Status válidos: confirmado, recusado ou concluido' });
        else {
            const exchanges =
                await db('tb_exchange as e')
                    .select()
                    .where('e.cd_exchange', '=', exchangeId);
            if (!exchanges[0])
                reject({ message: 'Essa troca não existe', status: 404 });
            else {
                if (exchanges[0].cd_second_book == null)
                    reject({ message: 'Para confirmar ou recusar uma troca os dois usuários devem selecionar os livros!', status: 400 });
                else {
                    if (exchanges[0].cd_status_exchange != 2 && status == 'concluir' || status == 'cancelar')
                        reject({ message: 'Impossível concluir ou cancelar uma troca que não foi confirmada', status: 400 });
                    else {
                        if (exchanges[0].cd_status_exchange == 4)
                            reject({ message: 'Impossível realizar está ação, pois a troca já foi concluída', status: 400 });
                        else {
                            if (exchanges[0].cd_status_exchange == 5)
                                reject({ message: 'Impossível realizar está ação, pois a troca já foi cancelada', status: 400 });
                            else {
                                if (exchanges[0].cd_status_exchange == 3)
                                    reject({ message: 'Impossível realizar está ação, pois a troca já foi recusada', status: 400 });
                                else {
                                    var updated = {};
                                    if (exchanges[0].cd_first_user == user.cd_user)
                                        updated = { nm_first_confirmation: status };
                                    else
                                        updated = { nm_second_confirmation: status };

                                    const exchangeUpdated =
                                        await db('tb_exchange')
                                            .update(updated)
                                            .where('cd_exchange', '=', exchangeId)
                                            .returning('*');

                                    const exchangeResponse = await convertFromExchange(exchangeUpdated[0], user);
                                    resolve(exchangeResponse);
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}