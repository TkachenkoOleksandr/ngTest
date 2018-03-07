import { Injectable } from '@angular/core';
import { IUser } from "../interfaces/iuser.interface";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import { NgRedux } from "@angular-redux/store";
import { IAppState } from "../store";
import { AngularFireAuth } from "angularfire2/auth";
import { AuthService } from "./auth.service";
import { Actions } from "../actions";
import * as firebase from 'firebase/app';

@Injectable()
export class UserService {
  userId: string;
  user: IUser;
  userRef: any;

  categoriesRef: AngularFireList<any>;
  categories$: Observable<any[]>;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private ngRedux: NgRedux<IAppState>,
    private authService: AuthService
  ) {      
      this.afAuth.authState.subscribe(user => {
        if(user) {
          this.userId = user.uid;
          this.userRef = db.object(`users/${this.userId}`);          

          this.userRef.valueChanges().subscribe((u: IUser) => {
            if(u) {
              this.user = u;
              this.user.userId = this.userId;

              let cats = !this.user.categories ? [] : this.user.categories;

              this.ngRedux.dispatch({type: Actions.LOAD_USER, user: this.user});
              this.ngRedux.dispatch({type: Actions.LOAD_CATEGORIES, categories: cats});
            }
          });          
        }
      }); 
     
  }

    getUserId() {
      return this.userId;
    } 

    addCategory(cat: string)  {           
      if (!this.userId) return;
      this.user.categories = !this.user.categories ? [] : this.user.categories;
      this.user.categories.push(cat);
      this.userRef.update(this.user)
        .catch(error => console.log(error));     
    
      this.ngRedux.dispatch({type: Actions.ADD_CATEGORY, category: cat});
  }

    removeCategory(cat: string) {    
      if (!this.userId) return;
      var index = this.user.categories.indexOf(cat);
      this.user.categories.splice(index, 1);   
      this.userRef.update(this.user)
          .catch(error => console.log(error));
      this.ngRedux.dispatch({type: Actions.REMOVE_CATEGORY, category: cat});

    }

    updateUserName(userName: string) {
      if(!userName) return;
      this.user.userName = userName;
      
      // update user info
      this.userRef.update(this.user)
        .catch(error => console.log(error));

    }

    updateUserEmail(oldEmail: string, newEmail: string, password: string) {
      if(!oldEmail || !newEmail || !password) return;     
      this.user.email = newEmail;   
      
      // update user info
      this.userRef.update(this.user)
        .catch(error => console.log(error));

      // update user email in Authentication 
      this.authService.updateEmail(oldEmail, newEmail, password);
    }

}
