import { Injectable } from '@angular/core';
import { EmailNotification } from "../models/emailNotification";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { NgRedux } from "@angular-redux/store";
import { IAppState } from "../store";
import { Actions } from "../actions";

@Injectable()
export class EmailSendingService {

  constructor(
    private http: HttpClient,
    private ngRedux: NgRedux<IAppState>
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  }

  addNotification(notification: EmailNotification) {
    let url = environment.libNoteApiUrl;
    return this.http.post(url, notification, this.httpOptions)
      .subscribe(resp => {
        console.log('Notification added successfully');        
      },
      (error: HttpErrorResponse) => {
        this.handleError(error);
      });
  }

  updateNotification(notification: EmailNotification) {
    let url = environment.libNoteApiUrl;
    return this.http.put(url, notification, this.httpOptions)
      .subscribe(resp => {
        console.log('Notification updated successfully');        
      },
      (error: HttpErrorResponse) => {
        this.handleError(error);
      });
  }

  deleteNotification(bookKey: string, userUid: string) {   
    if(!bookKey || !userUid) return;
    let url = environment.libNoteApiUrl + `?bookKey=${bookKey}&userUid=${userUid}`;
    return this.http.delete(url, this.httpOptions)
      .subscribe(resp => {
        console.log('Notification deleted successfully');
      },
      (error: HttpErrorResponse) => {
        this.handleError(error);
      });
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    this.ngRedux.dispatch({type: Actions.ADD_EXCEPTION, exception: 'Something bad happened. Please try again later.'});
  };

}
