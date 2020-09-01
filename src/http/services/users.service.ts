import User from "../../models/user.model";
import db from "../../database/connection";
import Profile from "../../models/profile.model";
import haversine from "../../utils/haversine";
import { SearchUsers } from '../../models/userOperations.model';
import { convertFromUser } from "../../utils/convertModelToJSON";

export async function readUsers(user: User, paramsSearchUsers: SearchUsers): Promise<Array<Profile>> {
    const userProfile: Profile = await convertFromUser(user);

    let usersFound: Array<User> = [];

    paramsSearchUsers.city = paramsSearchUsers.city?.toLowerCase().trimLeft().trimRight().replace('+', ' ');
    paramsSearchUsers.uf = paramsSearchUsers.uf?.toUpperCase().trimLeft().trimRight();

    if (paramsSearchUsers.city && paramsSearchUsers.uf) {
        usersFound =
            await db('tb_user as u')
                .select()
                .join('tb_geolocation as g', 'g.cd_geolocation', 'u.cd_geolocation')
                .join('tb_city as c', 'c.cd_city', 'u.cd_city')
                .join('tb_uf as uf', 'uf.cd_uf', 'c.cd_uf')
                .where('uf.sg_uf', '=', paramsSearchUsers.uf)
                .where('c.nm_city', '=', paramsSearchUsers.city);

    } else if (paramsSearchUsers.city && !paramsSearchUsers.uf) {
        usersFound =
            await db('tb_user as u')
                .select()
                .join('tb_geolocation as g', 'g.cd_geolocation', 'u.cd_geolocation')
                .join('tb_city as c', 'c.cd_city', 'u.cd_city')
                .where('c.nm_city', '=', paramsSearchUsers.city);

    } else if (!paramsSearchUsers.city && paramsSearchUsers.uf) {
        usersFound =
            await db('tb_user as u')
                .select()
                .join('tb_geolocation as g', 'g.cd_geolocation', 'u.cd_geolocation')
                .join('tb_city as c', 'c.cd_city', 'u.cd_city')
                .join('tb_uf as uf', 'uf.cd_uf', 'c.cd_uf')
                .where('uf.sg_uf', '=', paramsSearchUsers.uf);

    } else {
        usersFound =
            await db('tb_user as u')
                .select()
                .join('tb_geolocation as g', 'g.cd_geolocation', 'u.cd_geolocation');
    }


    const profilesFound: Array<Profile> = [];

    return new Promise((resolve) => {
        let i = 1;
        if (usersFound.length == 0)
            resolve(profilesFound);
        usersFound.map(async (item) => {
            const itemProfile: Profile = await convertFromUser(item);
            profilesFound.push(itemProfile);

            if (paramsSearchUsers.radiusDistance) {
                const distance = haversine(
                    userProfile.geolocation.latitude, userProfile.geolocation.longitude,
                    itemProfile.geolocation.latitude, itemProfile.geolocation.longitude);

                if (distance > paramsSearchUsers.radiusDistance)
                    profilesFound.splice((i - 1), 1);
            }

            // Retira caso seja o usuário que requisitou a busca
            if (item.nm_username == user.nm_username)
                profilesFound.splice((i - 1), 1)

            if (i == usersFound.length)
                resolve(profilesFound);

            i++;
        });
    });
}