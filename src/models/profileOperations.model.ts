export default interface PutProfile {
    user?: string,
    username?: string,
    email?: string,
    status?: number,
    image?: string,
    biography?: string,
    city?: {
        name?: string,
        uf?: string
    },
    phone?: string,
}