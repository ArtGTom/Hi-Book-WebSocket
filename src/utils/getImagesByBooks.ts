import Book from "../models/book.model";
import ImageBook from "../models/imageBook.model";
import db from '../database/connection';
import { ViewImageBook } from "../models/imageBookOperations.model";
import { convertFromImageBook } from "./convertModelToJSON";

export async function getImagesByBook(book: Book): Promise<Array<ViewImageBook>> {

    return new Promise(async (resolve) => {
        const imagesBook: Array<ImageBook> =
            await db('tb_image_book as ib')
                .select('*')
                .where('ib.cd_book', '=', book.cd_book as number)

        const viewImagesBook: Array<ViewImageBook> = [];

        if (imagesBook.length == 0)
            resolve(viewImagesBook);
        else {
            imagesBook.map(imageBook => {
                viewImagesBook.push(convertFromImageBook(imageBook));
            });

            resolve(viewImagesBook);
        }
    });
}