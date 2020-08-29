import  User  from "../models/user.model";
import  Profile  from "../models/profile.model";
import Book from "../models/book.model";
import db from "../database/connection";
import { ViewBook } from "../models/bookOperations.mode";
import { getStatusUserById, getStatusBookById } from "./getStatusById";
import statusUserView from "../models/statusUserView.model";
import statusBookView from "../models/statusBookView.model";
import ImageBook from "../models/imageBook.model";
import { ViewImageBook } from "../models/imageBookOperations.model";
import { getImagesByBook } from "./getImagesByBooks";
import Geolocation from '../models/geolocation.model';
import { ViewGeolocation } from "../models/geolocationOperations.model";
import City from "../models/city.model";
import { ViewCity } from "../models/cityOperations.model";
import UF from "../models/uf.model";

export async function convertFromUser(model: User): Promise<Profile> {
    
    const status: statusUserView = await getStatusUserById(model.cd_status_user);
    const geolocationSearch: Array<Geolocation> = 
        await db('tb_geolocation as g')
            .select('*')
            .where('g.cd_geolocation', '=', model.cd_geolocation);
    
    const citySearch: Array<City> =
        await db('tb_city as c')
            .select('*')
            .where('c.cd_city', '=', model.cd_city);

    const geolocation: ViewGeolocation = convertFromGeolocation(geolocationSearch[0])
    const city: ViewCity = await convertFromCity(citySearch[0]);
    
    return new Promise((resolve) => {
        const userResponse: Profile = {
            user: model.nm_user,
            username: model.nm_username,
            email: model.nm_email_user,
            image: model.cd_user_icon_URL,
            biography: model.ds_biography,
            phone: model.cd_phone_number,
            status,
            city,
            geolocation,
        }
        resolve(userResponse);
    });
}

export function convertFromImageBook(model: ImageBook) {
    const imageBook: ViewImageBook = {
        id: model.cd_image_book,
        image: model.cd_image_URL,
        description: model.ds_image
    }

    return imageBook;
}

export async function convertFromBook(model: Book): Promise<ViewBook> {
    const status: statusBookView = await getStatusBookById(model.cd_status_book);
    const images: Array<ViewImageBook> = await getImagesByBook(model);

    return new Promise((resolve) => {
        const bookResponse: ViewBook = {
            id: model.cd_book as number,
            name: model.nm_book,
            writer: model.nm_writer,
            publisher: model.nm_publisher,
            description: model.ds_book_description,
            status,
            images
        }
        resolve(bookResponse);
    })
}

export function convertFromGeolocation(model: Geolocation): ViewGeolocation {
    const geolocation: ViewGeolocation = {
        latitude: model.cd_latitude,
        longitude: model.cd_longitude
    }

    return geolocation;
}

export async function convertFromCity(model: City) {
    const uf: Array<UF> =
        await db('tb_uf as u')
            .select()
            .where('u.cd_uf', '=', model.cd_uf);

    const city: ViewCity = {
        id: model.cd_city,
        name: model.nm_city.replace(/\b\w/g, l => l.toUpperCase()),
        uf: {
            abbreviation: uf[0].sg_uf,
            name: uf[0].nm_uf
        }
    }

    return city;
}