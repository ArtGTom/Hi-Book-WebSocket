import { NewGeolocation } from "./geolocationOperations.model";

export default interface CreateUser {
    user: string,
    username: string,
    email: string,
    password: string,
    biography: string,
    geolocation: NewGeolocation
}