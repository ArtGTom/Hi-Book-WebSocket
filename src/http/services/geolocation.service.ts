import { NewGeolocation } from "../../models/geolocationOperations.model";
import db from '../../database/connection';
import User from '../../models/user.model';

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
                resolve({message: 'Geoloalização cadastrada com sucesso'});
            })
            .catch(error => {
                reject({message: 'Erro inesperado ao tentar cadastrar geoloalização. Tente novamente mais tarde', error});
                console.error(error);
                trx.rollback();
            });
    });
}