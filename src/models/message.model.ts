import { timestamp } from "aws-sdk/clients/datapipeline";

export default interface Message {
    cd_message: number,
    ds_message: string,
    created_at: timestamp,
    cd_room: number,
    cd_user: number
}