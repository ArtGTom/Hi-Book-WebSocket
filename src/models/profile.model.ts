import statusUserView from "./statusUserView.model";
import { ViewGeolocation } from "./geolocationOperations.model";

export default interface Profile {
    user: string,
    username: string,
    email: string,
    image: string,
    biography: string,
    phone: string,
    status: statusUserView,
    geolocation: ViewGeolocation
}