export interface IUser {
    userId?: string,
    email: string,
    password?: string,
    userName: string,
    lastLoginDate: Date,
    categories: string[]
}