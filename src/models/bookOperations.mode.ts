import statusBookView from "./statusBookView.model";
<<<<<<< HEAD
import { ViewImageBook } from "./imageBookOperations.model";
=======

export interface BookInterface {
    
}
>>>>>>> 5db90d4c8a4755ae3ebf9435fa9a20ba379729b0

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
<<<<<<< HEAD
    status: statusBookView,
    images: Array<ViewImageBook>
=======
    status: statusBookView
>>>>>>> 5db90d4c8a4755ae3ebf9435fa9a20ba379729b0
}

export interface PutBook {
    name?: string,
    description?: string,
    writer?: string,
    publisher?: string,
    status?: number
}