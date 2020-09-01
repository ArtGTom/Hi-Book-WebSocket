import Geolocation from "../../models/geolocation.model";
import db from '../../database/connection';
import User from '../../models/user.model';
import { NewGeolocation } from "../../models/geolocationOperations.model";
import { convertFromGeolocation } from "../../utils/convertModelToJSON";

export async function createGeolocation(user: User, newGeolocation: NewGeolocation) {

    return new Promise(async (resolve, reject) => {
        const trx = await db.transaction();

        const insertedGeolocationIds: Array<number> =
            await trx('tb_geolocation as g')
                .insert({
                    cd_latitude: newGeolocation.latitude,
                    cd_longitude: newGeolocation.longitude
                }).returning('g.cd_geolocation');

        const geolocation_id: number = insertedGeolocationIds[0];

        trx('tb_user as u')
            .update({ cd_geolocation: geolocation_id })
            .where('u.cd_user', '=', user.cd_user);

        trx.commit()
            .then(() => {
                resolve({ message: 'Geolocalização cadastrada com sucesso' });
            })
            .catch(error => {
                reject({ message: 'Erro inesperado ao tentar cadastrar geoloalização. Tente novamente mais tarde', error });
                console.error(error);
                trx.rollback();
            });
    });
}

export async function readGeolocation(user: User) {
    return new Promise(async (resolve) => {
        const geolocation: Array<Geolocation> =
            await db('tb_geolocation as g')
                .select()
                .where('g.cd_geolocation', '=', user.cd_geolocation);

        resolve(convertFromGeolocation(geolocation[0]));
    })
}

export async function updateGeolocation(user: User, newGeolocation: NewGeolocation) {

    return new Promise(async (resolve, reject) => {
        const trx = await db.transaction();

        const geolocation: Array<Geolocation> =
            await trx('tb_geolocation as g')
                .update({
                    cd_latitude: newGeolocation.latitude,
                    cd_longitude: newGeolocation.longitude
                })
                .where('g.cd_geolocation', '=', user.cd_geolocation)
                .returning('*');

        trx.commit()
            .then(() => {
                resolve(convertFromGeolocation(geolocation[0]));
            })
            .catch(error => {
                reject({ message: 'Erro inesperado ao tentar atualizar geolocalização. Tente novamente mais tarde', error });
                console.error(error);
                trx.rollback();
            });
    });
}