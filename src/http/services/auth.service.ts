import db from './../../database/connection';
import bcrypt from 'bcrypt';
import UF from '../../models/uf.model';
import { GenerateToken } from './../../utils/JWTAuthentication';
import { CreateUser } from './../../models/userOperations.model';

export async function Register(user: CreateUser) {

    const promise = new Promise(async (resolve, reject) => {
        const userExists = await db('tb_user').select('*')
            .where('tb_user.nm_username', '=', user.username)
            .orWhere('tb_user.nm_email_user', '=', user.email);

        user.city.name = user.city.name.toLowerCase().trimLeft().trimRight();

        if (!userExists[0]) {
            let passwordHash: string = '';
            // Criptografa a senha
            await bcrypt.hash(user.password, await bcrypt.genSalt())
                .then(hash => passwordHash = hash)
                .catch(e => console.error(e));

            const trx = await db.transaction();

            const uf: Array<UF> =
                await trx('tb_uf as u')
                    .select()
                    .where('u.sg_uf', '=', user.city.uf.toUpperCase());

            if (uf[0]) {
                /* Procura a cidade no banco */
                const city =
                    await trx('tb_city as c')
                        .select()
                        .where('c.nm_city', '=', user.city.name);

                let city_id = 0;

                /* Verifica se a cidade existe */
                if (!city[0]) {
                    /* Se não tiver vai inserir no banco */
                    const insertedCityIds =
                        await trx('tb_city as c')
                            .insert({
                                nm_city: user.city.name,
                                cd_uf: uf[0].cd_uf
                            })
                            .returning('c.cd_city');

                    city_id = insertedCityIds[0];
                } else {
                    city_id = city[0].cd_city;
                }

                /* Insere a geolocalização no banco */
                const insertedGeolocationIds =
                    await trx('tb_geolocation as g').insert({
                        cd_latitude: user.geolocation.latitude,
                        cd_longitude: user.geolocation.longitude
                    }).returning('g.cd_geolocation');

                const geolocation_id = insertedGeolocationIds[0];

                /* Insere o usuário no banco */
                const insertedUserIds =
                    await trx('tb_user as u').insert({
                        nm_user: user.user,
                        nm_username: user.username,
                        cd_password_hash: passwordHash,
                        nm_email_user: user.email,
                        ds_biography: user.biography,
                        cd_status_user: 1,
                        cd_city: city_id,
                        cd_geolocation: geolocation_id
                    }).returning('u.cd_user');

                trx.commit()
                    .catch(err => {
                        reject({ message: 'Erro inesperado ao cadastrar o novo usuário. Tente novamente mais tarde', status: 400 });
                        console.error(err);
                        trx.rollback();
                    })

                const token = await GenerateToken(insertedUserIds[0]);

                resolve({
                    message: 'Cadastro efetuado com sucesso',
                    token
                });
            } else {
                reject({ message: 'UF inválida!', status: 400 });
            }
        } else {
            reject({ message: 'Login e/ou email não disponíveis!' });
        }
    });
    return promise;
}

export async function Login(credentials: { login: string, password: string }) {

    const promise = new Promise(async (resolve, reject) => {

        const user = await db('tb_user').select('tb_user.cd_user', 'tb_user.nm_username', 'tb_user.nm_email_user', 'tb_user.cd_password_hash')
            .where('tb_user.nm_username', '=', credentials.login)
            .orWhere('tb_user.nm_email_user', '=', credentials.login);
        // Verifica se a busca no banco de dados nao retornou nulo
        if (user[0]) {
            var passwordIsValid: boolean = false;
            // Verifica se a senha enviada é válida
            await bcrypt.compare(credentials.password, user[0].cd_password_hash)
                .then(same => passwordIsValid = same)
                .catch(e => {
                    reject({ message: 'Erro inesperado ao efetuar login. Tente mais tarde.' });
                    console.error(e)
                });

            // Verifica se o login e a senha estão corretos
            if ((user[0].nm_username == credentials.login || user[0].nm_email_user) && passwordIsValid) {
                const token = await GenerateToken(user[0].cd_user);
                resolve({ token });
            } else
                reject({ message: 'Credenciais inválidas!' });
        } else {
            reject({ message: 'Credenciais inválidas!' });
        }
    });

    return promise;
}