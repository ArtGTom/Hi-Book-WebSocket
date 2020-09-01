import socketIo, { Socket } from 'socket.io';
import http from 'http';
import db from '../database/connection';
import { getUserBySocket, verifyTokenBySocket } from '../utils/JWTAuthentication';
import User from '../models/user.model';
import Room from '../models/room.model';
import Message from '../models/message.model';
import { ViewMessage } from '../models/messageOperations';
import { convertFromMessage, convertFromRoom } from '../utils/convertModelToJSON';
import { ViewRoom } from '../models/roomOperations.model';

export default function startWebSocket(app: any) {
    const httpServer = http.createServer(app);
    
    const options = {
        origins: "*:*"
    };
    const io = socketIo(httpServer, options);
    // Adiciona autenticação como middleware
    io.use(verifyTokenBySocket);

    io.on('connection', async (socket: Socket) => {
        const user: User = await getUserBySocket(socket);
        socket.on('send message', async (payload) => {
            if (!payload.toUser || !payload.message)
                socket.error('Informações incompletas para')
            else {
                const searchUser: Array<User> =
                    await db('tb_user as u')
                        .select()
                        .where('u.nm_username', '=', payload.toUser);
                if (!searchUser[0])
                    socket.error('Este usuário não existe');
                else {
                    const toUser = searchUser[0];
                    const rooms: Array<Room> =
                        await db('tb_room as r')
                            .select()
                            .where('r.nm_room', '=', `chat-${user.cd_user}-${toUser.cd_user}`)
                            .orWhere('r.nm_room', '=', `chat-${toUser.cd_user}-${user.cd_user}`);

                    var room: Room;
                    if (!rooms[0]) {
                        const trx = await db.transaction();

                        const insertedRooms: Array<Room> =
                            await trx('tb_room as r')
                                .insert({
                                    nm_room: `chat-${user.cd_user}-${toUser.cd_user}`,
                                    ds_room: `Conversa entre user <${user.cd_user}> e <${toUser.cd_user}>`
                                }).returning('*');

                        await trx('item_room_user')
                            .insert({
                                cd_room: insertedRooms[0].cd_room,
                                cd_user: user.cd_user
                            });

                        await trx('item_room_user')
                            .insert({
                                cd_room: insertedRooms[0].cd_room,
                                cd_user: toUser.cd_user
                            });

                        await trx.commit()
                            .catch(error => {
                                socket.error('Ocorreu um erro inesperado ao cirar a sala. Tente novamente mais tarde.');
                                console.error(error);
                                trx.rollback();
                            });

                        room = insertedRooms[0];
                    } else {
                        room = rooms[0];
                    }
                    socket.join(room.nm_room);

                    await db('tb_message as m')
                        .insert({
                            ds_message: payload.message,
                            cd_room: room.cd_room,
                            cd_user: user.cd_user
                        });

                    const messages: Array<Message> =
                        await db('tb_message as m')
                            .select()
                            .where('m.cd_room', '=', room.cd_room)
                            .orderBy('m.cd_message', 'asc');

                    const messagesResponse: Array<ViewMessage> = [];
                    messages.map(async (message) => {
                        const viewMessage = await convertFromMessage(message);
                        messagesResponse.push(viewMessage);

                        if (messagesResponse.length == messages.length)
                            io.to(room.nm_room).emit('get messages', messagesResponse);
                    });
                }
            }
        });

        socket.on('get messages', async (payload) => {
            if (!payload.toUser)
                socket.error('Informações necessárias para completar esta ação incompletas');
            else {
                const searchUser: Array<User> =
                    await db('tb_user as u')
                        .select()
                        .where('u.nm_username', '=', payload.toUser);
                if (!searchUser[0])
                    socket.error('Este usuário não existe');
                else {
                    const toUser = searchUser[0];
                    const rooms: Array<Room> =
                        await db('tb_room as r')
                            .select()
                            .where('r.nm_room', '=', `chat-${user.cd_user}-${toUser.cd_user}`)
                            .orWhere('r.nm_room', '=', `chat-${toUser.cd_user}-${user.cd_user}`);


                    if (!rooms[0])
                        socket.emit('get messages', []);
                    else {
                        const room = rooms[0];

                        const messages: Array<Message> =
                            await db('tb_message as m')
                                .select()
                                .where('m.cd_room', '=', room.cd_room)
                                .orderBy('m.cd_message', 'asc');

                        const messagesResponse: Array<ViewMessage> = [];

                        messages.map(async (message) => {
                            const viewMessage = await convertFromMessage(message);
                            messagesResponse.push(viewMessage);

                            if (messagesResponse.length == messages.length)
                                socket.emit('get messages', messagesResponse);
                        });
                    }
                }
            }
        });

        socket.on('get rooms', async () => {
            const rooms: Array<Room> =
                await db('tb_room as r')
                    .select()
                    .join('item_room_user as i', 'i.cd_room', 'r.cd_room')
                    .where('i.cd_user', '=', user.cd_user);
            
            const roomsResponse: Array<ViewRoom> = [];
                
            rooms.map(async room => {
                roomsResponse.push(await convertFromRoom(room, user));

                if(roomsResponse.length == rooms.length)
                    socket.emit('get rooms', roomsResponse)
            });
        });
    });
    httpServer.listen(4243, () => {
        console.log(`--------RODANDO NA PORTA ${4243}-------- `);
    });
}