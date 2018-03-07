import { IUser } from "../interfaces/iuser.interface";

export class User implements IUser {    
    uid?: string;
    email: string;
    userName: string;
    password?: string;
    categories: string[];
    lastLoginDate: Date;
}