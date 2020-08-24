import statusBookView from "./statusBookView.model";

export interface BookInterface {
    
}

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
    status: statusBookView
}

export interface PutBook {
    name?: string,
    description?: string,
    writer?: string,
    publisher?: string,
    status?: number
}