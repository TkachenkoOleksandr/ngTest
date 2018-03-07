import { IBook } from "../interfaces/ibook.interface";
import { Priority } from "./priority";
import { BookStatus } from "./book-status";

export class Book implements IBook {
    key?: string;   
    sendNotification: boolean = false;
    status: BookStatus = BookStatus.ToRead;
    notificationDateTime?: Date;

    constructor(
        public title:string,
        public author: string,
        public categories: string[],
        public priority: Priority,
        public notes: string
    ) {

    }

}
