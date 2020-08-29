import statusUserView from "./statusUserView.model";
import { ViewGeolocation } from "./geolocationOperations.model";
import { ViewCity } from "./cityOperations.model";

export default interface Profile {
    user: string,
    username: string,
    email: string,
    image: string,
    biography: string,
    phone: string,
    city: ViewCity,
    status: statusUserView,
    geolocation: ViewGeolocation
}