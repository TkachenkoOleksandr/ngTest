import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from "../store";
import { NgForm } from "@angular/forms";
import { UserService } from "../services/user.service";
import { IUser } from "../interfaces/iuser.interface";
import { IBook } from "../interfaces/ibook.interface";
import { BookService } from "../services/book.service";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  
  @select((s:IAppState) => s.categories) categories$;
  @select((s:IAppState) => s.user) user$;
  @select((s:IAppState) => s.books) books$;
  user: IUser = null;
  oldEmail: string;
  oldUserName: string;
  password: string = '';

  editUserNameMode: boolean = false;
  editEmailMode: boolean = false;

  category: string;

  constructor(
    private userService: UserService, 
    private ngRedux: NgRedux<IAppState>,
    private booksService: BookService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.authUser().subscribe(user => {
      if(!user) {       
        this.router.navigate(['login']);
      }
    });
  }

  ngOnInit() {
    this.user$.subscribe((user: IUser) => {
      if(!user) return;
      this.user = user;
      this.oldEmail = user.email;
      this.oldUserName = user.userName;
    })
  }

  addCategory(categoryForm: NgForm) {
    this.userService.addCategory(this.category);
    // reset the form values
    categoryForm.reset();
  }

  removeCategory(cat: string) {
    if(!cat) return;
    this.books$.subscribe((books: IBook[]) => {
      books.forEach(book => {
        if(!book.categories) return;
        
        let index = book.categories.indexOf(cat);
        if(index !== -1) {
           book.categories.splice(index,1);
           this.booksService.updateBook(book);
        }
               
      });     
    })
    this.userService.removeCategory(cat);
  }

  editProperty(property: string) {
    if(!property) return;
    switch(property) {
      case 'userName':     
        this.editUserNameMode = !this.editUserNameMode;
        let isUserNameChanged = this.oldUserName !== this.user.userName;
        // if the user is not in edit mode - when it saved info
        if(!this.editUserNameMode && isUserNameChanged) {
          this.userService.updateUserName(this.user.userName);
        }
        break;
      case 'email':
        this.editEmailMode = !this.editEmailMode;
        let isEmailChanged = this.oldEmail !== this.user.email;
        // if the user is not in edit mode - when it saved info
        if(!this.editEmailMode && isEmailChanged) {
          this.userService.updateUserEmail(this.oldEmail, this.user.email, this.password);
        }
        break;
    }  
    
  }

}
