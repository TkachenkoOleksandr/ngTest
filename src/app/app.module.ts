import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HttpClient } from '@angular/common/http';
// forms
import { FormsModule } from '@angular/forms';
// it enables javascript for bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// font-awesome
import { AngularFontAwesomeModule } from 'angular-font-awesome';
// redux
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from './store';
//routing
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BooksListComponent } from './books-list/books-list.component';
import { AddBookFormComponent } from './add-book-form/add-book-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginFormComponent } from './login-form/login-form.component';

// services
import { AuthService } from "./services/auth.service";
import { BookService } from "./services/book.service";
import { UserService } from "./services/user.service";
import { EmailSendingService } from "./services/email-sending.service";

import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireModule } from "angularfire2";
import { environment } from "../environments/environment";
import { BooksComponent } from './books/books.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SearchBlockComponent } from './search-block/search-block.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ExceptionComponent } from './exception/exception.component';




@NgModule({
  declarations: [
    AppComponent,
    BooksListComponent,
    AddBookFormComponent,
    RegisterFormComponent,
    LoginFormComponent,
    BooksComponent,
    NavbarComponent,
    SearchBlockComponent,
    UserProfileComponent,
    ConfirmationModalComponent,
    ExceptionComponent
  ],
  entryComponents: [
    ConfirmationModalComponent, 
    AddBookFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    AngularFontAwesomeModule,
    NgReduxModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    AuthService,
    BookService,
    UserService,  
    EmailSendingService,
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
  }
}
