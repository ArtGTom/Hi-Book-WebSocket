import { NewGeolocation } from "./geolocationOperations.model";

export interface CreateUser {
    user: string,
    username: string,
    email: string,
    password: string,
    biography: string,
    city: {
        name: string,
        uf: string
    },
    geolocation: NewGeolocation
}

export interface SearchUsers{
    radiusDistance?: number,
    uf?: string,
    city?: string
}