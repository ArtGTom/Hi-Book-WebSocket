import User from "../models/user.model";
import db from "../database/connection";
import Message from "../models/message.model";
import Room from "../models/room.model";
import { ViewMessage } from "../models/messageOperations";
import { ViewRoom } from "../models/roomOperations.model";

export async function convertFromMessage(model: Message): Promise<ViewMessage> {
    const user =
        await db('tb_user as u')
            .select()
            .where('u.cd_user', '=', model.cd_user);

    const author: string = user[0].nm_username;

    return new Promise((resolve) => {
        const viewMessage: ViewMessage = {
            message: model.ds_message,
            sended: model.created_at.toLocaleString(),
            author
        }

        resolve(viewMessage);
    });
}

export async function convertFromRoom(model: Room, user: User): Promise<ViewRoom> {
    const messages: Array<Message> =
        await db('tb_message as m')
            .select()
            .where('m.cd_room', '=', model.cd_room)
            .orderBy('m.created_at', 'desc');

    const users: Array<User> =
        await db('tb_user as u')
            .select()
            .join('item_room_user as i', 'i.cd_user', 'u.cd_user')
            .where('i.cd_room', '=', model.cd_room);

    var nameRoom: string;
    users.map(userItem => {
        if (userItem.nm_user != user.nm_user)
            nameRoom = userItem.nm_user
    });

    const lastMessage = await convertFromMessage(messages[0]);

    return new Promise((resolve) => {
        const viewRoom: ViewRoom = {
            name: nameRoom,
            lastMessage
        }
        resolve(viewRoom);
    });
}