import statusBookView from "./statusBookView.model";
import { ViewImageBook } from "./imageBookOperations.model";

export interface NewBook {
    name: string,
    description: string,
    writer: string,
    publisher: string,
    status: number
}

export interface ViewBook {
    id: number,
    name: string
    writer: string,
    publisher: string,
    description: string,
    status: statusBookView,
    images: Array<ViewImageBook>
}

export interface PutBook {
    name?: string,
    description?: string,
    writer?: string,
    publisher?: string,
    status?: number
}