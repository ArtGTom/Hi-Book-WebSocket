export interface BookInterface {
    
}

export interface NewBook {
    name: string,
    description: string,
    writer: string,
    publisher: string
}

export interface ViewBook {
    id: number,
    name: string
    writer: string,
    publisher: string,
    description: string,
}

export interface PutBook {
    name?: string,
    description?: string,
    writer?: string,
    publisher?: string
}