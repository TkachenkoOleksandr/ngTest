import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/observable';
import { IUser } from "../interfaces/iuser.interface";
import { NgRedux } from "@angular-redux/store";
import { IAppState } from "../store";
import { Actions } from "../actions";

@Injectable()
export class AuthService { 
	private user: Observable<firebase.User>;
	private authState: any;

	constructor(private afAuth: AngularFireAuth, 
		private db: AngularFireDatabase, 
		private router: Router,
		private ngRedux: NgRedux<IAppState>
	) {
			this.user = this.afAuth.authState;
		 }

	get currentUserId() : string {
		return this.authState !== null ? this.authState.uid : '';
	}

	authUser() {
		return this.user;
	}

	login(email: string, password: string) {
		return this.afAuth.auth.signInWithEmailAndPassword(email, password)
			.then(resolve => {
				// here will be navigate to books list page
				this.router.navigate(['books']);
			})
			.catch(error => {
				console.log(error);
				this.ngRedux.dispatch({type: Actions.ADD_EXCEPTION, exception: error.message});
			});
	}

	logout() {
		this.afAuth.auth.signOut();
		this.router.navigate(['login']);
	  }

	register(email: string, password: string, userName: string) {
		return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
			.then(user => {
				this.authState = user;
				this.setUserData(email, userName);
				this.router.navigate(['books']);
			}).catch(error => {
				console.log(error);
				this.ngRedux.dispatch({type: Actions.ADD_EXCEPTION, exception: error.message});
			});
	}

	setUserData(email: string, userName: string) {
		let path = `users/${this.currentUserId}`;
		let data: IUser = {
			email,
			userName,
			lastLoginDate: new Date(),
			categories: []
    	}
		
		this.db.object(path).update(data)
			.catch(error => console.log(error));
	}

	updateEmail(oldEmail: string, newEmail: string, password: string) {
		if(!oldEmail || !newEmail || !password) return;
		this.afAuth.auth.signInWithEmailAndPassword(oldEmail, password)
			.then(resolve => {
				var user = firebase.auth().currentUser;	
				
				user.updateEmail(newEmail).then(function() {
				// Update successful.
				console.log('Update successful');
				}).catch(error => {
					console.log(error);
					this.ngRedux.dispatch({type: Actions.ADD_EXCEPTION, exception: error.message});
				});
			});
		
	}

	

}
