import { User } from "../models/User.model";
import { Profile } from "../models/profile.model";

export default function convertUserFromProfile(model: User): Profile {
    const userResponse: Profile = {
        user: model.nm_user,
        username: model.nm_username,
        email: model.nm_email_user,
        image: model.cd_user_icon_URL,
        biography: model.ds_biography,
        phone: model.cd_phone_number
    }

    return userResponse;
}