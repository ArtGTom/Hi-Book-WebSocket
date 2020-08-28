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

export async function convertFromUser(model: User): Promise<Profile> {
    
    const status: statusUserView = await getStatusUserById(model.cd_status_user);
    const geolocation: Array<Geolocation> = 
        await db('tb_geolocation as g')
            .select('*')
            .where('g.cd_geolocation', '=', model.cd_geolocation);

    return new Promise((resolve) => {
        const userResponse: Profile = {
            user: model.nm_user,
            username: model.nm_username,
            email: model.nm_email_user,
            image: model.cd_user_icon_URL,
            biography: model.ds_biography,
            phone: model.cd_phone_number,
            status,
            geolocation: {
                latitude: geolocation[0].cd_latitude,
                longitude: geolocation[0].cd_longitude
            }
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