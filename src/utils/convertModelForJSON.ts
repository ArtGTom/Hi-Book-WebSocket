import  User  from "../models/user.model";
import  Profile  from "../models/profile.model";
import Book from "../models/book.model";
import { ViewBook } from "../models/bookOperations.mode";

export function convertUserFromProfile(model: User): Profile {
    const userResponse: Profile = {
        user: model.nm_user,
        username: model.nm_username,
        email: model.nm_email_user,
        image: model.cd_user_icon_URL,
        biography: model.ds_biography,
        phone: model.cd_phone_number
    }
    return userResponse;
}

export function convertFromBook(model: Book): ViewBook {
    
    const bookResponse: ViewBook = {
        id: model.cd_book as number,
        name: model.nm_book,
        writer: model.nm_writer,
        publisher: model.nm_publisher,
        description: model.ds_book_description
    }

    return bookResponse;
}