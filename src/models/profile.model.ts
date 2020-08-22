export interface Profile {
    user: string,
    username: string,
    email: string,
    image: string,
    biography: string,
    phone: string
}

export interface PutProfile {
    user?: string,
    username?: string,
    email?: string,
    image?: string,
    biography?: string,
    phone?: string,
}