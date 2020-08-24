import  User  from "../models/user.model";
import  Profile  from "../models/profile.model";
import Book from "../models/book.model";
import { ViewBook } from "../models/bookOperations.mode";
import { getStatusUserById, getStatusBookById } from "./getStatusById";
import statusUserView from "../models/statusUserView.model";
import statusBookView from "../models/statusBookView.model";

export async function convertFromUser(model: User): Promise<Profile> {
    const status: statusUserView = await getStatusUserById(model.cd_status_user);
    console.log(status);
    return new Promise((resolve) => {
        const userResponse: Profile = {
            user: model.nm_user,
            username: model.nm_username,
            email: model.nm_email_user,
            image: model.cd_user_icon_URL,
            biography: model.ds_biography,
            phone: model.cd_phone_number,
            status: status
        }
        resolve(userResponse);
    });
}

export async function convertFromBook(model: Book): Promise<ViewBook> {
    const status: statusBookView = await getStatusBookById(model.cd_status_book);

    return new Promise((resolve) => {
        const bookResponse: ViewBook = {
            id: model.cd_book as number,
            name: model.nm_book,
            writer: model.nm_writer,
            publisher: model.nm_publisher,
            description: model.ds_book_description,
            status
        }
        resolve(bookResponse);
    })
}