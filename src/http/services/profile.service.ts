import Profile from '../../models/profile.model';
import PutProfile from '../../models/profileOperations.model'
import User from '../../models/user.model';
import db from '../../database/connection';
import bCrypt from 'bcrypt';
import { convertFromUser } from '../../utils/convertModelForJSON';
import UF from '../../models/uf.model';

export async function readProfile(user: User) {
    return new Promise(async (resolve) => {

        let profile: Profile = await convertFromUser(user);
        resolve(profile);
    });
}

export async function updateProfile(user: User, updateUser: PutProfile) {
    return new Promise(async (resolve, reject) => {

        try {
            if (updateUser.user != '' && updateUser.user != undefined)
                user.nm_user = updateUser.user as string;
            if (updateUser.username != '' && updateUser.username != undefined)
                user.nm_username = updateUser.username as string;
            if (updateUser.biography != '' && updateUser.biography != undefined)
                user.ds_biography = updateUser.biography as string;
            if ((updateUser.status == 1 || updateUser.status == 2) && updateUser.status != undefined)
                user.cd_status_user = updateUser.status as number;
            if (updateUser.phone != '' && updateUser.phone != undefined)
                user.cd_phone_number = updateUser.phone as string;
            if (updateUser.email != '' && updateUser.email != undefined)
                user.nm_email_user = updateUser.email as string;
            if (updateUser.city != '' && updateUser.city != undefined) {
                if (updateUser.city.name != '' && updateUser.city.name != undefined) {
                    const city =
                        await db('tb_city as c')
                            .select()
                            .where('c.nm_city', '=', updateUser.city.name);

                    /* Verifica se a cidade ja existe no banco */
                    if (!city[0]) {
                        if (updateUser.city.uf != '' && updateUser.city.uf != undefined) {
                            // Procura a UF que o user pretende alterar
                            const uf: Array<UF> =
                                await db('tb_uf as u')
                                    .select()
                                    .where('u.sg_uf', '=', updateUser.city.uf.toUpperCase());

                            if (!uf[0])
                                reject({ message: 'UF inválida', status: 400 });
                            else {
                                /* Se a UF for valida vai inserir a cidade no banco */
                                const insertedCityIds =
                                    await db('tb_city as c')
                                        .insert({
                                            nm_city: updateUser.city.name.toLowerCase().trimLeft().trimRight(),
                                            cd_uf: uf[0].cd_uf
                                        })
                                        .returning('c.cd_city');

                                user.cd_city = insertedCityIds[0];
                            }
                        } else {
                            reject({ message: 'Para alterar para uma cidade desconhecida por nós você deve informar qual é a UF dela.' });
                        }
                    } else {
                        user.cd_city = city[0].cd_city;
                    }
                }
            }
            if(updateUser.city?.uf != undefined && !updateUser.city.name)
                reject({ message: 'Para alterar sua UF é necessário informar sua cidade' });
                
        } catch (e) {
            reject({ message: 'Houve um erro ao atualizar suas informações. Tente novamente mais tarde. \nObs.: Indicamos renovar o token de autenticação' })
        }

        await db('tb_user')
            .where('tb_user.cd_user', '=', user.cd_user)
            .update(user)
            .catch(err => {
                reject({ message: 'Erro ao atualizar suas informações. Tente novamente mais tarde.' });
                console.error(err);
            });

        let response = await convertFromUser(user);

        resolve(response);
    });
}

export async function putPassword(putPassword: { password: string, newPassword: string }, user: User) {

    return new Promise(async (resolve, reject) => {

        // Busco no banco o hash da senha do usuario
        const userPasswordEncrypted = await db('tb_user')
            .select('tb_user.cd_password_hash')
            .where('tb_user.cd_user', '=', user.cd_user);

        // Verifico se a senha que ele enviou corresponde com a hash do banco
        await bCrypt.compare(putPassword.password, userPasswordEncrypted[0].cd_password_hash, async (err, same) => {
            // Caso não seja
            if (!same)
                reject({ message: 'Senha atual incorreta!' });
            // Caso seja
            else {
                // Criptografo a nova senha do usuário
                await bCrypt.hash(putPassword.newPassword, await bCrypt.genSalt(), async (error, encrypted) => {
                    // Verifico se nao houve nenhum erro ao criptografar
                    if (error) {
                        reject({ message: 'Houve um erro inesperado ao criptografar a nova senha. Tente novamente mais tarde.', error });
                        console.log(error)
                    } else {
                        // Caso não tenha erros, armazeno no banco a nova senha do usuário
                        await db('tb_user')
                            .update({ cd_password_hash: encrypted })
                            .where('tb_user.cd_user', '=', user.cd_user)
                            .then(() => resolve({ message: 'Senha atualizada com sucesso!' }))
                            .catch(error => {
                                reject({ message: 'Houve um erro inesperado ao atualizar sua senha. tente novamente mais tarde', error })
                                console.error(error);
                            });
                    }
                });
            }
        });
    });
}