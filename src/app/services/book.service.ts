import { Injectable } from "@angular/core";
import { FirebaseListObservable  } from 'angularfire2/database-deprecated';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Book } from "../models/book";
import { Observable } from "rxjs/Observable";
import { NgRedux } from "@angular-redux/store/lib/src";
import { IAppState } from "../store";
import { Actions } from "../actions";

import * as firebase from 'firebase/app';
import { IBook } from "../interfaces/ibook.interface";
import 'rxjs/add/operator/map';
import { UserService } from "./user.service";


@Injectable()
export class BookService {
    books: Book[] = null;
    userId: string;
    
    booksRef: AngularFireList<any>;
    books$: Observable<any[]>;

    constructor (
      private db: AngularFireDatabase,
      private afAuth: AngularFireAuth,
      private ngRedux: NgRedux<IAppState>,
      private userService: UserService
    ) {
      this.afAuth.authState.subscribe(user => {
        if(user) {
          this.userId = user.uid;
          this.booksRef = db.list(`books/${this.userId}`);

          this.books$ = this.booksRef.snapshotChanges().map(changes => {
            return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
          });

          this.books$.subscribe(books => {
            this.ngRedux.dispatch({type: Actions.LOAD_BOOKS, books: books});
          });
          
        }
      });    

    }

  addBook(book: Book): string {
    if (!this.userId) return;
    let key = this.booksRef.push(book).key;
    this.ngRedux.dispatch({type: Actions.ADD_BOOK, book: book});
    return key;
  }

  updateBook(book: Book) {
    if (!this.userId) return;    
    this.booksRef.update(book.key, book);
  }

  deleteBook(book: IBook) {    
    this.db.object(`books/${this.userId}/` + book.key).remove();
  }

 

}

