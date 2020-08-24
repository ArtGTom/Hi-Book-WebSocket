import db from "../database/connection";
import statusUserView from "../models/statusUserView.model";
import statusBookView from "../models/statusBookView.model";

export async function getStatusUserById(idStatus: number): Promise<statusUserView> {

    return new Promise(async (resolve) => {
        const status = await db('tb_status_user as su')
            .select('*')
            .where('su.cd_status_user', '=', idStatus);
        const statusResponse: statusUserView = {
            name: status[0].nm_status,
            description: status[0].ds_status
        }
        resolve(statusResponse);
    })
}

export async function getStatusBookById(idStatus: number): Promise<statusBookView> {
    
    return new Promise(async (resolve) => {
        const status = await db('tb_status_book as sb')
            .select('*')
            .where('sb.cd_status_book', '=', idStatus);
        const statusResponse: statusBookView = {
            name: status[0].nm_status,
            description: status[0].ds_status
        }
        resolve(statusResponse);
    })
}